import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --- SEGURIDAD Y VALIDACIÓN (Adrian) ---
    const iniciarSesion = async () => {
        // Validación de campos vacíos antes de consultar al servidor
        if (!email || !password) {
            Alert.alert("CAMPOS VACÍOS", "Un guerrero debe identificarse para entrar al Valhalla.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Juego'); 
        } catch (error: any) {
            // Adrian: Mensajes de error claros y específicos según el PEA
            let tituloError = "ACCESO DENEGADO";
            let mensajeError = "Tus credenciales son indignas.";

            if (error.code === 'auth/user-not-found') {
                mensajeError = "Este correo no existe en los anales de Midgard.";
            } else if (error.code === 'auth/wrong-password') {
                mensajeError = "La contraseña es incorrecta. ¡Inténtalo de nuevo!";
            } else if (error.code === 'auth/invalid-email') {
                mensajeError = "El formato del correo es inválido.";
            } else if (error.code === 'auth/network-request-failed') {
                tituloError = "FALLO DE RED";
                mensajeError = "No hay conexión con el Olimpo. Revisa tu internet.";
            }

            Alert.alert(tituloError, mensajeError);
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
            
            {/* Inputs estilo Piedra Oscura con validación visual sutil */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                <TextInput 
                    placeholder="ejemplo@midgard.com" 
                    placeholderTextColor="#666"
                    style={[styles.input, !email && email.length === 0 ? null : styles.inputActivo]} 
                    keyboardType="email-address" 
                    onChangeText={setEmail} 
                    value={email} 
                    autoCapitalize="none" 
                />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput 
                    placeholder="******" 
                    placeholderTextColor="#666"
                    style={[styles.input, !password && password.length === 0 ? null : styles.inputActivo]} 
                    secureTextEntry 
                    onChangeText={setPassword} 
                    value={password} 
                />
            </View>

            {/* Botón Principal (Rojo Espartano) */}
            <TouchableOpacity 
                style={styles.botonPrincipal} 
                onPress={iniciarSesion}
                activeOpacity={0.8}
            >
                <Text style={styles.textoBotonPrincipal}>ENTRAR AL REINO</Text>
            </TouchableOpacity>
            
            {/* Botón Secundario (Estilo Bronce/Fantasma) */}
            <TouchableOpacity 
                style={styles.botonSecundario} 
                onPress={() => navigation.navigate('Registro')}
                activeOpacity={0.7}
            >
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
        backgroundColor: '#0f0f13',
        borderWidth: 5,
        borderColor: '#2a2a2a', 
    },
    headerContainer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    titulo: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#d4af37', 
        letterSpacing: 4, 
        textShadowColor: '#b22222', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 10,
    },
    separator: {
        width: 150,
        height: 3,
        backgroundColor: '#8b0000', 
    },
    inputContainer: {
        marginBottom: 30,
    },
    label: {
        color: '#a0a0a0',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 5,
    },
    input: { 
        backgroundColor: '#1c1c1c', 
        color: '#f0f0f0', 
        padding: 18, 
        borderRadius: 4, 
        marginBottom: 20, 
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#3a3a3a', 
    },
    inputActivo: {
        borderColor: '#4a4a4a', // Se ilumina levemente al escribir
    },
    botonPrincipal: {
        backgroundColor: '#8b0000', 
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#5a0000',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
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
        borderColor: '#d4af37', 
        alignItems: 'center',
    },
    textoBotonSecundario: {
        color: '#d4af37', 
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});