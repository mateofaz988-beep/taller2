import React, { useState } from 'react';
<<<<<<< HEAD:screnn/Registro.tsx
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
=======
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { auth, db } from '../firebase/Config';
>>>>>>> 924ad2d9f1eac72091ba92eaf58b54ea95ab103b:screens/Registro.tsx
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';

export default function RegistroScreen({ navigation }: any) {
    const [nick, setNick] = useState('');
    const [edad, setEdad] = useState('');
    const [pais, setPais] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState<string | null>(null);

    // --- 1. SELECCIONAR FOTO ---
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            // SOLUCIÓN: Usamos "MediaTypeOptions" para que compile sin error rojo.
            // Ignora la advertencia amarilla por ahora.
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true, 
        });

        if (!result.canceled && result.assets) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    // --- 2. REGISTRO EN BASE DE DATOS ---
    const registrar = async () => {
        if (!nick || !email || !password || !image) {
            return Alert.alert("Faltan Datos", "Por favor completa los datos y sube una foto.");
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Guardar en Realtime Database
            await set(ref(db, `usuarios/${userCredential.user.uid}`), {
                nick: nick,
                edad: edad,
                pais: pais,
                email: email,
                foto: image,
                puntos: 0 // Importante para el juego
            });

            Alert.alert("¡Éxito!", "Cuenta creada correctamente.");
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>REGISTRO DE HÉROES</Text>
            <TouchableOpacity onPress={pickImage} style={styles.avatarBox}>
                {image ? <Image source={{ uri: image }} style={styles.avatar} /> : <Text style={styles.addPhoto}>+ SUBIR FOTO</Text>}
            </TouchableOpacity>
            <TextInput placeholder="Nick" placeholderTextColor="#888" style={styles.input} onChangeText={setNick} value={nick}/>
            <TextInput placeholder="Edad" placeholderTextColor="#888" style={styles.input} onChangeText={setEdad} keyboardType="numeric" value={edad}/>
            <TextInput placeholder="País" placeholderTextColor="#888" style={styles.input} onChangeText={setPais} value={pais}/>
            <TextInput placeholder="Email" placeholderTextColor="#888" style={styles.input} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" value={email}/>
            <TextInput placeholder="Contraseña" placeholderTextColor="#888" style={styles.input} onChangeText={setPassword} secureTextEntry value={password}/>
            <TouchableOpacity style={styles.boton} onPress={registrar}><Text style={styles.textoBoton}>CREAR CUENTA</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginTop: 20}}>
                <Text style={styles.link}>Volver al Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0f0f13', padding: 20, alignItems: 'center' },
    titulo: { color: '#d4af37', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    avatarBox: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1c1c1c', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#d4af37' },
    avatar: { width: 120, height: 120, borderRadius: 60 },
    addPhoto: { color: '#d4af37', fontWeight: 'bold' },
    input: { width: '100%', backgroundColor: '#1c1c1c', color: '#fff', padding: 15, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
    boton: { width: '100%', backgroundColor: '#8b0000', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
    textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link: { color: '#888', textDecorationLine: 'underline' }
});