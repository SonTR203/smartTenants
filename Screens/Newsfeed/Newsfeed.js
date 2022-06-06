import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from '@firebase/firestore';
import { db } from '../../firebase-config';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../ThemeContext';
import { setTime } from '../../utils/setTime';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import _ from 'lodash';
const windowWidth = Dimensions.get('window').width;
import { Platform } from 'expo-modules-core';

let globalPost;
let setGlobalPost;
let globalCurrentUser;

const Newsfeed = ({ navigation }) => {
  const [theme, styleVariables] = useTheme();
  const [posts, setPosts] = useState([]);
  const { post, setPost } = useAppContext();
  const { currentUser, setCurrentUser } = useAppContext();
  const colRef = collection(db, 'Newsfeed');
  const [refreshing, setRefreshing] = useState(true);

  globalPost = post;
  setGlobalPost = setPost;
  globalCurrentUser = currentUser;

  const styles = StyleSheet.create({
    newsfeedContainer: {
      flex: 1,
      backgroundColor: styleVariables.colors.primary,
    },
  });

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const data = await getDocs(colRef);
    let listOfPosts = data.docs.map((item) => ({
      ...item._document.data.value.mapValue.fields,
      id: item._key.path.segments[6],
    }));
    let sortedListOfPosts = _.sortBy(
      listOfPosts,
      'timestamp.integerValue'
    ).reverse();
    setPosts(sortedListOfPosts);

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.newsfeedContainer} edges={['top']}>
      <StatusBar style='auto' />
      <View style={theme.pageContainer}>
        {refreshing ? <ActivityIndicator /> : null}

        {posts.length > 0 && (
          <FlatList
            ListHeaderComponent={
              <ListHeader
                navigation={navigation}
                styleVariables={styleVariables}
                theme={theme}
              />
            }
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Post
                posts={item}
                navigation={navigation}
                theme={theme}
                styleVariables={styleVariables}
                windowWidth={windowWidth}
              />
            )}
            refreshControl={
              <RefreshControl
                onRefresh={getPosts}
                refreshing={refreshing}
                style={{ backgroundColor: styleVariables.colors.primary }}
                tintColor={'white'}
              />
            }
            ListFooterComponent={
              <ListFooter styleVariables={styleVariables} theme={theme} />
            }
          />
        )}

        {posts.length < 1 && (
          <View>
            <Text>no items to show</Text>
          </View>
        )}

        {/* FAB */}
        <Pressable
          id='FAB'
          onPress={() => {
            navigation.navigate('CreatePost');
          }}
          style={theme.fab}
        >
          <MaterialCommunityIcons
            name='plus'
            size={24}
            color={styleVariables.colors.white}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

