
import React from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../screens/Home';
import ScheduleMenuStack from './ScheduleMenuStack';

const Tab = createMaterialBottomTabNavigator();

export default function HomeMenuBottomTab({ navigation, route }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#FFF"
      inactiveColor="#FFC300"
      barStyle={{ backgroundColor: '#E37D00' }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26}/>
        }}
      />
      <Tab.Screen
        name="ScheduleMenuStack"
        component={ScheduleMenuStack}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-clock" color={color} size={26}/>
        }}
      />
    </Tab.Navigator>
  );
}