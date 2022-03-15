import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Notifications from './Screens/Notifications/Notifications';
import Marketplace from './Screens/Marketplace/Marketplace';
import Profile from './Screens/ProfilePage/ProfileGeneral/ProfileGeneral';
import Login from './Screens/Login/Login';

import { LoginNavigator } from './Screens/customNavigator.js';

import { NewsfeedNavigator } from './Screens/customNavigator.js'

// Import building for testing
// import BuildingInfo from './Screens/BuildingInfo/BuildingInfo'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Newsfeed '>

        {/* ======= Login ======= */}
        <Tab.Screen
          name='Login'
          component={LoginNavigator}
          options={{ headerShown: false }} />

        {/* ======= Marketplace ======= */}
        <Tab.Screen
          name='Marketplace '
          component={Marketplace}
          options={{ headerShown: false }} />

        {/* ======= Newsfeed ======= */}
        <Tab.Screen
          name='Newsfeed '
          component={NewsfeedNavigator}
          options={{ headerShown: false }} />

        {/* ======= Notifications ======= */}
        <Tab.Screen
          name='Notifications '
          component={Notifications}
          options={{ headerShown: false }} />

        {/* ======= Profile ======= */}
        <Tab.Screen
          name='Profile '
          component={Profile}
          options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
