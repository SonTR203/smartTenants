import { View, Text } from 'react-native';
import React from 'react';
import { addDoc, collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../../../firebase-config';

const ApproveUsers = () => {
  const colRef = collection(db, 'Users');
  let users;

  const getUsers = async () => {
    const data = await getDocs(colRef);
    users = data.docs.map((user) => user.data());
    console.log(users);
  };

  getUsers();

  return (
    <View>
      <Text>ApproveUsers</Text>
    </View>
  );
};

export default ApproveUsers;
