
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

import * as LocalAuthentication from 'expo-local-authentication';

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    // --- BIOMETRÍA: Verificación de Hardware (Andy) ---
    // Se ejecuta al cargar la pantalla para ver si el celular tiene lector de huella/rostro
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    //  Andy --- LÓGICA DE AUTENTICACIÓN BIOMÉTRICA ---
    const iniciarSesionBiometrico = async () => {
        try {
            // 1. Verificar si el usuario tiene huellas guardadas en el celular
            const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!savedBiometrics) {
                return Alert.alert(
                    "HUELLA NO ENCONTRADA",
                    "No tienes huellas registradas en este dispositivo. Usa tu contraseña."
                );
            }

            // 2. Ejecutar la autenticación (Prompt nativo del sistema)
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'IDENTIFÍCATE, GUERRERO', // Mensaje en el popup
                fallbackLabel: 'Usar contraseña',
                disableDeviceFallback: false,
            });

            // 3. Validación exitosa
            if (result.success) {
                Alert.alert("ACCESO CONCEDIDO", "El Valhalla te recibe.");
                // Aquí redirigimos al juego o inventario
                navigation.replace('Juego'); // O 'Inventario' según tu flujo
            } else {
                Alert.alert("ACCESO DENEGADO", "No se pudo verificar tu identidad.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("ERROR", "El oráculo biométrico falló.");
        }
    };

    

    const [loading, setLoading] = useState(false);


    const iniciarSesion = async () => {
        if (!email || !password) {
            Alert.alert("CAMPOS VACÍOS", "Un guerrero debe identificarse para entrar al Valhalla.");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Juego'); 
        } catch (error: any) {
            let tituloError = "ACCESO DENEGADO";
            let mensajeError = "Tus credenciales son indignas.";


            if (error.code === 'auth/user-not-found') {
                mensajeError = "Este correo no existe en los anales de Midgard.";
            } else if (error.code === 'auth/wrong-password') {
                mensajeError = "La contraseña es incorrecta.";
            } else if (error.code === 'auth/invalid-email') {
                mensajeError = "El formato del correo es inválido.";
            } else if (error.code === 'auth/network-request-failed') {
                tituloError = "FALLO DE RED";
                mensajeError = "No hay conexión con el Olimpo.";

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                mensajeError = "Este guerrero no existe o la clave es errónea.";
            } else if (error.code === 'auth/network-request-failed') {
                tituloError = "FALLO DE RED";
                mensajeError = "Sin conexión con el Olimpo.";

            }

            Alert.alert(tituloError, mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            
            {/* Título Estilo Épico */}
            <View style={styles.headerContainer}>
                <Text style={styles.titulo}>INICIAR SESIÓN</Text>
                <View style={styles.separator} />
            </View>
            
            {/* Inputs */}
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

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.headerContainer}>
                    <Text style={styles.titulo}>INICIAR SESIÓN</Text>
                    <View style={styles.separator} />
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                    <TextInput 
                        placeholder="ejemplo@midgard.com" 
                        placeholderTextColor="#666"
                        style={[styles.input, email.length > 0 && styles.inputActivo]} 
                        keyboardType="email-address" 
                        onChangeText={setEmail} 
                        value={email} 
                        autoCapitalize="none" 
                    />


                    <Text style={styles.label}>CONTRASEÑA</Text>
                    <TextInput 
                        placeholder="******" 
                        placeholderTextColor="#666"
                        style={[styles.input, password.length > 0 && styles.inputActivo]} 
                        secureTextEntry 
                        onChangeText={setPassword} 
                        value={password} 
                    />
                </View>


            <TouchableOpacity 
                style={styles.botonPrincipal} 
                onPress={iniciarSesion}
                activeOpacity={0.8}
            >
                <Text style={styles.textoBotonPrincipal}>ENTRAR AL REINO</Text>
            </TouchableOpacity>

            {/* ANDY: Botón Biométrico (Solo se muestra si es compatible) */}
            {isBiometricSupported && (
                <TouchableOpacity 
                    style={styles.botonHuella} 
                    onPress={iniciarSesionBiometrico}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoHuella}>🧬 ACCESO BIOMÉTRICO</Text>
                </TouchableOpacity>
            )}
            
            {/* Botón Registro */}
            <TouchableOpacity 
                style={styles.botonSecundario} 
                onPress={() => navigation.navigate('Registro')}
                activeOpacity={0.7}
            >
                <Text style={styles.textoBotonSecundario}>FORJAR NUEVA CUENTA</Text>
            </TouchableOpacity>
        </View>

                <TouchableOpacity 
                    style={[styles.botonPrincipal, loading && { opacity: 0.7 }]} 
                    onPress={iniciarSesion}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <Text style={styles.textoBotonPrincipal}>
                        {loading ? "CARGANDO..." : "ENTRAR AL REINO"}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.botonSecundario} 
                    onPress={() => navigation.navigate('Registro')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.textoBotonSecundario}>FORJAR NUEVA CUENTA</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#0f0f13',
        borderWidth: 5,
        borderColor: '#2a2a2a', 
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 30,
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

        borderColor: '#4a4a4a', 

        borderColor: '#d4af37', 

    },
    botonPrincipal: {
        backgroundColor: '#8b0000', 
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#d4af37',
        alignItems: 'center',

        marginBottom: 15, 
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        marginBottom: 20,

    },
    textoBotonPrincipal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 2,
    },
    
    botonHuella: {
        backgroundColor: '#1c1c1c',
        paddingVertical: 15,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#d4af37',
        alignItems: 'center',
        marginBottom: 20,
    },
    textoHuella: {
        color: '#d4af37',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
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