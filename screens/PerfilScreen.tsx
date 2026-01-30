import React, { useState, useEffect } from 'react';
<<<<<<< HEAD:screnn/PerfilScreen.tsx
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
=======
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert, TextInput } from 'react-native';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { auth, db } from '../firebase/Config';

export default function PerfilScreen({ navigation }: any) {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [nuevoNick, setNuevoNick] = useState('');
    const [nuevaEdad, setNuevaEdad] = useState('');

    const user = auth.currentUser;

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            if (user?.uid) {
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    setNuevoNick(data.nick);
                    setNuevaEdad(data.edad?.toString() || '');
                }
            }
        } catch (error) {
            console.log("Error al obtener perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    const actualizarDatosFirebase = async () => {
        if (!nuevoNick || !nuevaEdad) {
            Alert.alert("CAMPOS VACÍOS", "No puedes dejar a tu guerrero sin nombre o edad.");
            return;
        }

        try {
            if (user?.uid) {
                const userRef = doc(db, "usuarios", user.uid);
                
                await updateDoc(userRef, {
                    nick: nuevoNick,
                    edad: parseInt(nuevaEdad)
                });

                setUserData({ ...userData, nick: nuevoNick, edad: parseInt(nuevaEdad) });
                Alert.alert("¡FORJA COMPLETADA!", "Tus datos han sido actualizados en los registros.");
            }
        } catch (error) {
            Alert.alert("ERROR", "La base de datos rechazó los cambios.");
            console.log(error);
        }
    };

    const ejecutarEliminacion = async () => {
        try {
            if (user) {
                await deleteDoc(doc(db, "usuarios", user.uid));
                await deleteUser(user);
                Alert.alert("ADIÓS", "Tu registro ha sido borrado de la historia.");
                navigation.replace('Welcome');
            }
        } catch (error) {
            Alert.alert("ERROR CRÍTICO", "Debes re-autenticarte para realizar esta acción.");
        }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#d4af37" /></View>;

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <Text style={styles.titulo}>PERFIL DE GUERRERO</Text>
                <View style={styles.separator} />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>NICK DE BATALLA</Text>
                <TextInput 
                    style={styles.input}
                    value={nuevoNick}
                    onChangeText={setNuevoNick}
                    placeholderTextColor="#555"
                />

                <Text style={styles.label}>EDAD (AÑOS)</Text>
                <TextInput 
                    style={styles.input}
                    value={nuevaEdad}
                    onChangeText={setNuevaEdad}
                    keyboardType="numeric"
                    placeholderTextColor="#555"
                />

                <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                <Text style={styles.valorEstatico}>{userData?.email}</Text>
                
                <Text style={styles.label}>ALMAS RECOLECTADAS</Text>
                <Text style={styles.puntos}>{userData?.puntos || 0} ☠️</Text>
            </View>

            <View style={styles.btnGroup}>
                <TouchableOpacity style={styles.btnUpdate} onPress={actualizarDatosFirebase}>
                    <Text style={styles.btnText}>GUARDAR CAMBIOS</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.btnDelete} 
                    onPress={() => Alert.alert("AVISO", "¿Eliminar permanentemente?", [{text: "NO"}, {text: "SÍ", onPress: ejecutarEliminacion}])}
                >
                    <Text style={styles.btnText}>BORRAR CUENTA</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20, alignItems: 'center'}}>
                <Text style={{color: '#d4af37', textDecorationLine: 'underline'}}>VOLVER</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f13', padding: 25 },
    loader: { flex: 1, backgroundColor: '#0f0f13', justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginVertical: 30 },
    titulo: { fontSize: 26, fontWeight: 'bold', color: '#d4af37', letterSpacing: 3 },
    separator: { width: 80, height: 3, backgroundColor: '#8b0000', marginTop: 5 },
    card: { backgroundColor: '#1c1c1c', padding: 20, borderRadius: 5, borderWidth: 1, borderColor: '#333' },
    label: { color: '#888', fontSize: 11, fontWeight: 'bold', marginBottom: 5 },
    input: { 
        backgroundColor: '#000', 
        color: '#fff', 
        padding: 12, 
        borderRadius: 4, 
        marginBottom: 20, 
        borderWidth: 1, 
        borderColor: '#d4af37' 
    },
    valorEstatico: { color: '#aaa', fontSize: 16, marginBottom: 20 },
    puntos: { color: '#ffd700', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    btnGroup: { marginTop: 30, gap: 15 },
    btnUpdate: { backgroundColor: '#8b0000', padding: 18, borderRadius: 2, alignItems: 'center', borderWidth: 1, borderColor: '#d4af37' },
    btnDelete: { backgroundColor: '#222', padding: 18, borderRadius: 2, alignItems: 'center', borderWidth: 1, borderColor: '#444' },
    btnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 }
>>>>>>> 924ad2d9f1eac72091ba92eaf58b54ea95ab103b:screens/PerfilScreen.tsx
});