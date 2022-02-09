
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleList from '../screens/ScheduleScreems/ScheduleList';
import CreateSchedule from '../screens/ScheduleScreems/CreateSchedule';
import ScheduleDetails from '../screens/ScheduleScreems/ScheduleDetails';

const Stack = createStackNavigator();

export default function ScheduleMenuStack() {
  return(

    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName='ScheduleList'
        screenOptions={{
          headerStyle: { backgroundColor: '#E37D00' },
          headerTintColor: '#FFF'
        }}
      >
        <Stack.Screen 
          name='ScheduleList'
          component={ScheduleList}
          options={{ headerShown: false, title: 'Agendamentos' }}
        />
        <Stack.Screen 
          name='CreateSchedule'
          component={CreateSchedule}
          options={{ headerShown: false, title: 'Novo agendamento' }}
        />
        <Stack.Screen 
          name='ScheduleDetails'
          component={ScheduleDetails}
          options={{ headerShown: false, title: 'Detalhes Agendamentos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}