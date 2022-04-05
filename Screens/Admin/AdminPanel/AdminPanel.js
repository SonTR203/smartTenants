import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../ThemeContext';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';

const AdminPanel = ({ navigation }) => {
  const colRef = collection(db, 'Users');
  const [unauthorizedUsers, setUnauthorizedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [theme, styleVariables] = useTheme();

  const getCount = async () => {
    const data = await getDocs(colRef);
    const users = data.docs.map((user) => user.data());

    // let userID = user._key.path.segments[6];
    // console.log('my user**', userID);

    setAllUsers(users);
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
