// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tus pantallas

import LoginScreen from '../screens/Login';
import RegistroScreen from '../screens/Registro';
import JuegoScreen from '../screens/LobbyScreen';
import InformacionScreen from '../screens/InformacionScreen';
import BatallaScreen from '../screens/BatallaScreen';
import RankingScreen from '../screens/RankingScreen';
import PerfilScreen from '../screens/PerfilScreen';
import Welcome from '../screens/Welcome';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* CAMBIO AQUÍ: initialRouteName="Welcome" */}
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        
        {/* PANTALLA DE INICIO */}
        <Stack.Screen name="Welcome" component={Welcome} />

        {/* AUTENTICACIÓN */}
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