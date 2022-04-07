import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../ThemeContext';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../Context/AppContext';

const AdminPanel = ({ navigation }) => {
  const colRef = collection(db, 'Users');
  const { unauthorizedUsers, setUnauthorizedUsers } = useAppContext();
  const { allUsers, setAllUsers } = useAppContext();
  const [theme, styleVariables] = useTheme();

  const getCount = async () => {
    const data = await getDocs(colRef);
    const users = data.docs.map((user) => {
      let userDocId = user._key.path.segments[6];

      return (user = {
        ...user.data(),
        userDocId,
      });
    });

    setAllUsers(users.filter((user) => user.tenantAuthorized));
    setUnauthorizedUsers(users.filter((user) => !user.tenantAuthorized));
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ApproveUsers', {
            unauthorizedUsers,
          });
        }}
        style={theme.primaryButton}
      >
        <Text
          style={{ color: 'white', fontWeight: 'bold' }}
        >{`Approve users \t\t ${unauthorizedUsers.length}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ManageUsers', { allUsers });
        }}
        style={theme.primaryButton}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Manage users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SendNotice');
        }}
        style={theme.primaryButton}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Send notices</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ManageBuildings');
        }}
        style={theme.primaryButton}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Manage buildings
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminPanel;
