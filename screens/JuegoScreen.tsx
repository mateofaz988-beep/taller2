import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, Image } from 'react-native';
import { auth, db } from '../firebase/Config';
import { doc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function JuegoScreen({ navigation }: any) {
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(10);
    const [juegoActivo, setJuegoActivo] = useState(true);
    const [posicion, setPosicion] = useState({ top: 250, left: 150 });
    const [lideres, setLideres] = useState<any[]>([]);

    useEffect(() => {
        obtenerTopJugadores();
    }, []);

    useEffect(() => {
        if (tiempo > 0 && juegoActivo) {
            const temporizador = setTimeout(() => {
                setTiempo(tiempo - 1);
            }, 1000);
            return () => clearTimeout(temporizador);
        } else if (tiempo === 0 && juegoActivo) {
            terminarJuego();
        }
    }, [tiempo, juegoActivo]);

    const obtenerTopJugadores = async () => {
        try {
            const q = query(collection(db, "usuarios"), orderBy("puntos", "desc"), limit(5));
            const querySnapshot = await getDocs(q);
            const lista: any[] = [];
            querySnapshot.forEach((doc) => {
                lista.push(doc.data());
            });
            setLideres(lista);
        } catch (error) {
            console.log(error);
        }
    };

    function aplastar() {
        if (juegoActivo) {
            setPuntos(puntos + 1);
            const nuevaTop = Math.floor(Math.random() * 350) + 180; 
            const nuevaLeft = Math.floor(Math.random() * 280) + 20;
            setPosicion({ top: nuevaTop, left: nuevaLeft });
        }
    }

    const terminarJuego = async () => {
        setJuegoActivo(false);
        try {
            const uid = auth.currentUser?.uid;
            if (uid) {
                const userRef = doc(db, "usuarios", uid);
                await updateDoc(userRef, { puntos: puntos });
                Alert.alert("BATALLA FINALIZADA", `Has recolectado ${puntos} almas.`);
                obtenerTopJugadores(); 
            }
        } catch (error) {
            Alert.alert("ERROR", "Hazaña no registrada.");
        }
    };

    const reiniciar = () => {
        setPuntos(0);
        setTiempo(10);
        setJuegoActivo(true);
    };

    const cerrarSesion = () => {
        auth.signOut();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <Text style={styles.titulo}>CAMPOS DE BATALLA</Text>
                
                <View style={styles.marcadorContainer}>
                    <View style={styles.marcadorBox}>
                        <Text style={styles.label}>TIEMPO</Text>
                        <Text style={styles.valor}>{tiempo}s</Text>
                    </View>
                    <View style={styles.marcadorBox}>
                        <Text style={styles.label}>ALMAS</Text>
                        <Text style={styles.valor}>{puntos}</Text>
                    </View>
                </View>

                <View style={styles.rankingContainer}>
                    <Text style={styles.rankingTitulo}>🏆 TOP GUERREROS 🏆</Text>
                    {lideres.map((jugador, index) => (
                        <View key={index} style={styles.filaRanking}>
                            <View style={styles.rankInfo}>
                                {jugador.fotoUriLocal && (
                                    <Image 
                                        source={{ uri: jugador.fotoUriLocal }} 
                                        style={styles.miniAvatar} 
                                    />
                                )}
                                <Text style={[styles.textoRanking, index === 0 && styles.oro]}>
                                    #{index + 1} {jugador.nick}
                                </Text>
                            </View>
                            <Text style={[styles.textoRanking, index === 0 && styles.oro]}>
                                {jugador.puntos} ☠️
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {juegoActivo ? (
                <TouchableOpacity
                    onPress={aplastar}
                    activeOpacity={0.8}
                    style={[styles.insecto, { top: posicion.top, left: posicion.left }]}
                >
                    <View style={styles.enemigoVisual}>
                        <Text style={{ fontSize: 45 }}>👺</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.finTexto}>FIN DEL JUEGO</Text>
                    <TouchableOpacity style={styles.botonReinicio} onPress={reiniciar}>
                        <Text style={styles.textoBoton}>LUCHAR DE NUEVO</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.botonSalir} onPress={cerrarSesion}>
                <Text style={styles.textoBotonSalir}>ABANDONAR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f13',
        paddingTop: 40,
        borderWidth: 5,
        borderColor: '#2a2a2a',
    },
    header: {
        alignItems: 'center',
        zIndex: 10, 
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#d4af37',
        letterSpacing: 2,
        marginBottom: 10,
    },
    marcadorContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15,
    },
    marcadorBox: {
        backgroundColor: '#1c1c1c',
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#3a3a3a',
        alignItems: 'center',
        minWidth: 90,
    },
    label: {
        color: '#a0a0a0',
        fontSize: 10,
        fontWeight: 'bold',
    },
    valor: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    rankingContainer: {
        backgroundColor: 'rgba(28, 28, 28, 0.95)',
        width: '90%',
        padding: 12,
        borderWidth: 2,
        borderColor: '#8b0000',
        borderRadius: 8,
    },
    rankingTitulo: {
        color: '#d4af37',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    filaRanking: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    rankInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#d4af37',
    },
    textoRanking: {
        color: '#ccc',
        fontSize: 13,
        fontWeight: 'bold',
    },
    oro: {
        color: '#ffd700', 
    },
    insecto: {
        position: 'absolute',
        zIndex: 20, 
    },
    enemigoVisual: {
        shadowColor: "#ff0000",
        shadowRadius: 15,
        shadowOpacity: 0.9,
    },
    gameOverContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 30,
    },
    finTexto: {
        fontSize: 36,
        color: '#8b0000',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    botonReinicio: {
        backgroundColor: '#8b0000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#d4af37',
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    botonSalir: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
    },
    textoBotonSalir: {
        color: '#d4af37',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});