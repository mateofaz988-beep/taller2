import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        borderColor: '#d4af37', 
    },
    botonPrincipal: {
        backgroundColor: '#8b0000', 
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#d4af37',
        alignItems: 'center',
        marginBottom: 20,
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