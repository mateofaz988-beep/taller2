import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, ImageBackground } from 'react-native';

// --- ASSETS ---
// Asegúrate de que esta imagen exista en tu carpeta assets
const BACKGROUND_IMG = require('../assets/LOBY.jpg');

export default function JuegoScreen({ navigation }: any) {
    return (
        <ImageBackground source={BACKGROUND_IMG} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            
            {/* Capa oscura para resaltar la interfaz */}
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    
                    {/* ENCABEZADO CORREGIDO (Con margen arriba) */}
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>BIENVENIDO AL</Text>
                        <Text style={styles.title}>CAMPO DE BATALLA</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* TARJETA DE MISIÓN PRINCIPAL */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>⚠️ AMENAZA ACTIVA</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>URGENTE</Text>
                            </View>
                        </View>
                        
                        <Text style={styles.cardText}>
                            Los enemigos intentan tomar el control. <Text style={styles.highlight}>Elimina la plaga</Text> antes de que sea tarde.
                        </Text>
                        
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.playBtn} 
                            onPress={() => navigation.navigate('Informacion')}
                        >
                            <Text style={styles.playBtnText}>⚔️ INICIAR CACERÍA</Text>
                        </TouchableOpacity>
                    </View>

                    {/* BOTONES SECUNDARIOS (Ranking y Perfil) */}
                    <View style={styles.row}>
                        <TouchableOpacity 
                            activeOpacity={0.7}
                            style={styles.smallBtn} 
                            onPress={() => navigation.navigate('Ranking')}
                        >
                            <Text style={styles.btnEmoji}>🏆</Text>
                            <Text style={styles.btnLabel}>RANKING</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            activeOpacity={0.7}
                            style={styles.smallBtn} 
                            onPress={() => navigation.navigate('Perfil')}
                        >
                            <Text style={styles.btnEmoji}>👤</Text>
                            <Text style={styles.btnLabel}>PERFIL</Text>
                        </TouchableOpacity>
                    </View>

                    {/* PIE DE PÁGINA (Cerrar Sesión) */}
                    <TouchableOpacity 
                        style={styles.logoutBtn} 
                        onPress={() => navigation.replace('Login')}
                    >
                        <Text style={styles.logoutText}>ABANDONAR (CERRAR SESIÓN)</Text>
                    </TouchableOpacity>

                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }, // Fondo oscuro al 75%
    
    container: { 
        flex: 1, 
        alignItems: 'center', 
        paddingHorizontal: 20,
        // Eliminamos justifyContent: 'center' para usar márgenes manuales arriba
    },

    // --- ENCABEZADO ---
    header: { 
        alignItems: 'center', 
        marginBottom: 40,
        marginTop: 60, // <--- AQUÍ ESTÁ EL ARREGLO DEL ESPACIO SUPERIOR
    },
    subtitle: { color: '#aaa', fontSize: 14, letterSpacing: 4, marginBottom: 5 },
    title: { 
        color: '#d4af37', // Dorado
        fontSize: 32, 
        fontWeight: 'bold', 
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: 'rgba(212, 175, 55, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    },
    divider: { width: 80, height: 3, backgroundColor: '#8b0000', marginTop: 15 },

    // --- TARJETA PRINCIPAL ---
    card: { 
        width: '100%', 
        backgroundColor: 'rgba(255,255,255,0.08)', // Cristal oscuro
        padding: 25, 
        borderRadius: 15, 
        marginBottom: 30, 
        borderWidth: 1, 
        borderColor: '#d4af37', // Borde Dorado
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 10
    },
    cardTitle: { color: '#e74c3c', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
    
    statusBadge: {
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e74c3c'
    },
    statusText: { color: '#e74c3c', fontSize: 10, fontWeight: 'bold' },

    cardText: { color: '#ccc', fontSize: 15, marginBottom: 20, lineHeight: 22 },
    highlight: { color: '#fff', fontWeight: 'bold' },

    // --- BOTÓN JUGAR ---
    playBtn: { 
        backgroundColor: '#8b0000', // Rojo Sangre
        paddingVertical: 18, 
        borderRadius: 8, 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e74c3c',
        shadowColor: "#f00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8
    },
    playBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },

    // --- BOTONES SECUNDARIOS ---
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: 40 
    },
    smallBtn: { 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        padding: 20, 
        borderRadius: 8, 
        width: '48%', 
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#aaa' 
    },
    btnEmoji: { fontSize: 24, marginBottom: 5 },
    btnLabel: { color: '#d4af37', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },

    // --- FOOTER ---
    logoutBtn: { 
        marginTop: 'auto', // Empuja el botón al fondo
        marginBottom: 30,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#666'
    },
    logoutText: { 
        color: '#aaa', 
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1
    }
});