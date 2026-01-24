import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView, Image } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function Registro({ navigation }: any) {
    const [nick, setNick] = useState('');
    const [edad, setEdad] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const seleccionarAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert("PERMISO REQUERIDO", "Se necesita acceso a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const validarEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarFortalezaClave = (pass: string) => {
        const tieneEspecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(pass);
        return pass.length >= 6 && tieneEspecial;
    };

    const registrarUsuario = async () => {
        if (!nick || !edad || !email || !password || !imageUri) {
            Alert.alert("CAMPOS INCOMPLETOS", "Llena todos los campos y selecciona un avatar.");
            return;
        }

        if (!validarEmail(email)) {
            Alert.alert("CORREO INVÁLIDO", "Formato de correo incorrecto.");
            return;
        }

        if (!validarFortalezaClave(password)) {
            Alert.alert("CONTRASEÑA DÉBIL", "Mínimo 6 caracteres y al menos un número o símbolo.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "usuarios", uid), {
                nick: nick,
                edad: parseInt(edad), 
                email: email,
                fotoUriLocal: imageUri,
                fotoRef: `avatars/${uid}.png`, 
                puntos: 0,
                status: "nuevo guerrero",
                fechaCreacion: new Date()
            });

            Alert.alert("¡ÉXITO!", "Registro completado.");
            navigation.navigate('Login');

        } catch (error: any) {
            Alert.alert("ERROR", "No se pudo completar el registro.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <Text style={styles.titulo}>NUEVO GUERRERO</Text>
                <View style={styles.separator} />

                <TouchableOpacity style={styles.avatarWrapper} onPress={seleccionarAvatar}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>ELEGIR AVATAR</Text>
                        </View>
                    )}
                </TouchableOpacity>

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
                        placeholder="email@dominio.com" 
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
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1c1c1c',
        borderWidth: 2,
        borderColor: '#d4af37',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        color: '#d4af37',
        fontSize: 10,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#a0a0a0',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
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
    },
    textoBotonPrincipal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 2,
    },
    botonSecundario: {
        alignItems: 'center',
    },
    textoBotonSecundario: {
        color: '#d4af37',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});