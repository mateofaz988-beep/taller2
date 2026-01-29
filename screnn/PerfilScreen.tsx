import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
 
export default function PerfilScreen({ navigation }: any) {

    const [nick, setNick] = useState('');
    const [edad, setEdad] = useState('');
    const [pais, setPais] = useState('');
    const [puntos, setPuntos] = useState(0); // Los puntos NO se editarán manualmente
    const [image, setImage] = useState<string | null>(null);
   
    
    const [editando, setEditando] = useState(false);
 
    // 1. CARGAR DATOS DE FIREBASE 
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            const userRef = ref(db, `usuarios/${uid}`);
            // Usamos onValue para escuchar cambios en tiempo real
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setNick(data.nick || '');
                    setEdad(data.edad || '');
                    setPais(data.pais || '');
                    setPuntos(data.puntos || 0); // Cargamos los puntos
                    setImage(data.foto || null);
                }
            });
        }
    }, []);
 
    // --- 2. CAMBIAR FOTO (Solo funciona si 'editando' es true) ---
    const pickImage = async () => {
        if (!editando) return; // Si no estamos editando, no hace nada
 
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
 
    // --- 3. GUARDAR CAMBIOS EN FIREBASE ---
    const guardarPerfil = async () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
            try {
                // Actualizamos SOLO los datos personales, NO los puntos
                await update(ref(db, `usuarios/${uid}`), {
                    nick: nick,
                    edad: edad,
                    pais: pais,
                    foto: image
                });
                setEditando(false); // Salir del modo edición
                Alert.alert("¡Éxito!", "Tu perfil ha sido actualizado.");
            } catch (error) {
                Alert.alert("Error", "No se pudo guardar.");
            }
        }
    };
 
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>FICHA DE AGENTE</Text>
 
            {/* FOTO DE PERFIL */}
            <TouchableOpacity onPress={pickImage} style={[styles.avatarBox, editando && styles.avatarEdit]}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.avatar} />
                ) : (
                    <Text style={styles.textPlaceholder}>Sin Foto</Text>
                )}
                {editando && <View style={styles.iconEdit}><Text>📷</Text></View>}
            </TouchableOpacity>
 
            {/* PUNTUACIÓN (SOLO LECTURA) */}
            <View style={styles.scoreBox}>
                <Text style={styles.labelScore}>RÉCORD ACTUAL (PUNTOS)</Text>
                <Text style={styles.scoreValue}>🏆 {puntos}</Text>
            </View>
 
            {/* CAMPOS DE DATOS */}
            <View style={styles.form}>
                <Text style={styles.label}>Nick / Alias:</Text>
                <TextInput
                    style={[styles.input, editando ? styles.inputEditable : styles.inputRead]}
                    value={nick}
                    onChangeText={setNick}
                    editable={editando} // Solo editable si activamos el botón
                />
 
                <Text style={styles.label}>Edad:</Text>
                <TextInput
                    style={[styles.input, editando ? styles.inputEditable : styles.inputRead]}
                    value={edad}
                    onChangeText={setEdad}
                    keyboardType="numeric"
                    editable={editando}
                />
 
                <Text style={styles.label}>País:</Text>
                <TextInput
                    style={[styles.input, editando ? styles.inputEditable : styles.inputRead]}
                    value={pais}
                    onChangeText={setPais}
                    editable={editando}
                />
            </View>
 
            {/* BOTONES DE ACCIÓN */}
            {editando ? (
                // SI ESTAMOS EDITANDO: Mostrar Guardar y Cancelar
                <View style={styles.rowBtns}>
                    <TouchableOpacity style={styles.btnCancel} onPress={() => setEditando(false)}>
                        <Text style={styles.btnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSave} onPress={guardarPerfil}>
                        <Text style={styles.btnText}>💾 GUARDAR</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // SI SOLO ESTAMOS VIENDO: Mostrar botón de Editar
                <TouchableOpacity style={styles.btnEdit} onPress={() => setEditando(true)}>
                    <Text style={styles.btnText}>✏️ EDITAR PERFIL</Text>
                </TouchableOpacity>
            )}
 
            <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                <Text style={styles.textBack}>Volver al Menú</Text>
            </TouchableOpacity>
 
        </ScrollView>
    );
}
 
const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#121212', alignItems: 'center', padding: 20 },
    header: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 20, marginTop: 30, letterSpacing: 2 },
   
  
    avatarBox: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#555' },
    avatarEdit: { borderColor: '#3498db', borderWidth: 4 },
    avatar: { width: '100%', height: '100%', borderRadius: 60 },
    textPlaceholder: { color: '#888' },
    iconEdit: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 15, padding: 5 },
 
    
    scoreBox: { width: '100%', backgroundColor: '#2c2c2c', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, borderColor: '#f1c40f', borderWidth: 1 },
    labelScore: { color: '#f1c40f', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
    scoreValue: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
 
    form: { width: '100%', marginBottom: 20 },
    label: { color: '#aaa', marginBottom: 5, marginLeft: 5, fontSize: 14 },
    input: { width: '100%', padding: 15, borderRadius: 8, marginBottom: 15, color: '#fff', fontSize: 16 },
   
    inputRead: { backgroundColor: '#1e1e1e', borderWidth: 0 }, // Modo lectura (oscuro)
    inputEditable: { backgroundColor: '#252525', borderWidth: 1, borderColor: '#3498db' }, // Modo edición (borde azul)
 
    
    btnEdit: { width: '100%', backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center' },
    rowBtns: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    btnSave: { flex: 1, backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center', marginLeft: 10 },
    btnCancel: { flex: 1, backgroundColor: '#c0392b', padding: 15, borderRadius: 8, alignItems: 'center', marginRight: 10 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
 
    btnBack: { marginTop: 30, padding: 10 },
    textBack: { color: '#888', textDecorationLine: 'underline' }
});