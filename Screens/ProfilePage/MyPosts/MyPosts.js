import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { React, useEffect, useState } from 'react';
import { useAppContext } from '../../../Context/AppContext';
import { db } from '../../../firebase-config';
import { useTheme } from '../../../ThemeContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
const windowWidth = Dimensions.get('window').width;

let setUserPost;

const MyPosts = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [theme, styleVariables] = useTheme();
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
            <MyPostItem
              userPosts={item}
              navigation={navigation}
              theme={theme}
              styleVariables={styleVariables}
              windowWidth={windowWidth}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

function MyPostItem({
  userPosts,
  navigation,
  theme,
  styleVariables,
  windowWidth,
}) {
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState('');

  const getLikes = async () => {
    const likesColReference = collection(
      db,
      'Newsfeed',
      `${userPosts.postID}`,
      'peopleWhoLiked'
    );

    const data = await getDocs(likesColReference);
    setNumberOfLikes(data.docs.length);
    setTime();
    getComments();
  };
  getLikes();

  const getComments = async () => {
    const likesColReference = collection(
      db,
      'Newsfeed',
      `${userPosts.postID}`,
      'peopleWhoCommented'
    );
    const data = await getDocs(likesColReference);
    setNumberOfComments(data.docs.length);
  };

  const setTime = () => {
    let time = userPosts.timestamp;
    if (time != undefined) {
      let timePosted = time.integerValue;
      let currentTime = Date.now();
      let timeDifferenceMinutes = ((currentTime - timePosted) / 60000).toFixed(
        0
      );
      let timeDifferenceHours = (timeDifferenceMinutes / 60).toFixed(0);
      let timeDifferenceDays = (timeDifferenceHours / 24).toFixed(0);
      let timeDifferenceWeeks = (timeDifferenceDays / 7).toFixed(0);

      if (timeDifferenceMinutes < 59) {
        setTimeSincePost(`${timeDifferenceMinutes} minutes ago`);
      } else if (timeDifferenceMinutes > 59 && timeDifferenceHours < 23) {
        setTimeSincePost(`${timeDifferenceHours} hours ago`);
      } else if (
        timeDifferenceDays < 6 &&
        timeDifferenceMinutes > 59 &&
        timeDifferenceHours > 23
      ) {
        setTimeSincePost(`${timeDifferenceDays} days ago`);
      } else if (
        timeDifferenceWeeks < 10 &&
        timeDifferenceDays > 6 &&
        timeDifferenceMinutes > 59 &&
        timeDifferenceHours > 23
      ) {
        setTimeSincePost(timeDifferenceWeeks, ' weeks ago');
      } else {
        setTimeSincePost('10+ weeks ago');
      }
    }
  };

  return (
    <View>
      <View>
        <View>
          <Image
            source={{ uri: `${userPosts.userProfileImage}` }}
            style={{ height: 43, width: 43, borderRadius: 12 }}
          />
          <Text>
            {userPosts.userFirstName}
            {userPosts.userLastName}
          </Text>
        </View>
        <Text>{timeSincePost}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('IndividualPosts');
          viewUserPost(userPosts);
        }}
      >
        <Text>{userPosts.postContent}</Text>
        {userPosts.images[0] != 'no image posted' && (
          <Image
            source={{ uri: `${userPosts.images[0]}` }}
            style={{
              height: windowWidth - 68,
              width: windowWidth - 68,
              borderRadius: 16,
              marginBottom: 17,
            }}
          />
        )}
      </TouchableOpacity>
      <View>
        <TouchableOpacity id='like'>
          <MaterialCommunityIcons name='heart-outline' />
          <Text>{numberOfLikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('IndividualPosts');
            viewUserPost(userPosts);
          }}
        >
          <MaterialCommunityIcons name='message-outline' />
          <Text>{numberOfComments}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