//============================== Individual Post Cards ==========================
function Post({ posts, navigation, theme, styleVariables, windowWidth }) {
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  let peopleWhoLiked = [];
  let peopleWhoLikedDocIds = [];

  posts = {
    commentCount: posts.commentCount.integerValue,
    comments: posts.comments.arrayValue,
    id: posts.id,
    image: posts.images.arrayValue.values[0].stringValue,
    peopleWhoLiked: posts.peopleWhoLiked.arrayValue,
    postContent: posts.postContent.stringValue,
    userID: posts.userID.stringValue,
    userProfileImage: posts.userProfileImage.stringValue,
    userFirstName: posts.userFirstName.stringValue,
    userLastName: posts.userLastName.stringValue,
    numberOfLikes: numberOfLikes,
    timestamp: posts.timestamp,
  };

  const styles = StyleSheet.create({
    ownerInfo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 12,
    },
    ownerImageAndName: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      height: 43,
      width: 43,
      borderRadius: 12,
    },
    userName: {
      color: styleVariables.colors.black,
      marginLeft: 8,
    },
    timePosted: {
      color: styleVariables.colors.black,
      opacity: 0.66,
    },
    postTextContent: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
    postImage: {
      height: windowWidth - 68,
      width: windowWidth - 68,
      borderRadius: 16,
      marginBottom: 17,
    },
    likeContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 5,
    },
    likeButton: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    icon: {
      marginRight: 8,
    },
    likeAndCommentCount: {
      color: styleVariables.colors.black,
    },
    commentContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      marginLeft: 17,
    },
  });

  const getLikes = async () => {
    const likesColReference = collection(
      db,
      'Newsfeed',
      `${posts.id}`,
      'peopleWhoLiked'
    );

    const data = await getDocs(likesColReference);
    setNumberOfLikes(data.docs.length);
    data.docs.map((item) => {
      peopleWhoLiked.push(item._document.data.value.mapValue.fields.userID);
    });

    //set new array of the docoument ids for all likes
    data.docs.map((item) => {
      peopleWhoLikedDocIds.push(item._document.key.path.segments[8]);
    });

    let time = setTime(posts);
    setTimeSincePost(time);
    getComments();
    setHeartsToGreen();
  };
  getLikes();

  const setHeartsToGreen = () => {
    peopleWhoLiked.map((item) => {
      if (item.stringValue == globalCurrentUser.userDocId) {
        setUserLiked(true);
      }
    });
  };

  const getComments = async () => {
    let commentCount = posts.commentCount;
    if (commentCount) {
      setNumberOfComments(commentCount);
    }
  };

  const likePost = async () => {
    // ================ checking is current user liked post ====================
    if (peopleWhoLiked != 0) {
      peopleWhoLiked.map((item) => {
        if (item.stringValue == globalCurrentUser.userDocId) {
          setUserLiked(false);

          removeLike();
        } else {
          createLikeInDB();
        }
      });
    } else {
      createLikeInDB();
    }
  };

  const createLikeInDB = async () => {
    const notificationColRef = collection(
      db,
      `Users/${posts.userID}/Notifications`
    );
    const peopleWhoLikedColRef = collection(
      db,
      `Newsfeed/${posts.id}/peopleWhoLiked`
    );

    //=========== adding like notification============
    try {
      await addDoc(notificationColRef, {
        content: `${globalCurrentUser.firstName} ${globalCurrentUser.lastName} liked your post.`,
        postID: posts.id,
        userID: posts.userID,
        wasSeen: false,
        timestamp: Date.now(),
      }).then(() => {
        getLikes();
      });
    } catch (error) {
      console.log(error);
    }

    // =============== adding user to peopleWhoLiked subcollection =============
    try {
      await addDoc(peopleWhoLikedColRef, {
        firstName: globalCurrentUser.firstName,
        lastName: globalCurrentUser.lastName,
        postID: posts.id,
        userID: globalCurrentUser.userDocId,
      }).then(() => {
        setUserLiked(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeLike = async () => {
    //remove user from list of peopleWhoLiked
    peopleWhoLikedDocIds.map(async (item) => {
      if ((item.userID = globalCurrentUser.userDocId)) {
        const singleDoc = doc(
          db,
          `Newsfeed/${posts.id}/peopleWhoLiked/${item}`
        );
        await deleteDoc(singleDoc);
      }
    });

    //========= TODO:  delete notification from other user that there was a like =========

    // const notificationSingleDoc = doc(db, `Users/${posts.userID}/Notifications/${}`)
    // await deleteDoc(notificationSingleDoc);
  };
  return (
    <View id='post' style={theme.cardContainer}>
      {/* ownerInfo */}
      <View id='ownerInfo' style={styles.ownerInfo}>
        <View className='ownerImageAndName' style={styles.ownerImageAndName}>
          <Image
            source={{ uri: `${posts.userProfileImage}` }}
            style={styles.profileImage}
          />
          <Text style={[styleVariables.fontSizes.bodyBold, styles.userName]}>
            {posts.userFirstName} {posts.userLastName}
          </Text>
        </View>
        <Text
          id='timePosted'
          style={[styleVariables.fontSizes.callout, styles.timePosted]}
        >
          {timeSincePost}
        </Text>
      </View>

      {/* postContent */}
      <TouchableOpacity
        id='postContent'
        onPress={() => {
          navigation.push('IndividualPosts');
          setGlobalPost(posts);
        }}
      >
        <View className='postTextContent'>
          <Text style={[styleVariables.fontSizes.body, styles.postTextContent]}>
            {posts.postContent}
          </Text>
        </View>

        {posts.image != 'no image posted' && (
          <Image
            source={{
              uri: `${posts.image}`,
            }}
            style={styles.postImage}
          />
        )}
      </TouchableOpacity>

      {/* likeAndComment */}
      <View className='likeAndComment' style={styles.likeContainer}>
        {/* =========================== LIKE ============================= */}
        <TouchableOpacity
          id='like'
          onPress={likePost}
          style={styles.likeButton}
        >
          {userLiked && (
            <MaterialCommunityIcons
              name='heart'
              size={24}
              color='#0AA74C'
              style={styles.icon}
            />
          )}
          {!userLiked && (
            <MaterialCommunityIcons
              name='heart-outline'
              size={24}
              color={styleVariables.colors.black}
              style={styles.icon}
            />
          )}
          <Text
            style={[styleVariables.fontSizes.body, styles.likeAndCommentCount]}
          >
            {numberOfLikes}
          </Text>
        </TouchableOpacity>

        {/* =========================== COMMENT ============================= */}
        <TouchableOpacity
          id='comment'
          onPress={() => {
            navigation.navigate('IndividualPosts');
            setGlobalPost(posts);
          }}
          style={styles.commentContainer}
        >
          <MaterialCommunityIcons
            name='message-outline'
            size={24}
            color={styleVariables.colors.black}
            style={styles.icon}
          />
          <Text
            style={[styleVariables.fontSizes.body, styles.likeAndCommentCount]}
          >
            {numberOfComments}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ListHeader({ navigation, styleVariables, theme }) {
  const styles = StyleSheet.create({
    headerPageTitle: {
      color: styleVariables.colors.white,
      marginBottom: 4,
    },
    buildingInfo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      opacity: 0.66,
    },
    buildingAddress: {
      color: styleVariables.colors.white,
    },
    topCard: {
      elevation: Platform.OS == 'android' ? 0 : 20,
    },
    announcementLink: {
      marginTop: 17,
      marginBottom: 22,
    },
    announcementText: { color: styleVariables.colors.primary },
    notificationCounter: {
      color: styleVariables.colors.white,
    },
  });

  return (
    <>
      <View id='header' style={theme.header}>
        {/* headerPageTitle */}
        <Text
          id='headerPageTitle'
          style={[styleVariables.fontSizes.header, styles.headerPageTitle]}
        >
          Newsfeed
        </Text>

        <Pressable
          id='buildingInfo'
          onPress={() => {
            navigation.navigate('BuildingInfo');
          }}
          style={styles.buildingInfo}
        >
          <Text style={[styleVariables.fontSizes.body, styles.buildingAddress]}>
            {globalCurrentUser.buildingAddress}
          </Text>
          <MaterialCommunityIcons
            name='chevron-right'
            size={24}
            color={styleVariables.colors.white}
          />
        </Pressable>
      </View>

      {/* announcements */}
      <View style={theme.firstListItem}>
        <View id='topCard' style={[theme.topCard, styles.topCard]}>
          <Pressable
            id='announcements'
            onPress={() => {
              alert('navigate to announcements (not yet implemented)');
            }}
            style={[theme.cardButton, styles.announcementLink]}
          >
            <Text
              style={[styleVariables.fontSizes.title, styles.announcementText]}
            >
              Announcements
            </Text>
            <View id='counter' style={theme.counter}>
              <Text
                id='notificationCounter'
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  styles.notificationCounter,
                ]}
              >
                99+
              </Text>
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color={styleVariables.colors.primary}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </>
  );
}

function ListFooter({ styleVariables }) {
  const styles = StyleSheet.create({
    footerContainer: {
      height: 204,
      paddingVertical: 17,
      paddingHorizontal: 34,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerMessage: {
      color: styleVariables.colors.black,
      opacity: 0.66,
      paddingBottom: 8,
    },
  });

  return (
    <View style={styles.footerContainer}>
      <Text style={[styleVariables.fontSizes.callout, styles.footerMessage]}>
        Oh oh! Seems like you've reached the end.
      </Text>
      <Text style={[styleVariables.fontSizes.callout, styles.footerMessage]}>
        Refresh at the top for new posts!
      </Text>
    </View>
  );
}

export default Newsfeed;
