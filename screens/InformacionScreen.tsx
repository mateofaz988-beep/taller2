import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ImageBackground, ScrollView } from 'react-native';

// --- ASSETS ---
const BACKGROUND_IMG = require('../assets/INFORMACION.jpg');

export default function InformacionScreen({ navigation }: any) {
    return (
        <ImageBackground source={BACKGROUND_IMG} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            
            {/* Capa oscura para legibilidad */}
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        
                        <Text style={styles.header}>MANDATO DE ARES</Text>
                        
                        <View style={styles.infoBox}>
                            <Text style={styles.missionTitle}>OBJETIVO: CONQUISTA EL OLIMPO</Text>
                            
                            {/* SECCIÓN 1: MISIÓN */}
                            <View style={styles.section}>
                                <Text style={styles.label}>TU MISIÓN:</Text>
                                <Text style={styles.text}>
                                    Recolecta los <Text style={{color:'#e40000', fontWeight:'bold'}}>Orbes Rojos</Text> para ganar poder y tiempo. 
                                    Los dioses intentarán detenerte.
                                </Text>
                            </View>
                            
                            {/* SECCIÓN 2: PELIGROS */}
                            <View style={styles.section}>
                                <Text style={styles.label}>AMENAZAS:</Text>
                                <Text style={styles.text}>
                                    🔥 <Text style={{fontWeight:'bold'}}>Fuego:</Text> Quema tu tiempo.{'\n'}
                                    🐍 <Text style={{fontWeight:'bold'}}>Medusa:</Text> Te petrifica 3 segundos.{'\n'}
                                    ⚡ <Text style={{fontWeight:'bold'}}>Zeus:</Text> Castigo masivo de tiempo.
                                </Text>
                            </View>

                            {/* SECCIÓN 3: DIFICULTAD */}
                            <View style={styles.section}>
                                <Text style={styles.label}>DIFICULTAD ASCENDENTE:</Text>
                                <Text style={styles.text}>
                                    A mayor nivel, mayor velocidad. Solo los verdaderos espartanos sobreviven al nivel 10.
                                </Text>
                            </View>

                            <View style={styles.divider} />
                            <Text style={styles.warning}>⚠️ INICIAS CON 20 SEGUNDOS ⚠️</Text>
                        </View>

                        {/* BOTÓN BATALLA */}
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.fightBtn} 
                            onPress={() => navigation.replace('Batalla')}
                        >
                            <Text style={styles.btnText}>⚔️ A LA GUERRA ⚔️</Text>
                        </TouchableOpacity>

                        {/* BOTÓN CANCELAR */}
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()} 
                            style={styles.cancelBtn}
                        >
                            <Text style={styles.cancelText}>RETIRARSE</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }, // Fondo muy oscuro para leer bien
    container: { flex: 1 },
    
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
        paddingTop: 40
    },
    
    header: { 
        color: '#d4af37', // Dorado
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 30, 
        letterSpacing: 4,
        textAlign: 'center',
        textShadowColor: 'rgba(212, 175, 55, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    },

    infoBox: { 
        backgroundColor: 'rgba(255,255,255,0.08)', // Efecto cristal oscuro
        width: '100%', 
        padding: 25, 
        borderRadius: 15, 
        marginBottom: 40, 
        borderWidth: 1, 
        borderColor: '#8b0000', // Borde rojo sangre
    },

    missionTitle: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 20, 
        marginBottom: 20, 
        textAlign: 'center',
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        paddingBottom: 10
    },

    section: { marginBottom: 15 },
    
    label: { 
        color: '#d4af37', // Dorado
        fontWeight: 'bold', 
        fontSize: 14, 
        marginBottom: 5,
        letterSpacing: 1
    },
    
    text: { 
        color: '#ccc', 
        fontSize: 15, 
        lineHeight: 22 
    },

    divider: {
        height: 1,
        backgroundColor: '#555',
        marginVertical: 15
    },

    warning: { 
        color: '#e74c3c', // Rojo brillante
        fontWeight: 'bold', 
        fontSize: 16, 
        textAlign: 'center',
        letterSpacing: 1
    },

    fightBtn: { 
        backgroundColor: '#8b0000', 
        paddingVertical: 18, 
        width: '100%', 
        borderRadius: 8, 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e74c3c',
        shadowColor: '#f00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8
    },

    btnText: { 
        color: '#fff', 
        fontSize: 20, 
        fontWeight: 'bold', 
        letterSpacing: 2 
    },

    cancelBtn: { marginTop: 20, padding: 10 },
    cancelText: { 
        color: '#666', 
        fontSize: 14,
        textDecorationLine: 'underline',
        fontWeight: 'bold'
    }
});