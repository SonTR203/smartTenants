import { View, Text } from 'react-native';
import { React, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../../Context/AppContext';
import { db } from '../../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MyPosts = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [userPosts, setUserPosts] = useState([]);

  const colReference = collection(
    db,
    'Users',
    `${currentUser.userDocId}`,
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
      {userPosts.length > 0 && (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            <MyPostItem userPosts={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

function MyPostItem({ userPosts, navigation }) {
  return (
    <TouchableOpacity>
      <Text>{userPosts.postContent}</Text>
    </TouchableOpacity>
  );
}

export default MyPosts;
