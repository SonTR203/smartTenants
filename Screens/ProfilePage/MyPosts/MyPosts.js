import { View, Text } from 'react-native';
import { React, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../../Context/AppContext';
import { db } from '../../../firebase-config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

let setUserPost;

const MyPosts = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const { post, setPost } = useAppContext();
  const [userPosts, setUserPosts] = useState([]);
  setUserPost = setPost;
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
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('IndividualPosts');
        viewUserPost(userPosts);
      }}
    >
      <Text>{userPosts.postContent}</Text>
    </TouchableOpacity>
  );
}

async function viewUserPost(userPosts) {
  const docRef = doc(db, 'Newsfeed', `${userPosts.postID}`);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
  if (docSnap.exists()) {
    console.log('Document data: ', docSnap.data());
    setUserPost(docSnap.data());
  } else {
    console.log('No such document.');
  }
}

export default MyPosts;
