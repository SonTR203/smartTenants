//import { View, Text } from 'react-native';
//import React from 'react';
// import { useAppContext } from '../../../Context/AppContext';

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, addDoc } from '@firebase/firestore';
import { useTheme } from '../../../ThemeContext';
import { ProfilePages } from '../../customNavigator';
import { db } from '../../../firebase-config';
import { useAppContext } from '../../../Context/AppContext';
import EditProfile from '../EditProfile/EditProfile';

const auth = getAuth();
let globalSetCurrentUser;
let globalCurrentUser;

const ProfileGeneral = ({ navigation }) => {
  const [theme, styleVariables] = useTheme();

  const { currentUser, setCurrentUser } = useAppContext();

  const logUserOut = () => {
    console.log('logging user out');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <View>
        <Text>{currentUser.firstName + ' ' + currentUser.lastName}</Text>
      </View>
      {currentUser.isAdmin && (
        <View>
          <Text>Admin Panel</Text>
        </View>
      )}
      <View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
        <View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            id=""
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
            style={theme.primaryButton}
          >
            <Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
              Edit Info
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
          <View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://smartlivinggroup.securecafe.com/residentservices/apartmentsforrent/userlogin.aspx'
                );
              }}
            >
              <Text
                style={[
                  styleVariables.fontSizes.calloutBold,
                  { color: styleVariables.colors.primary },
                ]}
              >
                Residential Portal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            id=""
            onPress={() => navigation.navigate('MyPosts')}
            style={theme.primaryButton}
          >
            <Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
              My Posts
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={logUserOut} style={theme.primaryButton}>
            <Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileGeneral;
