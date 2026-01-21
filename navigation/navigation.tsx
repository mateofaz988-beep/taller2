import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Importaciones
import Login from '../screnn/Login'; // Asegurate que coincida con tus archivos
import Registro from '../screnn/Registro';
import JuegoScreen from '../screnn/JuegoScreen';

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Login">
                <Drawer.Screen name="Login" component={Login} />
                <Drawer.Screen name="Registro" component={Registro} />
                <Drawer.Screen name="Juego" component={JuegoScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}