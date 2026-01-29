import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
// IMPORTANTE: Usamos funciones de Realtime Database, no de Firestore
import { ref, get, update } from 'firebase/database';

export default function JuegoScreen() {
    const [puntos, setPuntos] = useState(0);
    const [record, setRecord] = useState(0);

    // Obtener récord al cargar
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            // Usamos ref() y get() de Realtime DB
            get(ref(db, `usuarios/${uid}/puntos`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setRecord(snapshot.val());
                }
            });
        }
    }, []);

    const jugar = () => {
        const puntajeObtenido = Math.floor(Math.random() * 1000); 
        setPuntos(puntajeObtenido);
        guardarSiEsRecord(puntajeObtenido);
    };

    const guardarSiEsRecord = async (nuevoPuntaje: number) => {
        const uid = auth.currentUser?.uid;
        if (uid && nuevoPuntaje > record) {
            // Usamos update() de Realtime DB
            await update(ref(db, `usuarios/${uid}`), { puntos: nuevoPuntaje });
            setRecord(nuevoPuntaje);
            Alert.alert("¡NUEVO RÉCORD!", `Superaste tu marca anterior.`);
        } else {
            Alert.alert("Fin del Juego", `Puntos: ${nuevoPuntaje}. No superaste tu récord de ${record}.`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>ARENA DE COMBATE</Text>
            <View style={styles.scoreBox}>
                <Text style={styles.label}>RÉCORD ACTUAL</Text>
                <Text style={styles.score}>{record}</Text>
            </View>
            <View style={styles.gameBox}>
                <Text style={{color:'#aaa'}}>Puntos Partida:</Text>
                <Text style={styles.currentScore}>{puntos}</Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={jugar}>
                <Text style={styles.btnText}>⚔️ PELEAR ⚔️</Text>
            </TouchableOpacity>
        </View>
    );
}
// Agrega tus estilos StyleSheet abajo...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f13', alignItems: 'center', justifyContent: 'center' },
    titulo: { color: '#d4af37', fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
    scoreBox: { alignItems: 'center', marginBottom: 20 },
    label: { color: '#8b0000', fontWeight: 'bold' },
    score: { color: '#d4af37', fontSize: 40, fontWeight: 'bold' },
    gameBox: { width: 200, height: 150, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 30, borderWidth: 1, borderColor: '#444' },
    currentScore: { color: '#fff', fontSize: 50, fontWeight: 'bold' },
    btn: { backgroundColor: '#27ae60', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 5 },
    btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});