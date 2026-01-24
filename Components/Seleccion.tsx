import React, { useState } from 'react';
import { View, Button, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AvatarPicker = ({ onImageSelected }) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No se necesita pedir permisos explícitos para la galería en versiones modernas de Expo,
    // pero es buena práctica manejar el resultado.
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permite recortar la imagen (ideal para avatares)
      aspect: [1, 1],      // Fuerza un cuadrado
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onImageSelected(uri); // Pasamos la URI local al formulario principal
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarPlaceholder}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.emptyAvatar}>
            <Text style={{ color: 'white' }}>Seleccionar Avatar de Guerrero</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700', // Un toque dorado para guerreros
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  emptyAvatar: {
    textAlign: 'center',
    padding: 10,
  }
});

export default AvatarPicker;