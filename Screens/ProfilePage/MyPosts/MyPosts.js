import { View, Text } from 'react-native';
import { React, useEffect, useState } from 'react';
import { useAppContext } from '../../../Context/AppContext';
import { db } from '../../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const MyPosts = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const { userPosts, setUserPosts } = useState([]);

  const colReference = collection(
    db,
    'Users',
    `${currentUser.userDocID}`,
    'myPosts'
  );

  return (
    <View>
      <Text>MyPosts</Text>
    </View>
  );
};

export default MyPosts;
