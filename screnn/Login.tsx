import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const iniciarSesion = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Juego'); 
        } catch (error: any) {
            Alert.alert("ACCESO DENEGADO", "Tus credenciales son indignas.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Título Estilo Épico */}
            <View style={styles.headerContainer}>
                <Text style={styles.titulo}>INICIAR SESIÓN</Text>
                <View style={styles.separator} />
            </View>
            
            {/* Inputs estilo Piedra Oscura */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                <TextInput 
                    placeholder="ejemplo@midgard.com" 
                    placeholderTextColor="#666"
                    style={styles.input} 
                    keyboardType="email-address" 
                    onChangeText={setEmail} 
                    value={email} 
                    autoCapitalize="none" 
                />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput 
                    placeholder="******" 
                    placeholderTextColor="#666"
                    style={styles.input} 
                    secureTextEntry 
                    onChangeText={setPassword} 
                    value={password} 
                />
            </View>

            {/* Botón Principal (Rojo Espartano) */}
            <TouchableOpacity style={styles.botonPrincipal} onPress={iniciarSesion}>
                <Text style={styles.textoBotonPrincipal}>ENTRAR AL REINO</Text>
            </TouchableOpacity>
            
            {/* Botón Secundario (Estilo Bronce/Fantasma) */}
            <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.textoBotonSecundario}>FORJAR NUEVA CUENTA</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 30, 
        backgroundColor: '#0f0f13', // Fondo casi negro
        borderWidth: 5,
        borderColor: '#2a2a2a', // Marco de pantalla
    },
    headerContainer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    titulo: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#d4af37', // Dorado viejo
        letterSpacing: 4, // Espaciado épico
        textShadowColor: '#b22222', // Sombra roja
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 10,
    },
    separator: {
        width: 150,
        height: 3,
        backgroundColor: '#8b0000', // Línea roja sangre
    },
    inputContainer: {
        marginBottom: 30,
    },
    label: {
        color: '#a0a0a0',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 5,
        marginLeft: 5,
    },
    input: { 
        backgroundColor: '#1c1c1c', // Piedra oscura
        color: '#f0f0f0', // Texto claro
        padding: 18, 
        borderRadius: 4, 
        marginBottom: 20, 
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#3a3a3a', // Borde metálico oscuro
    },
    botonPrincipal: {
        backgroundColor: '#8b0000', // Rojo Sangre
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#5a0000',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#ff0000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    textoBotonPrincipal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 2,
    },
    botonSecundario: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#d4af37', // Borde Dorado
        alignItems: 'center',
    },
    textoBotonSecundario: {
        color: '#d4af37', // Texto Dorado
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});