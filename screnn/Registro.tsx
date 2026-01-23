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

    // --- VALIDACIONES DE SEGURIDAD (Tarea de Adrian) ---
    const validarEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarFortalezaClave = (pass: string) => {
        const tieneEspecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= 6 && tieneEspecial;
    };

    // ANDY contraseña edad nick y email campos validados
    const registrarUsuario = async () => {
        if (!nick || !edad || !email || !password) {
            Alert.alert("CAMPOS INCOMPLETOS", "Un guerrero no puede luchar sin identidad. Llena todos los campos.");
            return;
        }

        if (!validarEmail(email)) {
            Alert.alert("CORREO INVÁLIDO", "La dirección de correo no tiene un formato auténtico de Midgard.");
            return;
        }

        if (!validarFortalezaClave(password)) {
            Alert.alert("CONTRASEÑA DÉBIL", "Tu clave debe ser más fuerte: mínimo 6 caracteres y al menos un número o símbolo.");
            return;
        }

        try {
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

           
            await setDoc(doc(db, "usuarios", uid), {
                nick: nick,
                edad: parseInt(edad), 
                email: email,
                fotoRef: `avatars/${uid}.png`, 
                puntos: 0,
                status: "nuevo guerrero",
                fechaCreacion: new Date()
            });

            Alert.alert("¡ALIANZA FORMADA!", "Tu leyenda ha sido registrada en los anales del Olimpo.");
            navigation.navigate('Login');

        } catch (error: any) {
           
            let tituloError = "ERROR EN EL REGISTRO";
            let mensajeError = "El Olimpo ha rechazado tu petición.";

            if (error.code === 'auth/email-already-in-use') {
                mensajeError = "Este correo ya pertenece a otro guerrero.";
            } else if (error.code === 'auth/network-request-failed') {
                tituloError = "SIN CONEXIÓN";
                mensajeError = "Los servidores de Firebase no responden. Revisa tu conexión a Midgard.";
            } else if (error.code === 'auth/invalid-email') {
                mensajeError = "El correo proporcionado es indigno.";
            }
            
            Alert.alert(tituloError, mensajeError);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <Text style={styles.titulo}>NUEVO GUERRERO</Text>
                <View style={styles.separator} />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>APODO DE BATALLA (NICK)</Text>
                    <TextInput 
                        placeholder="NICK" 
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
                        placeholder="Mínimo 6 caracteres + número" 
                        placeholderTextColor="#666"
                        style={styles.input} 
                        secureTextEntry 
                        onChangeText={setPassword} 
                        value={password} 
                    />
                </View>

                <TouchableOpacity style={styles.botonPrincipal} onPress={registrarUsuario}>
                    <Text style={styles.textoBotonPrincipal}>FORJAR CUENTA</Text>
                </TouchableOpacity>
                
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
        backgroundColor: '#0f0f13',
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
        color: '#d4af37',
        letterSpacing: 3,
        textShadowColor: '#b22222',
        textShadowOffset: { 
            width: 1, 
            height: 1 
        },
        textShadowRadius: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    separator: {
        width: 150,
        height: 3,
        backgroundColor: '#8b0000',
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
        backgroundColor: '#8b0000',
        paddingVertical: 18,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#d4af37',
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
        color: '#d4af37',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        textDecorationLine: 'underline',
    },
});