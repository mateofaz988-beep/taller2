<<<<<<< HEAD:screnn/JuegoScreen.tsx
// screens/JuegoScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
=======
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, Image } from 'react-native';
import { auth, db } from '../firebase/Config';
import { doc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
>>>>>>> 924ad2d9f1eac72091ba92eaf58b54ea95ab103b:screens/JuegoScreen.tsx

export default function JuegoScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.title}>GUARIDA DEL HÉROE</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Misión Disponible</Text>
                <Text style={styles.cardText}>Los insectos invaden el servidor.</Text>
                
                {/* BOTÓN VERDE QUE LLEVA A INFORMACIÓN */}
                <TouchableOpacity 
                    style={styles.playBtn} 
                    onPress={() => navigation.navigate('Informacion')}
                >
                    <Text style={styles.btnText}>🦟 IR A LA MISIÓN</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate('Ranking')}>
                    <Text style={styles.btnText}>🏆 RANKING</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate('Perfil')}>
                    <Text style={styles.btnText}>👤 PERFIL</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', padding: 20, paddingTop: 60 },
    title: { color: '#d4af37', fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
    card: { width: '100%', backgroundColor: '#1e1e1e', padding: 20, borderRadius: 15, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#d4af37' },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    cardText: { color: '#aaa', marginBottom: 15 },
    playBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center' },
    row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
    smallBtn: { backgroundColor: '#2980b9', padding: 15, borderRadius: 8, width: '48%', alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold' },
    logoutBtn: { padding: 10 },
    logoutText: { color: '#c0392b', textDecorationLine: 'underline' }
});