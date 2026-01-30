import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, Image, StyleSheet, 
    ScrollView, Alert, ActivityIndicator, ImageBackground, StatusBar 
} from 'react-native';

// --- 1. FIREBASE & LIBRERÍAS ---
import { auth, db } from '../firebase/Config'; 
import { ref, onValue, update } from 'firebase/database';
import { signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

// --- 2. ASSETS ---
const BACKGROUND_IMG = require('../assets/fondo.jpg');

export default function PerfilScreen({ navigation }: any) {

    // --- 3. ESTADOS ---
    const [nick, setNick] = useState('');
    const [edad, setEdad] = useState('');
    const [pais, setPais] = useState('');
    const [puntos, setPuntos] = useState(0);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);

    // --- 4. CARGAR DATOS (Firebase Realtime) ---
    useEffect(() => {
        const usuarioActual = auth.currentUser;

        if (usuarioActual) {
            const uid = usuarioActual.uid;
            const referencia = ref(db, `usuarios/${uid}`);

            const unsubscribe = onValue(referencia, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setNick(data.nick || 'Guerrero Anónimo');
                    setEdad(data.edad ? String(data.edad) : '');
                    setPais(data.pais || 'Desconocido');
                    setPuntos(data.puntos || 0);
                    setImage(data.foto || null);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
            navigation.replace('Login');
        }
    }, []);

    // --- 5. FUNCIONES ---
    
    // Cambiar Foto
    const pickImage = async () => {
        if (!editando) return; // Solo si estamos editando
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

    // Guardar Cambios
    const guardarPerfil = async () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            try {
                await update(ref(db, `usuarios/${uid}`), {
                    nick: nick,
                    edad: edad,
                    pais: pais,
                    foto: image
                    // Nota: No actualizamos 'puntos' aquí para evitar trampas
                });
                setEditando(false);
                Alert.alert("ÉXITO", "Tu ficha de guerrero ha sido actualizada.");
            } catch (error) {
                Alert.alert("ERROR", "No se pudieron guardar los cambios.");
            }
        }
    };

    // Cerrar Sesión
    const cerrarSesion = () => {
        Alert.alert(
            "ABANDONAR FILAS",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, Salir", 
                    style: 'destructive',
                    onPress: async () => {
                        await signOut(auth);
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    // --- 6. RENDERIZADO ---
    if (loading) {
        return (
            <ImageBackground source={BACKGROUND_IMG} style={styles.center} resizeMode="cover">
                <ActivityIndicator size="large" color="#d4af37" />
                <Text style={{color:'#d4af37', marginTop:10, fontWeight:'bold'}}>Consultando los registros...</Text>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground source={BACKGROUND_IMG} style={styles.background} resizeMode="cover">
            <StatusBar barStyle="light-content" />
            
            <View style={styles.overlay}>
                <ScrollView contentContainerStyle={styles.container}>
                    
                    <Text style={styles.header}>FICHA DE GUERRERO</Text>

                    {/* AVATAR / FOTO */}
                    <TouchableOpacity onPress={pickImage} style={[styles.avatarBox, editando && styles.avatarEdit]}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatar} />
                        ) : (
                            <Text style={styles.textPlaceholder}>SIN FOTO</Text>
                        )}
                        {editando && <View style={styles.iconEdit}><Text>📷</Text></View>}
                    </TouchableOpacity>

                    {/* TARJETA DE PUNTOS (NO EDITABLE) */}
                    <View style={styles.scoreBox}>
                        <Text style={styles.labelScore}>RÉCORD DE BATALLA</Text>
                        <Text style={styles.scoreValue}>🏆 {puntos}</Text>
                    </View>

                    {/* FORMULARIO DE DATOS */}
                    <View style={styles.form}>
                        <Text style={styles.label}>NOMBRE DE GUERRA (NICK):</Text>
                        <TextInput 
                            style={[styles.input, editando ? styles.inputEditable : styles.inputRead]}
                            value={nick}
                            onChangeText={setNick}
                            editable={editando} 
                        />

                        <View style={styles.row}>
                            <View style={{flex: 0.45}}>
                                <Text style={styles.label}>EDAD:</Text>
                                <TextInput 
                                    style={[styles.input, editando ? styles.inputEditable : styles.inputRead]}
                                    value={edad}
                                    onChangeText={setEdad}
                                    keyboardType="numeric"
                                    editable={editando}
                                />
                            </View>
                            <View style={{flex: 0.5}}>
                                <Text style={styles.label}>PAÍS:</Text>
                                <TextInput 
                                    style={[styles.input, editando ? styles.inputEditable : styles.inputRead]}
                                    value={pais}
                                    onChangeText={setPais}
                                    editable={editando}
                                />
                            </View>
                        </View>
                    </View>

                    {/* BOTONES DE ACCIÓN */}
                    {editando ? (
                        <View style={styles.rowBtns}>
                            <TouchableOpacity style={styles.btnCancel} onPress={() => setEditando(false)}>
                                <Text style={styles.btnText}>CANCELAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSave} onPress={guardarPerfil}>
                                <Text style={styles.btnText}>💾 GUARDAR</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.btnEdit} onPress={() => setEditando(true)}>
                            <Text style={styles.btnText}>✏️ EDITAR DATOS</Text>
                        </TouchableOpacity>
                    )}

                    {/* SEPARADOR */}
                    <View style={{height: 30}} />

                    {/* VOLVER */}
                    <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                        <Text style={styles.textBack}>VOLVER AL MENÚ</Text>
                    </TouchableOpacity>

                    {/* CERRAR SESIÓN */}
                    <TouchableOpacity style={styles.btnLogout} onPress={cerrarSesion}>
                        <Text style={styles.textLogout}>🚪 CERRAR SESIÓN</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}

