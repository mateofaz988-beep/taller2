// screens/InformacionScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function InformacionScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>CONFIDENCIAL</Text>
            
            <View style={styles.infoBox}>
                <Text style={styles.missionTitle}>OBJETIVO: CAZA INSECTOS</Text>
                <Text style={styles.text}>
                    Una plaga de "Bugs" está destruyendo el código. Tu misión es eliminarlos antes de que se agote el tiempo.
                </Text>
                
                <Text style={[styles.label, {marginTop: 20}]}>DIFICULTAD ADAPTATIVA:</Text>
                <Text style={styles.text}>
                    Los insectos se moverán más rápido y se harán más pequeños conforme aumente tu puntaje.
                </Text>

                <Text style={styles.warning}>⚠️ TIENES 20 SEGUNDOS ⚠️</Text>
            </View>

            <TouchableOpacity 
                style={styles.fightBtn} 
                onPress={() => navigation.replace('Batalla')} // IR AL JUEGO REAL
            >
                <Text style={styles.btnText}>⚔️ INICIAR BATALLA ⚔️</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
                <Text style={{color:'#888'}}>Cancelar Misión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20 },
    header: { color: '#e74c3c', fontSize: 30, fontWeight: 'bold', marginBottom: 20, letterSpacing: 4 },
    infoBox: { backgroundColor: '#222', width: '100%', padding: 25, borderRadius: 15, marginBottom: 40, borderWidth: 1, borderColor: '#444' },
    missionTitle: { color: '#d4af37', fontWeight: 'bold', fontSize: 22, marginBottom: 10, textAlign:'center' },
    label: { color: '#2ecc71', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    text: { color: '#ccc', fontSize: 16, lineHeight: 22, marginBottom: 10 },
    warning: { color: '#e74c3c', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginTop: 20 },
    fightBtn: { backgroundColor: '#c0392b', paddingVertical: 18, width:'100%', borderRadius: 10, elevation: 5, shadowColor: '#f00', shadowOpacity: 0.4, shadowRadius: 10, alignItems:'center' },
    btnText: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 }
});