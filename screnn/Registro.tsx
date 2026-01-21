import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Registro({ navigation }: any) {
    const [nick, setNick] = useState('');
    const [edad, setEdad] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registrarUsuario = async () => {
        if (nick === '' || edad === '' || email === '' || password === '') {
            Alert.alert("Error", "Debes llenar todos los campos para iniciar tu viaje.");
            return;
        }

        try {
            // 1. Crear usuario en Autenticación
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // 2. Guardar datos en Firestore
            await setDoc(doc(db, "usuarios", uid), {
                nick: nick,
                edad: edad,
                email: email,
                puntos: 0 
            });

            Alert.alert("¡Alianza Formada!", "Tu registro ha sido completado.");
            navigation.navigate('Login');

        } catch (error: any) {
            Alert.alert("Error en el registro", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <Text style={styles.titulo}>NUEVO GUERRERO</Text>
                <View style={styles.separator} />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>TU APODO DE BATALLA (NICK)</Text>
                    <TextInput 
                        placeholder="APODO" 
                        placeholderTextColor="#666"
                        style={styles.input} 
                        onChangeText={setNick} 
                        value={nick} 
                    />

                    <Text style={styles.label}>EDAD</Text>
                    <TextInput 
                        placeholder="Años" 
                        placeholderTextColor="#666"
                        style={styles.input} 
                        keyboardType="numeric" 
                        onChangeText={setEdad} 
                        value={edad} 
                    />

                    <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                    <TextInput 
                        placeholder="guerrero@midgard.com" 
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

                {/* Botón Principal */}
                <TouchableOpacity style={styles.botonPrincipal} onPress={registrarUsuario}>
                    <Text style={styles.textoBotonPrincipal}>UNIRSE A LA BATALLA</Text>
                </TouchableOpacity>
                
                {/* Botón Secundario */}
                <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.textoBotonSecundario}>VOLVER AL LOGIN</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#0f0f13', // Fondo negro/gris oscuro
        borderWidth: 5,
        borderColor: '#2a2a2a', 
    },
    scrollContainer: {
        padding: 30,
        justifyContent: 'center',
    },
    titulo: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#d4af37', // Dorado
        letterSpacing: 3, 
        textShadowColor: '#b22222', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 10,
        marginTop: 20
    },
    separator: {
        width: 150,
        height: 3,
        backgroundColor: '#8b0000', // Línea roja
        alignSelf: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
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
        backgroundColor: '#1c1c1c', 
        color: '#f0f0f0', 
        padding: 18, 
        borderRadius: 2, 
        marginBottom: 20, 
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#3a3a3a', 
    },
    botonPrincipal: {
        backgroundColor: '#2e7d32', // Verde oscuro para diferenciar (Acción positiva)
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#1b5e20',
        alignItems: 'center',
        marginBottom: 20,
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
        alignItems: 'center',
    },
    textoBotonSecundario: {
        color: '#888', 
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        textDecorationLine: 'underline'
    }
});