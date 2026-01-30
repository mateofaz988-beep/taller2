import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/Config'; 
import { ref, onValue } from 'firebase/database';
 
export default function RankingScreen() {
    const [ranking, setRanking] = useState<any[]>([]);
 //parte RAKING DE JUEGADOR-  andy
    useEffect(() => {
        const rankingRef = ref(db, 'usuarios/');
        onValue(rankingRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
            
                const lista = Object.keys(data).map(key => ({ id: key, ...data[key] }));
               
                lista.sort((a, b) => b.puntos - a.puntos);
                setRanking(lista);
            }
        });
    }, []);
 
    return (
<View style={styles.container}>
<Text style={styles.titulo}>TABLA DE LEYENDAS</Text>
<View style={styles.header}>
<Text style={styles.th}>Pos</Text>
<Text style={[styles.th, {flex:1, textAlign:'left'}]}>Guerrero</Text>
<Text style={styles.th}>Puntos</Text>
</View>
 
            <FlatList
                data={ranking}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
<View style={styles.row}>
<Text style={[styles.cell, {width: 40, fontWeight:'bold', color: index===0 ? '#d4af37' : '#fff'}]}>
                            #{index + 1}
</Text>
<View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
<Image source={{ uri: item.foto }} style={styles.miniAvatar} />
<View>
<Text style={styles.nick}>{item.nick}</Text>
<Text style={styles.pais}>{item.pais}</Text>
</View>
</View>
<Text style={styles.points}>{item.puntos}</Text>
</View>
                )}
            />
</View>
    );
}
 
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f13', padding: 20 },
    titulo: { color: '#d4af37', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    header: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#444', paddingBottom: 10, marginBottom: 10 },
    th: { color: '#888', fontWeight: 'bold', width: 60, textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#222' },
    cell: { color: '#fff', textAlign: 'center' },
    miniAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10, borderWidth:1, borderColor:'#d4af37' },
    nick: { color: '#fff', fontWeight: 'bold' },
    pais: { color: '#666', fontSize: 10 },
    points: { color: '#27ae60', fontWeight: 'bold', width: 60, textAlign: 'right' }
});