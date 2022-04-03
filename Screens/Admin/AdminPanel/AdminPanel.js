import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../ThemeContext';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';

const AdminPanel = ({ navigation }) => {
  const colRef = collection(db, 'Users');
  const [theme, styleVariables] = useTheme();
  const [count, setCount] = useState([]);

  const getCount = async () => {
    const data = await getDocs(colRef);
    const users = data.docs.map((user) => user.data());
    const unauthorizedUsers = users.filter((user) => !user.tenantAuthorized);
    setCount(unauthorizedUsers.length);
  };

  useEffect(() => {
    getCount();
  }, []);

  console.log(count);

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ApproveUsers');
        }}
        style={theme.primaryButton}
      >
        <Text
          style={{ color: 'white', fontWeight: 'bold' }}
        >{`Approve users \t\t ${count}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ManageUsers');
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
