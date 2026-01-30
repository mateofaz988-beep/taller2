import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Animated, SafeAreaView } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { ref, update, get } from 'firebase/database';

const { width, height } = Dimensions.get('window');

export default function BatallaScreen({ navigation }: any) {
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(30);
    const [jugando, setJugando] = useState(true);
    const [congelado, setCongelado] = useState(false);

    const puntosRef = useRef(0);
    useEffect(() => { puntosRef.current = puntos; }, [puntos]);

    const posInsecto = useRef(new Animated.ValueXY({ x: 50, y: 100 })).current;
    const posBomba   = useRef(new Animated.ValueXY({ x: 200, y: 200 })).current;
    const posHielo   = useRef(new Animated.ValueXY({ x: 100, y: 300 })).current;
    const posCalavera= useRef(new Animated.ValueXY({ x: 300, y: 100 })).current;
    const posFantasma= useRef(new Animated.ValueXY({ x: 150, y: 150 })).current;
    
    const opacidadFantasma = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (jugando) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacidadFantasma, { toValue: 0.2, duration: 800, useNativeDriver: false }),
                    Animated.timing(opacidadFantasma, { toValue: 1, duration: 800, useNativeDriver: false })
                ])
            ).start();
        }
    }, [jugando]);

    useEffect(() => {
        if (!jugando) return;
        const reloj = setInterval(() => {
            setTiempo((prev) => {
                if (prev <= 1) {
                    clearInterval(reloj);
                    terminarJuego("¡Se acabó el tiempo!");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(reloj);
    }, [jugando]);

    useEffect(() => {
        if (jugando && !congelado) {
            moverTodosLosObjetos();
        }
    }, [jugando, congelado]);

    const moverTodosLosObjetos = () => {
        const randomX = () => Math.floor(Math.random() * (width - 80));
        const randomY = () => Math.floor(Math.random() * (height - 200)) + 100;

        Animated.parallel([
            Animated.timing(posInsecto, { toValue: { x: randomX(), y: randomY() }, duration: 1000, useNativeDriver: false }),
            Animated.timing(posBomba,   { toValue: { x: randomX(), y: randomY() }, duration: 1200, useNativeDriver: false }),
            Animated.timing(posHielo,   { toValue: { x: randomX(), y: randomY() }, duration: 1500, useNativeDriver: false }),
            Animated.timing(posCalavera,{ toValue: { x: randomX(), y: randomY() }, duration: 1800, useNativeDriver: false }),
            Animated.timing(posFantasma,{ toValue: { x: randomX(), y: randomY() }, duration: 2000, useNativeDriver: false }),
        ]).start(({ finished }) => {
            if (finished && jugando && !congelado) {
                moverTodosLosObjetos();
            }
        });
    };

    const tocarObjeto = (tipo: string) => {
        if (!jugando || congelado) return;

        if (tipo === 'insecto') {
            setPuntos(puntos + 10);
            moverTodosLosObjetos();
        } 
        else if (tipo === 'fantasma') {
            setPuntos(puntos + 25);
            moverTodosLosObjetos();
        }
        else if (tipo === 'bomba') {
            Alert.alert("💥 BOOM", "Pierdes 5 segundos");
            setTiempo(t => (t > 5 ? t - 5 : 0));
            moverTodosLosObjetos();
        }
        else if (tipo === 'hielo') {
            setCongelado(true);
            setTimeout(() => { setCongelado(false); }, 3000);
        }
        else if (tipo === 'calavera') {
            terminarJuego("💀 Tocaste la Calavera.");
        }
    };

    const terminarJuego = async (mensaje: string) => {
        setJugando(false);
        const puntajeFinal = puntosRef.current;
        const uid = auth.currentUser?.uid;

        if (uid) {
            try {
                const refPuntos = ref(db, `usuarios/${uid}/puntos`);
                const snapshot = await get(refPuntos);
                const recordActual = snapshot.exists() ? snapshot.val() : 0;

                if (puntajeFinal > recordActual) {
                    await update(ref(db, `usuarios/${uid}`), { puntos: puntajeFinal });
                    Alert.alert("🏆 ¡NUEVO RÉCORD!", `Puntaje: ${puntajeFinal}`, [{ text: "Genial", onPress: () => navigation.replace('Juego') }]);
                } else {
                    Alert.alert("GAME OVER", `${mensaje}\nPuntos: ${puntajeFinal}`, [{ text: "Reintentar", onPress: () => navigation.replace('Juego') }]);
                }
            } catch (error) { console.log(error); }
        }
    };

    return (
        <View style={[styles.contenedor, { backgroundColor: congelado ? '#4facfe' : '#1e272e' }]}>
            <SafeAreaView style={styles.header}>
                <View style={styles.marcador}>
                    <Text style={styles.texto}>⏳ {tiempo}s</Text>
                    <Text style={styles.textoSeparador}>|</Text>
                    <Text style={[styles.texto, {color: '#feca57'}]}>🏆 {puntos}</Text>
                </View>
            </SafeAreaView>

            {jugando ? (
                <>
                    <Animated.View style={[posInsecto.getLayout(), styles.absoluto]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => tocarObjeto('insecto')} style={[styles.bola, styles.shadow, {backgroundColor:'#1dd1a1'}]}>
                            <Text style={styles.emoji}>🦟</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={[posFantasma.getLayout(), styles.absoluto, { opacity: opacidadFantasma }]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => tocarObjeto('fantasma')} style={[styles.bola, styles.shadow, {backgroundColor:'#c8d6e5'}]}>
                            <Text style={styles.emoji}>👻</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={[posBomba.getLayout(), styles.absoluto]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => tocarObjeto('bomba')} style={[styles.bola, styles.shadow, {backgroundColor:'#ff6b6b'}]}>
                            <Text style={styles.emoji}>💣</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={[posHielo.getLayout(), styles.absoluto]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => tocarObjeto('hielo')} style={[styles.bola, styles.shadow, {backgroundColor:'#48dbfb'}]}>
                            <Text style={styles.emoji}>🧊</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={[posCalavera.getLayout(), styles.absoluto]}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => tocarObjeto('calavera')} style={[styles.bola, styles.shadow, {backgroundColor:'#2f3542', borderColor: '#ff4757', borderWidth: 3}]}>
                            <Text style={styles.emoji}>☠️</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </>
            ) : (
                <View style={styles.centro}>
                    <Text style={styles.textoFin}>Guardando resultado...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { flex: 1 },
    header: { width: '100%', alignItems: 'center', marginTop: 20 },
    marcador: { 
        flexDirection: 'row', 
        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
        paddingHorizontal: 30, 
        paddingVertical: 12, 
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center'
    },
    texto: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
    textoSeparador: { color: 'rgba(255,255,255,0.3)', marginHorizontal: 15, fontSize: 22 },
    absoluto: { position: 'absolute' },
    bola: { 
        width: 70, 
        height: 70, 
        borderRadius: 35, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    shadow: {
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    emoji: { fontSize: 35 },
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    textoFin: { color: 'white', fontSize: 20, fontWeight: 'bold', fontStyle: 'italic' }
});