// --- 7. ESTILOS ---
const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }, // Muy oscuro para resaltar contenido
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flexGrow: 1, alignItems: 'center', padding: 20 },

    header: { 
        color: '#d4af37', 
        fontSize: 26, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        marginTop: 40, 
        letterSpacing: 2,
        textShadowColor: 'rgba(212, 175, 55, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10
    },
    
    // AVATAR
    avatarBox: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        backgroundColor: '#222', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 20, 
        borderWidth: 2, 
        borderColor: '#555' 
    },
    avatarEdit: { borderColor: '#d4af37', borderWidth: 3 },
    avatar: { width: '100%', height: '100%', borderRadius: 60 },
    textPlaceholder: { color: '#666', fontWeight: 'bold' },
    iconEdit: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 15, padding: 5 },

    // TARJETA DE PUNTOS
    scoreBox: { 
        width: '100%', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        marginBottom: 25, 
        borderColor: '#d4af37', 
        borderWidth: 1,
        shadowColor: "#d4af37",
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    labelScore: { color: '#d4af37', fontSize: 12, fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 },
    scoreValue: { color: '#fff', fontSize: 32, fontWeight: 'bold' },

    // FORMULARIO
    form: { width: '100%', marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { color: '#aaa', marginBottom: 5, fontSize: 12, fontWeight: 'bold' },
    
    input: { 
        width: '100%', 
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 15, 
        color: '#fff', 
        fontSize: 16 
    },
    inputRead: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderWidth: 1, 
        borderColor: 'transparent' 
    }, 
    inputEditable: { 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderWidth: 1, 
        borderColor: '#d4af37' 
    },

    // BOTONES
    btnEdit: { width: '100%', backgroundColor: '#2980b9', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#3498db' },
    
    rowBtns: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    btnSave: { flex: 0.48, backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center' },
    btnCancel: { flex: 0.48, backgroundColor: '#c0392b', padding: 15, borderRadius: 8, alignItems: 'center' },
    
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

    // FOOTER
    btnBack: { marginBottom: 15, padding: 10 },
    textBack: { color: '#888', textDecorationLine: 'underline' },

    btnLogout: { 
        width: '100%', 
        backgroundColor: 'transparent', 
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#e74c3c',
        marginTop: 10,
        marginBottom: 30
    },
    textLogout: { color: '#e74c3c', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});