import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ImageBackground, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

// --- 1. LIBRERÍAS EXTERNAS & CONFIG ---
import * as LocalAuthentication from 'expo-local-authentication';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config'; 

// --- 2. ASSETS ---
const BACKGROUND_IMG = require('../assets/LOGIN.jpg');

export default function LoginScreen({ navigation }: any) {
    
    // --- 3. ESTADOS ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biometricSupported, setBiometricSupported] = useState(false);

    // --- 4. EFECTOS ---
    useEffect(() => {
        verificarHardwareBiometrico();
    }, []);

    const verificarHardwareBiometrico = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setBiometricSupported(compatible);
    };

    // --- 5. FUNCIONES ---
    const handleLoginBiometrico = async () => {
        try {
            const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!hasBiometrics) return Alert.alert("AVISO", "No hay huellas registradas.");

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Identifícate, Guerrero',
                fallbackLabel: 'Usar Contraseña',
            });

            if (result.success) navigation.replace('Juego'); 
        } catch (error) {
            Alert.alert("ERROR", "No se pudo verificar la identidad.");
        }
    };

    const handleLoginNormal = async () => {
        if (!email.trim() || !password.trim()) return Alert.alert("ATENCIÓN", "Ingresa correo y contraseña.");
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Juego'); 
        } catch (error: any) {
            Alert.alert("ACCESO DENEGADO", "Correo o contraseña incorrectos.");
        }
    };

    // --- 6. RENDERIZADO ---
    return (
        <ImageBackground source={BACKGROUND_IMG} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            <View style={styles.overlay}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        <View style={styles.header}>
                            <Text style={styles.titulo}>BIENVENIDO</Text>
                            <Text style={styles.subtitulo}>GUERRERO ESPARTANO</Text>
                        </View>

                        <View style={styles.form}>
                            <TextInput 
                                placeholder="Correo de Batalla" 
                                placeholderTextColor="#aaa" 
                                style={styles.input} 
                                onChangeText={setEmail} 
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput 
                                placeholder="Contraseña Secreta" 
                                placeholderTextColor="#aaa" 
                                style={styles.input} 
                                onChangeText={setPassword} 
                                value={password}
                                secureTextEntry
                            />

                            <TouchableOpacity style={styles.btnPrimary} onPress={handleLoginNormal} activeOpacity={0.8}>
                                <Text style={styles.btnTextPrimary}>ENTRAR AL CAMPO</Text>
                            </TouchableOpacity>

                            {biometricSupported && (
                                <TouchableOpacity style={styles.btnSecondary} onPress={handleLoginBiometrico} activeOpacity={0.7}>
                                    <Text style={styles.btnTextSecondary}>🧬 ACCESO BIOMÉTRICO</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.footerLink}>
                            <Text style={styles.textFooter}>¿Aún no eres un guerrero? <Text style={styles.textBold}>Regístrate</Text></Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
}

// --- 7. ESTILOS ---
const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

    header: { alignItems: 'center', marginBottom: 50 },
    titulo: { color: '#d4af37', fontSize: 36, fontWeight: 'bold', letterSpacing: 3, textShadowColor: 'rgba(212, 175, 55, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
    subtitulo: { color: '#888', fontSize: 14, letterSpacing: 6, marginTop: 5 },

    form: { width: '100%', marginBottom: 20 },
    input: { backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', padding: 18, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', fontSize: 16 },

    btnPrimary: { width: '100%', backgroundColor: '#8b0000', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e74c3c', shadowColor: "#f00", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
    btnTextPrimary: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },

    btnSecondary: { width: '100%', backgroundColor: 'transparent', padding: 18, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#d4af37' },
    btnTextSecondary: { color: '#d4af37', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

    footerLink: { marginTop: 30 },
    textFooter: { color: '#aaa', fontSize: 14 },
    textBold: { color: '#d4af37', fontWeight: 'bold', textDecorationLine: 'underline' }
});