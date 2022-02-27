import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Newsfeed from './Screens/Newsfeed/Newsfeed';
import Notifications from './Screens/Notifications/Notifications';
import Marketplace from './Screens/Marketplace/Marketplace';
import Profile from './Screens/ProfilePage/Profile/Profile';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Newsfeed'>

        {/* ======= Marketplace ======= */}
        <Tab.Screen
        name='Marketplace'
        component={Marketplace}/>

        {/* ======= Newsfeed ======= */}
        <Tab.Screen
        name='Newsfeed'
        component={Newsfeed}/>

        {/* ======= Notifications ======= */}
        <Tab.Screen
        name='Notifications'
        component={Notifications}/>

        {/* ======= Profile ======= */}
        <Tab.Screen
        name='Profile'
        component={Profile}/>
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
