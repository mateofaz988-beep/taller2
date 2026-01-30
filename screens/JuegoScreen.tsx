import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';

export default function JuegoScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <Text style={styles.title}>GUARIDA DEL HÉROE</Text>
                <View style={styles.underline} />
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Misión Disponible</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>ACTIVA</Text>
                    </View>
                </View>
                <Text style={styles.cardText}>Los insectos invaden el servidor. ¡Detenlos ahora!</Text>
                
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={styles.playBtn} 
                    onPress={() => navigation.navigate('Informacion')}
                >
                    <Text style={styles.playBtnText}>🦟 IR A LA MISIÓN</Text>
                </TouchableOpacity>
            </View>

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

            <TouchableOpacity 
                style={styles.logoutBtn} 
                onPress={() => navigation.replace('Login')}
            >
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#121212', 
        alignItems: 'center', 
        paddingHorizontal: 20 
    },
    header: {
        marginTop: 60,
        marginBottom: 40,
        alignItems: 'center'
    },
    title: { 
        color: '#d4af37', 
        fontSize: 28, 
        fontWeight: 'bold', 
        letterSpacing: 1 
    },
    underline: {
        height: 2,
        width: 100,
        backgroundColor: '#d4af37',
        marginTop: 5,
        borderRadius: 1
    },
    card: { 
        width: '100%', 
        backgroundColor: '#1e1e1e', 
        padding: 20, 
        borderRadius: 20, 
        marginBottom: 20, 
        borderLeftWidth: 6, 
        borderLeftColor: '#d4af37',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    cardTitle: { 
        color: '#fff', 
        fontSize: 22, 
        fontWeight: 'bold' 
    },
    statusBadge: {
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2ecc71'
    },
    statusText: {
        color: '#2ecc71',
        fontSize: 10,
        fontWeight: 'bold'
    },
    cardText: { 
        color: '#aaa', 
        fontSize: 16,
        marginBottom: 20 
    },
    playBtn: { 
        backgroundColor: '#27ae60', 
        paddingVertical: 15, 
        borderRadius: 12, 
        alignItems: 'center',
        shadowColor: '#27ae60',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4
    },
    playBtnText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: 30 
    },
    smallBtn: { 
        backgroundColor: '#2980b9', 
        padding: 20, 
        borderRadius: 15, 
        width: '48%', 
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnEmoji: {
        fontSize: 24,
        marginBottom: 5
    },
    btnLabel: { 
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1
    },
    logoutBtn: { 
        marginTop: 'auto',
        marginBottom: 30,
        padding: 10 
    },
    logoutText: { 
        color: '#c0392b', 
        fontWeight: '600',
        textDecorationLine: 'underline',
        fontSize: 16
    }
});