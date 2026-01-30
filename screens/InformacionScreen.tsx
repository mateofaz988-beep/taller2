import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function InformacionScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.headerContainer}>
                <Text style={styles.header}>CONFIDENCIAL</Text>
                <View style={styles.lineaRoja} />
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.missionTitle}>OBJETIVO: CAZA INSECTOS</Text>
                <View style={styles.section}>
                    <Text style={styles.label}>SINOPSIS</Text>
                    <Text style={styles.text}>Una plaga de "Bugs" está destruyendo el código fuente. Tu misión es eliminarlos antes de que el sistema colapse.</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>INTELIGENCIA ADAPTATIVA</Text>
                    <Text style={styles.text}>Los objetivos aumentarán su velocidad y reducirán su tamaño de forma proporcional a tu éxito.</Text>
                </View>
                <View style={styles.warningContainer}>
                    <Text style={styles.warning}>⚠️ TIEMPO LÍMITE: 20 SEGUNDOS ⚠️</Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.fightBtn} onPress={() => navigation.replace('Batalla')}>
                <Text style={styles.btnText}>⚔️ INICIAR BATALLA ⚔️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>ABORTAR MISIÓN</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 25 },
    headerContainer: { alignItems: 'center', marginBottom: 30 },
    header: { color: '#ff4d4d', fontSize: 34, fontWeight: '900', letterSpacing: 6 },
    lineaRoja: { height: 2, width: '60%', backgroundColor: '#ff4d4d', marginTop: 5 },
    infoBox: { 
        backgroundColor: '#161616', width: '100%', padding: 25, borderRadius: 20, marginBottom: 40, borderWidth: 1, borderColor: '#333',
        elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 
    },
    missionTitle: { color: '#f1c40f', fontWeight: '900', fontSize: 20, marginBottom: 20, textAlign: 'center' },
    section: { marginBottom: 15 },
    label: { color: '#2ecc71', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
    text: { color: '#bdc3c7', fontSize: 16, lineHeight: 22, textAlign: 'justify' },
    warningContainer: { marginTop: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#333' },
    warning: { color: '#ff4d4d', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
    fightBtn: { backgroundColor: '#e74c3c', paddingVertical: 20, width: '100%', borderRadius: 12, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#c0392b' },
    btnText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
    cancelBtn: { marginTop: 25, padding: 10 },
    cancelText: { color: '#555', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' }
});