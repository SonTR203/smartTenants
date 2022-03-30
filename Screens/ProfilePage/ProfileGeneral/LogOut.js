import React from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Linking,
    Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../../ThemeContext';
import { useAppContext } from '../../../Context/AppContext'
//import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Login from '../../Login/Login';
import {
    NewsfeedNavigator,
    ProfileNavigator,
    NotificationNavigator,
} from '../../customNavigator'
import { NavigationContainer } from '@react-navigation/native';

const auth = getAuth();

const LogOut = ({ route, ...props }) => {

    const [theme, styleVariables] = useTheme();

    const logUserOut = () => {
        console.log("logging user out")
        auth.signOut().then(
            console.log("Tenant signed out")
        )
        //============this navigates the user to the login screen within the ProfileNavigator, and when they log back in and try to go 
        //to profile again, they can only see the login screen again. We'll need to think of a clever way to do this=============
        console.log(navigation)
        navigation.navigate('Login');
    }

    return (
        <>
            <View>
                <TouchableOpacity onPress={() => { navigation.navigate("Login") }} style={theme.primaryButton}>
                    <Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
                        Log Out
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>Created by IntelliDev Solutions</Text>
            </View>
        </>
    );
};

export default LogOut;