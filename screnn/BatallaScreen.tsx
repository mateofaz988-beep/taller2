import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Animated } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { ref, update, get } from 'firebase/database';

const { width, height } = Dimensions.get('window');

export default function BatallaScreen({ navigation }: any) {
    // --- 1. ESTADOS DEL JUEGO ---
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(30); // Damos un poco más de tiempo
    const [jugando, setJugando] = useState(true);
    const [congelado, setCongelado] = useState(false); // Nuevo estado: ¿Está congelado?

    // Referencia para guardar puntos (necesario para el temporizador)
    const puntosRef = useRef(0);
    useEffect(() => { puntosRef.current = puntos; }, [puntos]);

    // --- 2. ANIMACIONES (Posiciones) ---
    // Cada objeto tiene su propia posición
    const posInsecto = useRef(new Animated.ValueXY({ x: 50, y: 100 })).current;
    const posBomba   = useRef(new Animated.ValueXY({ x: 200, y: 200 })).current;
    const posHielo   = useRef(new Animated.ValueXY({ x: 100, y: 300 })).current; // 🧊
    const posCalavera= useRef(new Animated.ValueXY({ x: 300, y: 100 })).current; // ☠️
    const posFantasma= useRef(new Animated.ValueXY({ x: 150, y: 150 })).current; // 👻
    
    // Animación especial para el Fantasma (Opacidad / Transparencia)
    const opacidadFantasma = useRef(new Animated.Value(1)).current;

    // --- 3. EFECTO DEL FANTASMA (Aparece y Desaparece) ---
    useEffect(() => {
        if (jugando) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacidadFantasma, { toValue: 0, duration: 1000, useNativeDriver: false }), // Se oculta
                    Animated.timing(opacidadFantasma, { toValue: 1, duration: 1000, useNativeDriver: false })  // Se muestra
                ])
            ).start();
        }
    }, [jugando]);

    // --- 4. TEMPORIZADOR ---
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

    // --- 5. MOVIMIENTO DE OBJETOS ---
    useEffect(() => {
        // Si estamos jugando Y NO estamos congelados, movemos cosas
        if (jugando && !congelado) {
            moverTodosLosObjetos();
        }
    }, [jugando, congelado]); // Se ejecuta si cambia el estado de congelado

    const moverTodosLosObjetos = () => {
        // Función para obtener posición random
        const randomX = () => Math.floor(Math.random() * (width - 70));
        const randomY = () => Math.floor(Math.random() * (height - 150)) + 50;

        // Movemos TODOS los objetos a la vez
        Animated.parallel([
            Animated.timing(posInsecto, { toValue: { x: randomX(), y: randomY() }, duration: 1000, useNativeDriver: false }),
            Animated.timing(posBomba,   { toValue: { x: randomX(), y: randomY() }, duration: 1200, useNativeDriver: false }),
            Animated.timing(posHielo,   { toValue: { x: randomX(), y: randomY() }, duration: 1500, useNativeDriver: false }),
            Animated.timing(posCalavera,{ toValue: { x: randomX(), y: randomY() }, duration: 1800, useNativeDriver: false }),
            Animated.timing(posFantasma,{ toValue: { x: randomX(), y: randomY() }, duration: 2000, useNativeDriver: false }),
        ]).start(({ finished }) => {
            // Si termina de moverse y seguimos jugando normal, repetir
            if (finished && jugando && !congelado) {
                moverTodosLosObjetos();
            }
        });
    };

    // --- 6. ACCIONES AL TOCAR ---

    const tocarObjeto = (tipo: string) => {
        if (!jugando || congelado) return; // Si está congelado, no puedes tocar nada

        if (tipo === 'insecto') {
            setPuntos(puntos + 10);
            moverTodosLosObjetos(); // Se mueve al tocarlo
        } 
        else if (tipo === 'fantasma') {
            setPuntos(puntos + 20); // El fantasma vale más
            moverTodosLosObjetos();
        }
        else if (tipo === 'bomba') {
            Alert.alert("💥 BOOM", "Pierdes 5 segundos");
            setTiempo(t => (t > 5 ? t - 5 : 0));
            moverTodosLosObjetos();
        }
        else if (tipo === 'hielo') {
            // Lógica de congelar
            setCongelado(true); // Detiene el movimiento
            Alert.alert("🥶 CONGELADO", "Espera 3 segundos...");
            
            // Después de 3 segundos, descongelar
            setTimeout(() => {
                setCongelado(false); 
            }, 3000);
        }
        else if (tipo === 'calavera') {
            terminarJuego("💀 Tocaste la Calavera. Fin del juego.");
        }
    };

    // --- 7. GUARDAR EN FIREBASE ---
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
                    Alert.alert("¡NUEVO RÉCORD! 🏆", `Hiciste ${puntajeFinal} puntos.`, [
                        { text: "Salir", onPress: () => navigation.replace('Juego') }
                    ]);
                } else {
                    Alert.alert("GAME OVER", `${mensaje}\nPuntos: ${puntajeFinal}`, [
                        { text: "Reintentar", onPress: () => navigation.replace('Juego') }
                    ]);
                }
            } catch (error) { console.log(error); }
        }
    };

    // --- 8. PANTALLA ---
    return (
        <View style={[styles.contenedor, { backgroundColor: congelado ? '#81ecec' : '#2c3e50' }]}>
            
            <View style={styles.marcador}>
                <Text style={styles.texto}>⏳ {tiempo}s</Text>
                <Text style={styles.texto}>🏆 {puntos}</Text>
            </View>

            {jugando && (
                <>
                    {/* INSECTO (Bueno) */}
                    <Animated.View style={[posInsecto.getLayout(), styles.absoluto]}>
                        <TouchableOpacity onPress={() => tocarObjeto('insecto')} style={[styles.bola, {backgroundColor:'#2ecc71'}]}>
                            <Text style={styles.emoji}>🦟</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* FANTASMA (Bueno pero difícil) - Usa opacidad */}
                    <Animated.View style={[posFantasma.getLayout(), styles.absoluto, { opacity: opacidadFantasma }]}>
                        <TouchableOpacity onPress={() => tocarObjeto('fantasma')} style={[styles.bola, {backgroundColor:'#95a5a6'}]}>
                            <Text style={styles.emoji}>👻</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* BOMBA (Malo) */}
                    <Animated.View style={[posBomba.getLayout(), styles.absoluto]}>
                        <TouchableOpacity onPress={() => tocarObjeto('bomba')} style={[styles.bola, {backgroundColor:'#e74c3c'}]}>
                            <Text style={styles.emoji}>💣</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* HIELO (Neutral/Malo) */}
                    <Animated.View style={[posHielo.getLayout(), styles.absoluto]}>
                        <TouchableOpacity onPress={() => tocarObjeto('hielo')} style={[styles.bola, {backgroundColor:'#74b9ff'}]}>
                            <Text style={styles.emoji}>🧊</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* CALAVERA (Muerte) */}
                    <Animated.View style={[posCalavera.getLayout(), styles.absoluto]}>
                        <TouchableOpacity onPress={() => tocarObjeto('calavera')} style={[styles.bola, {backgroundColor:'#000', borderColor:'red'}]}>
                            <Text style={styles.emoji}>☠️</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </>
            )}

            {!jugando && <Text style={styles.textoFin}>Guardando...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { flex: 1 },
    marcador: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: 'rgba(0,0,0,0.5)' },
    texto: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    absoluto: { position: 'absolute' },
    bola: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
    emoji: { fontSize: 30 },
    textoFin: { color: 'white', fontSize: 24, alignSelf: 'center', marginTop: '50%' }
});