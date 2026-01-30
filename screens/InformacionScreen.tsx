import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function InformacionScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.content}>
                <Text style={styles.header}>CONFIDENCIAL</Text>
                
                <View style={styles.infoBox}>
                    <Text style={styles.missionTitle}>OBJETIVO: CAZA INSECTOS</Text>
                    
                    <View style={styles.section}>
                        <Text style={styles.label}>MISIÓN:</Text>
                        <Text style={styles.text}>
                            Una plaga de "Bugs" está destruyendo el código. Tu misión es eliminarlos antes de que se agote el tiempo.
                        </Text>
                    </View>
                    
                    <View style={styles.section}>
                        <Text style={styles.label}>DIFICULTAD ADAPTATIVA:</Text>
                        <Text style={styles.text}>
                            Los insectos se moverán más rápido y se harán más pequeños conforme aumente tu puntaje.
                        </Text>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.warning}>⚠️ TIENES 20 SEGUNDOS ⚠️</Text>
                </View>

                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={styles.fightBtn} 
                    onPress={() => navigation.replace('Batalla')}
                >
                    <Text style={styles.btnText}>⚔️ INICIAR BATALLA ⚔️</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.cancelBtn}
                >
                    <Text style={styles.cancelText}>Cancelar Misión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000' 
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25
    },
    header: { 
        color: '#e74c3c', 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 30, 
        letterSpacing: 5,
        textAlign: 'center'
    },
    infoBox: { 
        backgroundColor: '#1a1a1a', 
        width: '100%', 
        padding: 25, 
        borderRadius: 20, 
        marginBottom: 40, 
        borderWidth: 1, 
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5
    },
    missionTitle: { 
        color: '#d4af37', 
        fontWeight: 'bold', 
        fontSize: 22, 
        marginBottom: 20, 
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    section: {
        marginBottom: 15
    },
    label: { 
        color: '#2ecc71', 
        fontWeight: 'bold', 
        fontSize: 14, 
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    text: { 
        color: '#bdc3c7', 
        fontSize: 16, 
        lineHeight: 22 
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 15
    },
    warning: { 
        color: '#e74c3c', 
        fontWeight: 'bold', 
        fontSize: 18, 
        textAlign: 'center' 
    },
    fightBtn: { 
        backgroundColor: '#c0392b', 
        paddingVertical: 18, 
        width: '100%', 
        borderRadius: 15, 
        alignItems: 'center',
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8
    },
    btnText: { 
        color: '#fff', 
        fontSize: 20, 
        fontWeight: 'bold', 
        letterSpacing: 1 
    },
    cancelBtn: {
        marginTop: 20,
        padding: 10
    },
    cancelText: { 
        color: '#666', 
        fontSize: 16,
        textDecorationLine: 'underline'
    }
});