import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ManageUsers = () => {
  const colRef = collection(db, 'Users');
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getUsers = async () => {
    const data = await getDocs(colRef);
    setUsers(data.docs.map((user) => user.data()));
    setFetching(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  console.log(users);

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <View>
        {fetching ? <ActivityIndicator /> : null}
        <Text>ManageUsers</Text>
      </View>
    </SafeAreaView>
  );
};

export default ManageUsers;
