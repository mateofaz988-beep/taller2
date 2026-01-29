// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screnn/Login';
import RegistroScreen from '../screnn/Registro';
import JuegoScreen from '../screnn/JuegoScreen';
import InformacionScreen from '../screnn/InformacionScreen';
import BatallaScreen from '../screnn/BatallaScreen';
import RankingScreen from '../screnn/RankingScreen';
import PerfilScreen from '../screnn/PerfilScreen';

// Importa tus pantallas


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        
        {/* FLUJO DEL JUEGO */}
        <Stack.Screen name="Juego" component={JuegoScreen} />
        <Stack.Screen name="Informacion" component={InformacionScreen} />
        <Stack.Screen name="Batalla" component={BatallaScreen} />
        
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}