import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import Login from '../screnn/Login';
import Registro from '../screnn/Registro';
import JuegoScreen from '../screnn/JuegoScreen';
import Welcome from '../screnn/Welcome'; 
import RankingScreen from '../screnn/RakinScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                
 
                <Stack.Screen name="Welcome" component={Welcome} />
                
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Registro" component={Registro} />
                <Stack.Screen name="Juego" component={JuegoScreen} />
                <Stack.Screen name="Ranking" component={RankingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}