import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';

export default function Welcome({ navigation }: any) {

    // Imagen de fondo estilo Kratos
    const imagenFondo = "https://i.pinimg.com/originals/2e/c6/b5/2ec6b5e14fe0cba0cb0aa5d2caeeccc6.jpg"; 

    return (
        <ImageBackground source={{ uri: imagenFondo }} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
            
            <View style={styles.overlay}>
                
                <View style={styles.header}>
                    <Text style={styles.titulo}>BIENVENIDOS</Text>
                    {/* Adrian: Detalle visual rústico */}
                    <View style={styles.divider} />
                    
                    <Text style={styles.tallerText}>OLYMPUS ARENA</Text>
                    
                    <View style={styles.teamContainer}>
                        <Text style={styles.integrante}>ADRIAN FAZ</Text>
                        <Text style={styles.integrante}>ANDY ALQUINGA</Text>
                        <Text style={styles.integrante}>CHRISTOPHER ESPINOZA</Text>
                    </View>
                </View>

                <View style={styles.botonesContainer}>
                    {/* Botón Principal - Estilo Rojo Kratos */}
                    <TouchableOpacity 
                        style={styles.botonPrincipal} 
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoBoton}>INICIAR SESIÓN</Text>
                    </TouchableOpacity>

                    {/* Botón Secundario - Estilo Dorado/Bronce */}
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
        backgroundColor: 'rgba(0,0,0,0.7)', // Un poco más oscuro para que resalte el dorado
        justifyContent: 'space-between',
        paddingVertical: 80,
        paddingHorizontal: 25
    },
    header: {
        alignItems: 'center',
    },
    titulo: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#d4af37', // Dorado
        letterSpacing: 6,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 15,
    },
    divider: {
        width: 120,
        height: 3,
        backgroundColor: '#8b0000', // Rojo sangre
        marginVertical: 15,
        borderRadius: 5,
    },
    tallerText: {
        color: '#f51212',
        fontSize: 16,
        letterSpacing: 10,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    teamContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    integrante: {
        color: '#e0e0e0',
        fontSize: 13,
        letterSpacing: 4,
        marginVertical: 3,
        fontWeight: '600',
        textShadowColor: '#000',
        textShadowRadius: 4,
    },
    botonesContainer: {
        gap: 20,
    },
    botonPrincipal: {
        backgroundColor: '#8b0000', 
        paddingVertical: 20,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#5a0000',
        alignItems: 'center',
        shadowColor: "#ff0000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    botonSecundario: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#d4af37',
        alignItems: 'center',
    },
    textoBotonSecundario: {
        color: '#d4af37',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 3,
    }
});