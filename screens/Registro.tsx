import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, StyleSheet, StatusBar, ImageBackground } from 'react-native';
// CORRECCIÓN APLICADA: Ruta exacta que pediste
import { auth, db } from '../firebase/Config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';

// Importamos la imagen localmente
const BACKGROUND_IMG = require('../assets/fondR.png');

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
            return Alert.alert("FALTA INFORMACIÓN", "Un guerrero debe identificarse completamente (Foto requerida).");
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await set(ref(db, `usuarios/${userCredential.user.uid}`), {
                nick: nick,
                edad: edad,
                pais: pais,
                email: email,
                foto: image,
                puntos: 0
            });

            Alert.alert("¡RECLUTAMIENTO EXITOSO!", "Bienvenido a las filas, espartano.");
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert("ERROR DE REGISTRO", error.message);
        }
    };

    return (
        <ImageBackground source={BACKGROUND_IMG} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            
            {/* Capa oscura para que se lean las letras */}
            <View style={styles.overlay}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.headerContainer}>
                        <Text style={styles.titulo}>NUEVO RECLUTA</Text>
                        <Text style={styles.subtitulo}>ÚNETE A LA BATALLA</Text>
                    </View>

                    {/* SELECCIONAR FOTO */}
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        <View style={[styles.avatarBox, image ? styles.avatarActive : null]}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatar} />
                            ) : (
                                <Text style={styles.addPhotoIcon}>📷</Text>
                            )}
                        </View>
                        {!image && <Text style={styles.addPhotoText}>SUBIR RETRATO</Text>}
                    </TouchableOpacity>

                    {/* FORMULARIO */}
                    <View style={styles.formContainer}>
                        <TextInput 
                            placeholder="Nick de Guerra" 
                            placeholderTextColor="#aaa" 
                            style={styles.input} 
                            onChangeText={setNick} 
                            value={nick}
                        />
                        <View style={styles.row}>
                            <TextInput 
                                placeholder="Edad" 
                                placeholderTextColor="#aaa" 
                                style={[styles.input, {flex: 0.4}]} 
                                onChangeText={setEdad} 
                                keyboardType="numeric" 
                                value={edad}
                            />
                            <TextInput 
                                placeholder="País de Origen" 
                                placeholderTextColor="#aaa" 
                                style={[styles.input, {flex: 0.55}]} 
                                onChangeText={setPais} 
                                value={pais}
                            />
                        </View>
                        
                        <TextInput 
                            placeholder="Correo Electrónico" 
                            placeholderTextColor="#aaa" 
                            style={styles.input} 
                            onChangeText={setEmail} 
                            keyboardType="email-address" 
                            autoCapitalize="none" 
                            value={email}
                        />
                        <TextInput 
                            placeholder="Contraseña Secreta" 
                            placeholderTextColor="#aaa" 
                            style={styles.input} 
                            onChangeText={setPassword} 
                            secureTextEntry 
                            value={password}
                        />

                        {/* BOTÓN PRINCIPAL */}
                        <TouchableOpacity style={styles.boton} onPress={registrar} activeOpacity={0.8}>
                            <Text style={styles.textoBoton}>FORJAR ALIANZA</Text>
                        </TouchableOpacity>

                        {/* VOLVER */}
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                            <Text style={styles.textLink}>¿Ya eres un guerrero? <Text style={styles.textLinkBold}>Inicia Sesión</Text></Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }, // Oscurece la imagen de fondo un 75%
    scrollContent: { flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
    
    headerContainer: { alignItems: 'center', marginBottom: 30 },
    titulo: { 
        color: '#d4af37', 
        fontSize: 32, 
        fontWeight: 'bold', 
        letterSpacing: 2,
        textShadowColor: 'rgba(212, 175, 55, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    },
    subtitulo: { color: '#888', fontSize: 12, letterSpacing: 5, marginTop: 5 },

    avatarContainer: { alignItems: 'center', marginBottom: 30 },
    avatarBox: { 
        width: 130, 
        height: 130, 
        borderRadius: 65, 
        backgroundColor: 'rgba(30,30,30,0.8)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: '#555',
        borderStyle: 'dashed'
    },
    avatarActive: { borderColor: '#d4af37', borderStyle: 'solid', borderWidth: 3 },
    avatar: { width: '100%', height: '100%', borderRadius: 65 },
    addPhotoIcon: { fontSize: 40, opacity: 0.5 },
    addPhotoText: { color: '#d4af37', fontSize: 12, marginTop: 10, fontWeight: 'bold' },

    formContainer: { width: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    
    input: { 
        backgroundColor: 'rgba(255,255,255,0.08)', 
        color: '#fff', 
        padding: 18, 
        borderRadius: 8, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: 'rgba(212, 175, 55, 0.3)', // Dorado muy suave
        fontSize: 16
    },

    boton: { 
        width: '100%', 
        backgroundColor: '#8b0000', // Rojo sangre
        padding: 18, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e74c3c',
        shadowColor: "#f00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },

    loginLink: { marginTop: 25, alignItems: 'center' },
    textLink: { color: '#aaa', fontSize: 14 },
    textLinkBold: { color: '#d4af37', fontWeight: 'bold', textDecorationLine: 'underline' }
});