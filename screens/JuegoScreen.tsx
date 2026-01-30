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

            <View style={styles.mainCard}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>MISIÓN ACTIVA</Text>
                    <Text style={styles.cardText}>Invasión detectada en el sector 7. Los bugs están corrompiendo el sistema.</Text>
                </View>
                
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={styles.playBtn} 
                    onPress={() => navigation.navigate('Informacion')}
                >
                    <Text style={styles.playBtnText}>⚔️ IR A LA MISIÓN</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonGrid}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={[styles.smallBtn, { backgroundColor: '#34495e' }]} 
                    onPress={() => navigation.navigate('Ranking')}
                >
                    <Text style={styles.emojiIcon}>🏆</Text>
                    <Text style={styles.smallBtnText}>RANKING</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={[styles.smallBtn, { backgroundColor: '#34495e' }]} 
                    onPress={() => navigation.navigate('Perfil')}
                >
                    <Text style={styles.emojiIcon}>👤</Text>
                    <Text style={styles.smallBtnText}>PERFIL</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.logoutBtn} 
                onPress={() => navigation.replace('Login')}
            >
                <Text style={styles.logoutText}>DESCONECTAR SISTEMA</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#0f141a', 
        alignItems: 'center', 
        paddingHorizontal: 25 
    },
    header: {
        marginTop: 50,
        marginBottom: 40,
        alignItems: 'center'
    },
    title: { 
        color: '#f1c40f', 
        fontSize: 30, 
        fontWeight: '900', 
        letterSpacing: 2,
    },
    underline: {
        height: 3,
        width: 80,
        backgroundColor: '#f1c40f',
        marginTop: 8,
        borderRadius: 2
    },
    mainCard: { 
        width: '100%', 
        backgroundColor: '#1c252e', 
        padding: 25, 
        borderRadius: 24, 
        marginBottom: 20, 
        borderWidth: 1,
        borderColor: '#2c3e50',
        elevation: 15,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    cardInfo: {
        marginBottom: 20
    },
    cardTitle: { 
        color: '#2ecc71', 
        fontSize: 14, 
        fontWeight: 'bold', 
        letterSpacing: 1.5,
        marginBottom: 8
    },
    cardText: { 
        color: '#ecf0f1', 
        fontSize: 18, 
        lineHeight: 24,
        fontWeight: '500' 
    },
    playBtn: { 
        backgroundColor: '#2ecc71', 
        paddingVertical: 18, 
        borderRadius: 16, 
        alignItems: 'center',
        shadowColor: '#27ae60',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5
    },
    playBtnText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '900',
        letterSpacing: 1
    },
    buttonGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: 40 
    },
    smallBtn: { 
        padding: 20, 
        borderRadius: 20, 
        width: '47%', 
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#2c3e50'
    },
    emojiIcon: {
        fontSize: 24,
        marginBottom: 8
    },
    smallBtnText: { 
        color: '#bdc3c7', 
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1
    },
    logoutBtn: { 
        padding: 15,
        marginTop: 'auto',
        marginBottom: 30
    },
    logoutText: { 
        color: '#e74c3c', 
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 2,
        textDecorationLine: 'underline' 
    }
});