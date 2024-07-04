import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Record from './screens/Record';
import { MenuProvider } from 'react-native-popup-menu';
import Login from './screens/login'; 
import SplashScreen from './screens/Splashscreen'; 
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import HomeScreen from './screens/Components/HomeScreen';
import PlaybackScreen from './screens/Components/PlaybackScreen';
import  {Home}  from './screens/Components/Home';
import TranscriptScreen from './screens/Components/TranscriptScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  const [isShowSplashScreen, setIsShowSplashScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplashScreen(false);
    }, 3000);
  }, []);

  return (
    <MenuProvider>
    <NavigationContainer>
      {isShowSplashScreen ? (
        <SplashScreen />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
          <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
          <Stack.Screen name="Record" component={Record} options={{headerShown: false}}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="PlayBackScreen" component={PlaybackScreen} options={{headerShown: false}} />
          <Stack.Screen name="TranscriptScreen" component={TranscriptScreen} />

        </Stack.Navigator>
      )}
    </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
