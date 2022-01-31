import React from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Login from '../screens/Login';
import Register from '../screens/Register';
import HomeMenuBottomTab from './homeMenuBottomTab';

const Stack = createStackNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Schedules':
      return 'Agendamentos';
    case 'History':
      return 'Histórico';
  }
}

const Routes = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEF3B4' }}>
      <StatusBar style='auto' backgroundColor='#AD6200'/>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerStyle: { backgroundColor: '#E37D00' },
            headerTintColor: '#FFF',
          }}
        >
          <Stack.Screen 
            name='Login'
            component={Login}
            options={{
              title: 'Login',
              headerTitleStyle: { fontWeight: 'bold', textAlign: 'center' }
            }}
          />
          <Stack.Screen 
            name='Register'
            component={Register}
            options={{ title: 'Cadastre-se' }}
          />
          <Stack.Screen 
            name='HomeMenuBottomTab'
            component={HomeMenuBottomTab}
            options={({ navigation, route }) => ({
              headerTitle: getHeaderTitle(route),
              headerRight: () => (
                <TouchableOpacity
                  onPress={()=> {
                    Alert.alert(
                      'Atenção!',
                      'Deseja sair do aplicativo?',
                      [
                        {
                          text: 'Sim',
                          onPress: ()=> navigation.replace('Login')
                        },
                        {
                          text: 'Não',
                          onPress: ()=> console.log('Cancel Pressed'),
                          style: 'cancel'
                        }
                      ],
                      { cancelable: false }
                    );
                  }}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold'}}>Sair</Text>
                  <MaterialCommunityIcons name='exit-run' color='#FFF' size={26}/>
                </TouchableOpacity>
              ),
              headerTitleStyle: { fontWeight: 'bold', textAlign: 'center' }
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default Routes;