import React, { useState, useEffect } from 'react';
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
});