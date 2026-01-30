import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Animated, ImageBackground, StatusBar, Vibration } from 'react-native';
import { auth, db } from '../firebase/Config';
import { ref, update, get } from 'firebase/database';

const { width, height } = Dimensions.get('window');

// IMPORTANTE: Asegúrate de tener la imagen en la carpeta assets
const IMAGEN_FONDO = require('../assets/kratos.jpeg'); 

export default function BatallaScreen({ navigation }: any) {
    // --- ESTADOS ---
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(20);
    const [nivel, setNivel] = useState(1);
    const [jugando, setJugando] = useState(true);
    const [petrificado, setPetrificado] = useState(false);

    // Referencias para lógica interna
    const puntosRef = useRef(0);
    useEffect(() => { puntosRef.current = puntos; }, [puntos]);

    // --- ANIMACIONES (Posiciones X, Y) ---
    // Usamos ValueXY para poder "teletransportarlos" con setValue
    const posOrbe = useRef(new Animated.ValueXY({ x: 100, y: 100 })).current;
    const posFuego = useRef(new Animated.ValueXY({ x: -200, y: -200 })).current;
    const posMedusa = useRef(new Animated.ValueXY({ x: -200, y: -200 })).current;
    const posZeus = useRef(new Animated.ValueXY({ x: -200, y: -200 })).current;

    // --- 1. TEMPORIZADOR ---
    useEffect(() => {
        if (!jugando) return;
        const reloj = setInterval(() => {
            setTiempo((prev) => {
                if (prev <= 1) {
                    clearInterval(reloj);
                    finDelJuego("EL TIEMPO SE AGOTÓ");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(reloj);
    }, [jugando]);

    // --- 2. MOTOR DE MOVIMIENTO (IA ENEMIGA) ---
    // Este efecto se ejecuta cada vez que cambia el nivel o el estado de juego
    useEffect(() => {
        if (jugando && !petrificado) {
            moverEnemigos();
        }
    }, [jugando, petrificado, nivel]);

    const obtenerPosicionRandom = () => {
        return {
            x: Math.floor(Math.random() * (width - 90)),
            y: Math.floor(Math.random() * (height - 200)) + 80
        };
    };

    const moverEnemigos = () => {
        // CÁLCULO DE DIFICULTAD:
        // Nivel 1: 1200ms (Lento)
        // Nivel 5: 700ms (Rápido)
        // Nivel 10: 200ms (Imposible)
        const velocidadBase = Math.max(200, 1300 - (nivel * 110));

        Animated.parallel([
            // El Orbe (Objetivo) se mueve erráticamente
            Animated.timing(posOrbe, { 
                toValue: obtenerPosicionRandom(), 
                duration: velocidadBase, 
                useNativeDriver: false 
            }),
            // Las trampas se mueven a diferentes ritmos para desorientar
            Animated.timing(posFuego, { toValue: obtenerPosicionRandom(), duration: velocidadBase * 1.2, useNativeDriver: false }),
            Animated.timing(posMedusa, { toValue: obtenerPosicionRandom(), duration: velocidadBase * 1.5, useNativeDriver: false }),
            Animated.timing(posZeus, { toValue: obtenerPosicionRandom(), duration: velocidadBase * 0.8, useNativeDriver: false }), // Zeus es muy rápido
        ]).start(({ finished }) => {
            // Si la animación terminó naturalmente (no fue interrumpida por un click), sigue moviéndose
            if (finished && jugando && !petrificado) {
                moverEnemigos();
            }
        });
    };

    // --- 3. AL TOCAR (Lógica de Teletransporte) ---
    const tocarObjeto = (tipo: string) => {
        if (!jugando || petrificado) return;

        if (tipo === 'orbe') {
            // 1. Detener animación actual INSTANTÁNEAMENTE
            posOrbe.stopAnimation();

            // 2. TELETRANSPORTE: Forzamos la posición a otro lado sin animación
            // Esto evita que se quede quieto si haces muchos clicks
            posOrbe.setValue(obtenerPosicionRandom());

            // 3. Lógica de Puntos
            const nuevosPuntos = puntos + 10;
            setPuntos(nuevosPuntos);
            
            // Subir nivel cada 30 puntos (Más rápido)
            if (nuevosPuntos % 30 === 0) {
                setNivel(n => n + 1);
                // Damos un poco de tiempo extra al subir de nivel
                setTiempo(t => t + 3);
            } else {
                setTiempo(t => t + 1); // +1 segundo por acierto normal
            }

            // 4. Reiniciar movimiento inmediatamente hacia un NUEVO punto
            moverEnemigos();
        } 
        else if (tipo === 'fuego') {
            Vibration.vibrate(100);
            setTiempo(t => (t > 5 ? t - 5 : 0));
            // Mover trampas para que no te vuelvan a pegar
            posFuego.setValue(obtenerPosicionRandom());
            moverEnemigos();
        }
        else if (tipo === 'medusa') {
            Vibration.vibrate(200);
            setPetrificado(true);
            // Congelamos todo 3 segundos
            setTimeout(() => {
                if(jugando) setPetrificado(false);
            }, 3000);
        }
        else if (tipo === 'zeus') {
            Vibration.vibrate(500);
            finDelJuego("TE ALCANZÓ EL RAYO ⚡");
        }
    };

    // --- 4. GAME OVER ---
    const finDelJuego = async (razon: string) => {
        setJugando(false);
        const scoreFinal = puntosRef.current;
        const uid = auth.currentUser?.uid;

        if (uid) {
            try {
                const refDb = ref(db, `usuarios/${uid}/puntos`);
                const snapshot = await get(refDb);
                const recordActual = snapshot.exists() ? snapshot.val() : 0;

                if (scoreFinal > recordActual) {
                    await update(ref(db, `usuarios/${uid}`), { puntos: scoreFinal });
                    Alert.alert("¡DIOS DE LA GUERRA!", `NUEVO RÉCORD: ${scoreFinal}\nNivel: ${nivel}`, [
                        { text: "Salir", onPress: () => navigation.replace('Juego') }
                    ]);
                } else {
                    Alert.alert("DERROTADO", `${razon}\nPuntos: ${scoreFinal}`, [
                        { text: "Reintentar", onPress: () => navigation.replace('Juego') }
                    ]);
                }
            } catch (error) { console.log(error); }
        }
    };

    // Tamaño dinámico: Se hacen más pequeños con el nivel
    const size = Math.max(50, 100 - (nivel * 6));

    return (
        <ImageBackground source={IMAGEN_FONDO} style={styles.fondo} resizeMode="cover">
            {/* Capa oscura si estás petrificado */}
            <View style={[styles.overlay, { backgroundColor: petrificado ? 'rgba(128,128,128,0.8)' : 'rgba(0,0,0,0.4)' }]}>
                <StatusBar hidden />

                {/* HUD */}
                <View style={[styles.hud, { borderColor: tiempo < 5 ? 'red' : '#d4af37' }]}>
                    <Text style={[styles.hudText, {color: tiempo < 5 ? 'red' : '#fff'}]}>⏳ {tiempo}</Text>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.label}>NIVEL</Text>
                        <Text style={[styles.hudText, {color:'#f1c40f'}]}>{nivel}</Text>
                    </View>
                    <Text style={styles.hudText}>Pts: {puntos}</Text>
                </View>

                {petrificado && <Text style={styles.avisoPetrificado}>¡PETRIFICADO!</Text>}

                {jugando && (
                    <>
                        {/* OBJETIVO (ORBE ROJO) - Siempre visible */}
                        <Animated.View style={[posOrbe.getLayout(), styles.absoluto]}>
                            <TouchableOpacity onPress={() => tocarObjeto('orbe')} style={[styles.enemigo, {width: size, height: size, borderColor:'#fff', backgroundColor:'#c0392b'}]}>
                                <Text style={{fontSize: size*0.5}}>🔴</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* TRAMPA 1: FUEGO (Nvl 2+) */}
                        {nivel >= 2 && (
                            <Animated.View style={[posFuego.getLayout(), styles.absoluto]}>
                                <TouchableOpacity onPress={() => tocarObjeto('fuego')} style={[styles.enemigo, {width: size, height: size, borderColor:'#e67e22', backgroundColor:'rgba(255,100,0,0.6)'}]}>
                                    <Text style={{fontSize: size*0.5}}>🔥</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {/* TRAMPA 2: MEDUSA (Nvl 4+) */}
                        {nivel >= 4 && (
                            <Animated.View style={[posMedusa.getLayout(), styles.absoluto]}>
                                <TouchableOpacity onPress={() => tocarObjeto('medusa')} style={[styles.enemigo, {width: size, height: size, borderColor:'#2ecc71', backgroundColor:'rgba(0,200,0,0.6)'}]}>
                                    <Text style={{fontSize: size*0.5}}>🐍</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {/* TRAMPA 3: ZEUS (Nvl 7+) */}
                        {nivel >= 7 && (
                            <Animated.View style={[posZeus.getLayout(), styles.absoluto]}>
                                <TouchableOpacity onPress={() => tocarObjeto('zeus')} style={[styles.enemigo, {width: size, height: size, borderColor:'#f1c40f', backgroundColor:'rgba(255,215,0,0.6)'}]}>
                                    <Text style={{fontSize: size*0.5}}>⚡</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fondo: { flex: 1 },
    overlay: { flex: 1 },
    hud: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20, 
        paddingTop: 40, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        borderBottomWidth: 3, 
        margin: 10,
        borderRadius: 10
    },
    hudText: { color: '#fff', fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' },
    label: { color: '#aaa', fontSize: 10, fontWeight: 'bold' },
    absoluto: { position: 'absolute' },
    enemigo: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 100,
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    },
    avisoPetrificado: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        color: '#ccc',
        fontSize: 40,
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowRadius: 10,
        zIndex: 100
    }
});