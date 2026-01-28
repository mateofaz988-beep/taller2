import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    // --- 1. VERIFICACIÓN DE HARDWARE (Al cargar la pantalla) ---
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    // --- 2. LÓGICA DE HUELLA DIGITAL (Biometría) ---
    const iniciarSesionBiometrico = async () => {
        try {
            const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!hasBiometrics) {
                return Alert.alert("ERROR", "No tienes huellas registradas en este celular.");
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'IDENTIFÍCATE, GUERRERO',
                fallbackLabel: 'Usar contraseña',
            });

            if (result.success) {
                Alert.alert("BIENVENIDO", "El Valhalla te recibe.");
                navigation.replace('Juego'); // O 'Inventario'
            }
        } catch (error) {
            Alert.alert("ERROR", "Falló la autenticación biométrica.");
        }
    };

    // --- 3. LÓGICA DE FIREBASE (Correo y Contraseña) ---
    const iniciarSesion = async () => {
        if (!email || !password) {
            Alert.alert("ATENCIÓN", "Debes ingresar tus credenciales.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Juego'); // O 'Inventario'
        } catch (error: any) {
            Alert.alert("ACCESO DENEGADO", "Correo o contraseña incorrectos.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.headerContainer}>
                <Text style={styles.titulo}>INICIAR SESIÓN</Text>
                <View style={styles.separator} />
            </View>
            
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

            <TouchableOpacity style={styles.botonPrincipal} onPress={iniciarSesion}>
                <Text style={styles.textoBotonPrincipal}>ENTRAR AL REINO</Text>
            </TouchableOpacity>

            {/* Solo mostramos el botón si el celular soporta huella */}
            {isBiometricSupported && (
                <TouchableOpacity style={styles.botonHuella} onPress={iniciarSesionBiometrico}>
                    <Text style={styles.textoHuella}>🧬 USAR HUELLA DIGITAL</Text>
                </TouchableOpacity>
            )}
            
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
        backgroundColor: '#0f0f13',
        borderWidth: 5,
        borderColor: '#2a2a2a', 
    },
    headerContainer: { marginBottom: 40, alignItems: 'center' },
    titulo: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#d4af37', 
        letterSpacing: 4, 
        marginBottom: 10,
    },
    separator: { width: 150, height: 3, backgroundColor: '#8b0000' },
    inputContainer: { marginBottom: 20 },
    label: { color: '#a0a0a0', fontSize: 11, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
    input: { 
        backgroundColor: '#1c1c1c', 
        color: '#f0f0f0', 
        padding: 15, 
        borderRadius: 4, 
        marginBottom: 20, 
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#3a3a3a', 
    },
    botonPrincipal: {
        backgroundColor: '#8b0000', 
        paddingVertical: 15,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#5a0000',
        alignItems: 'center',
        marginBottom: 15,
    },
    textoBotonPrincipal: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    botonHuella: {
        backgroundColor: '#1c1c1c',
        paddingVertical: 12,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#d4af37',
        alignItems: 'center',
        marginBottom: 20,
    },
    textoHuella: { color: '#d4af37', fontWeight: 'bold', fontSize: 14 },
    botonSecundario: { alignItems: 'center', marginTop: 10 },
    textoBotonSecundario: { color: '#d4af37', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline' }
});