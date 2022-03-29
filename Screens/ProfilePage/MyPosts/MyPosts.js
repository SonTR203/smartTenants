import { View, Text } from 'react-native';
import { React, useEffect, useState } from 'react';
import { useAppContext } from '../../../Context/AppContext';
import { db } from '../../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const MyPosts = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [userPosts, setUserPosts] = useState([]);

  const colReference = collection(
    db,
    'Users',
    `${currentUser.userDocID}`,
    'myPosts'
  );

  function getPosts() {
    getDocs(colReference)
      .then((snapshot) => {
        let postList = [];
        snapshot.docs.forEach((doc) => {
          postList.push({ ...doc.data(), id: doc.id });
        });
        setUserPosts(postList);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View>
      <Text>MyPosts</Text>
    </View>
  );
};

export default MyPosts;
