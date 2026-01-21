import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { doc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function JuegoScreen({ navigation }: any) {
    
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(10);
    const [juegoActivo, setJuegoActivo] = useState(true);
    const [posicion, setPosicion] = useState({ top: 100, left: 100 });
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
            console.log("Error trayendo ranking:", error);
        }
    };

    function aplastar() {
        if (juegoActivo) {
            setPuntos(puntos + 1);
            const nuevaTop = Math.floor(Math.random() * 400) + 150; 
            const nuevaLeft = Math.floor(Math.random() * 300) + 20;
            setPosicion({ top: nuevaTop, left: nuevaLeft });
        }
    }

    const terminarJuego = async () => {
        setJuegoActivo(false);
        try {
            const uid = auth.currentUser?.uid;
            if (uid) {
                const userRef = doc(db, "usuarios", uid);
                await updateDoc(userRef, {
                    puntos: puntos
                });
                Alert.alert("TIEMPO AGOTADO", `Has recolectado ${puntos} almas.`);
                obtenerTopJugadores(); 
            }
        } catch (error) {
            Alert.alert("ERROR", "No se pudo registrar tu hazaña.");
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

                {/* TABLA DE LÍDERES (TOP 5) */}
                <View style={styles.rankingContainer}>
                    <Text style={styles.rankingTitulo}>🏆 GUERREROS LEGENDARIOS 🏆</Text>
                    {lideres.map((jugador, index) => (
                        <View key={index} style={styles.filaRanking}>
                            <Text style={[styles.textoRanking, index === 0 && styles.oro]}>
                                #{index + 1} {jugador.nick}
                            </Text>
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
                        <Text style={{ fontSize: 40 }}>👺</Text>
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
        paddingTop: 30,
        borderWidth: 5,
        borderColor: '#2a2a2a',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 10, 
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d4af37',
        letterSpacing: 3,
        marginBottom: 10,
        textShadowColor: '#b22222',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
    marcadorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 15,
    },
    marcadorBox: {
        backgroundColor: '#1c1c1c',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#3a3a3a',
        alignItems: 'center',
        minWidth: 80,
    },
    label: {
        color: '#a0a0a0',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    valor: {
        color: '#f0f0f0',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Estilos del Ranking
    rankingContainer: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        width: '90%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#8b0000',
        borderRadius: 4,
    },
    rankingTitulo: {
        color: '#d4af37',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        letterSpacing: 1,
    },
    filaRanking: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    textoRanking: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: 'bold',
    },
    oro: {
        color: '#ffd700', // Color dorado brillante para el #1
        textShadowColor: 'orange',
        textShadowRadius: 5,
    },
    // Fin estilos Ranking
    insecto: {
        position: 'absolute',
        padding: 10,
        zIndex: 20, 
    },
    enemigoVisual: {
        shadowColor: "#ff0000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    gameOverContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 30,
    },
    finTexto: {
        fontSize: 40,
        color: '#8b0000',
        fontWeight: 'bold',
        letterSpacing: 4,
        marginBottom: 30,
        textShadowColor: '#fff',
        textShadowRadius: 2,
    },
    botonReinicio: {
        backgroundColor: '#2e7d32',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderWidth: 2,
        borderColor: '#1b5e20',
        borderRadius: 2,
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 2,
    },
    botonSalir: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#8b0000',
        paddingBottom: 5,
        zIndex: 40,
    },
    textoBotonSalir: {
        color: '#8b0000',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 2,
    }
});