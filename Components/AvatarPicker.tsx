import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
}

export const AvatarPicker = ({ imageUri, onImageSelected }: Props) => {
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert("Se requieren permisos para la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={seleccionarImagen}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.text}>AVATAR DE GUERRERO</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1c1c1c',
    borderWidth: 2,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    padding: 10,
  },
  text: {
    color: '#d4af37',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});