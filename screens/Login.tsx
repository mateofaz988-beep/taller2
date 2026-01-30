<<<<<<< HEAD:screnn/Login.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { auth } from '../config/firebaseConfig';
=======
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../firebase/Config';
>>>>>>> 924ad2d9f1eac72091ba92eaf58b54ea95ab103b:screens/Login.tsx
import { signInWithEmailAndPassword } from 'firebase/auth';
// Importación de Andy para la Huella
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biometricSupported, setBiometricSupported] = useState(false);

    // --- 1. VERIFICACIÓN DE HARDWARE (Parte de Andy) ---
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setBiometricSupported(compatible);
        })();
    }, []);

    // --- 2. LÓGICA DE HUELLA (Parte de Andy) ---
    const loginBiometrico = async () => {
        try {
            const saved = await LocalAuthentication.isEnrolledAsync();
            if (!saved) return Alert.alert("Error", "No tienes huellas guardadas.");

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Acceso Biométrico',
                fallbackLabel: 'Usar Contraseña',
            });

            if (result.success) {
                // Si la huella pasa, entramos al juego
                navigation.replace('Juego'); 
            }
        } catch (error) {
            Alert.alert("Error", "Fallo en autenticación biométrica.");
        }
    };

    // --- 3. LÓGICA DE FIREBASE (Parte de Adrian) ---
    const loginNormal = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Ingresa correo y contraseña.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Juego'); 
        } catch (error: any) {
            Alert.alert("Acceso Denegado", "Credenciales incorrectas.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.titulo}>BIENVENIDO GUERRERO</Text>

            {/* Inputs de Adrian */}
            <TextInput 
                placeholder="Correo" 
                placeholderTextColor="#888" 
                style={styles.input} 
                onChangeText={setEmail} 
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput 
                placeholder="Contraseña" 
                placeholderTextColor="#888" 
                style={styles.input} 
                onChangeText={setPassword} 
                value={password}
                secureTextEntry
            />

            {/* Botón Login Normal */}
            <TouchableOpacity style={styles.boton} onPress={loginNormal}>
                <Text style={styles.textoBoton}>ENTRAR</Text>
            </TouchableOpacity>

            {/* Botón Huella (Solo si el celular tiene soporte) */}
            {biometricSupported && (
                <TouchableOpacity style={styles.botonHuella} onPress={loginBiometrico}>
                    <Text style={styles.textoHuella}>🧬 USAR HUELLA DIGITAL</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f13', padding: 20, justifyContent: 'center', alignItems: 'center' },
    titulo: { color: '#d4af37', fontSize: 28, fontWeight: 'bold', marginBottom: 30, letterSpacing: 2 },
    input: { width: '100%', backgroundColor: '#1c1c1c', color: '#fff', padding: 15, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
    boton: { width: '100%', backgroundColor: '#8b0000', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 15 },
    textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    botonHuella: { width: '100%', backgroundColor: 'transparent', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#d4af37' },
    textoHuella: { color: '#d4af37', fontWeight: 'bold' },
    link: { color: '#888', marginTop: 10, textDecorationLine: 'underline' }
});