import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';

export default function Welcome({ navigation }: any) {

    
    const imagenFondo = "https://i.pinimg.com/originals/2e/c6/b5/2ec6b5e14fe0cba0cb0aa5d2caeeccc6.jpg"; 

    return (
        <ImageBackground source={{ uri: imagenFondo }} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            
    
            <View style={styles.overlay}>
                
                <View style={styles.header}>
                    <Text style={styles.titulo}>BIENVENIDOS</Text>
                    <Text style={styles.subtitulo1}>TALLER 1 </Text>
                    <Text style={styles.subtitulo}>Adrian Faz </Text>
                    <Text style={styles.subtitulo}>Andy Alquinga </Text>
                    <Text style={styles.subtitulo}>Christopher Espinoza</Text>
                </View>

                <View style={styles.botonesContainer}>
               
                    <TouchableOpacity 
                        style={styles.botonPrincipal} 
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoBoton}>INICIAR SESIÓN</Text>
                    </TouchableOpacity>

                   
                    <TouchableOpacity 
                        style={styles.botonSecundario} 
                        onPress={() => navigation.navigate('Registro')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoBotonSecundario}>FORJAR CUENTA</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 20
    },
    header: {
        marginTop: 50,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#d4af37', 
        letterSpacing: 4,
        textAlign: 'center',
        textShadowColor: '#b22222', 
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    subtitulo: {
        color: '#ccc',
        fontSize: 14,
        letterSpacing: 8, 
        marginTop: 5,
        fontWeight: 'bold',
    },
    subtitulo1: {
        color: '#f51212',
        fontSize: 14,
        letterSpacing: 8, 
        marginTop: 5,
        fontWeight: 'bold',
    },
    botonesContainer: {
        gap: 20,
        marginBottom: 40
    },
    botonPrincipal: {
        backgroundColor: '#8b0000', 
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#5a0000',
        alignItems: 'center',
        shadowColor: "#ff0000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    botonSecundario: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#d4af37',
        alignItems: 'center',
    },
    textoBotonSecundario: {
        color: '#d4af37',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});