import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { React, useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
import _ from 'lodash';
import { Platform } from 'expo-modules-core';

let setNotifPost;
let globalCurrentUser;
let globalSetWasSeenVar;
let globalWasSeenVar;

const Notifications = ({ navigation }) => {
  const [theme, styleVariables] = useTheme();
  const { currentUser, setCurrentUser } = useAppContext();
  const { post, setPost } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [wasSeenVar, setWasSeenVar] = useState();
  const [refreshing, setRefreshing] = useState(true);
  globalSetWasSeenVar = setWasSeenVar;
  globalWasSeenVar = wasSeenVar;
  setNotifPost = setPost;
  globalCurrentUser = currentUser;

  const colReference = collection(
    db,
    'Users',
    `${currentUser.userDocId}`,
    'Notifications'
  );

  useEffect(() => {
    getNotifications();
  }, [globalWasSeenVar]);

  const getNotifications = async () => {
    const data = await getDocs(colReference);

    let notificationsList = data.docs.map((item) => ({
      ...item._document.data.value.mapValue.fields,
      id: item._key.path.segments[8],
    }));

    let sortedListOfNotifications = _.sortBy(
      notificationsList,
      'timestamp.integerValue'
    ).reverse();

    setNotifications(sortedListOfNotifications);
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
      edges={['top']}
    >
      <StatusBar style='auto' />

      <View style={theme.pageContainer}>
        {refreshing ? <ActivityIndicator /> : null}
        {notifications.length > 0 && (
          <FlatList
            ListHeaderComponent={
              <ListHeader
                navigation={navigation}
                styleVariables={styleVariables}
                theme={theme}
              />
            }
            data={notifications}
            renderItem={({ item }) => (
              <NotificationItem
                notifications={item}
                navigation={navigation}
                theme={theme}
                styleVariables={styleVariables}
                windowWidth={windowWidth}
              />
            )}
            refreshControl={
              <RefreshControl
                onRefresh={getNotifications}
                refreshing={refreshing}
                style={{ backgroundColor: styleVariables.colors.primary }}
                tintColor={'white'}
              />
            }
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <ListFooter styleVariables={styleVariables} theme={theme} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

function NotificationItem({
  notifications,
  navigation,
  theme,
  styleVariables,
}) {
  const [timeSincePost, setTimeSincePost] = useState('');

  notifications = {
    content: notifications.content.stringValue,
    id: notifications.id,
    postID: notifications.postID.stringValue,
    timestamp: notifications.timestamp,
    userID: notifications.userID.stringValue,
    wasSeen: notifications.wasSeen.booleanValue,
  };

  useEffect(() => {
    setTime();
  }, [notifications]);

  const setWasSeenToTrue = async (notifications) => {
    const colRef = doc(
      db,
      'Users',
      `${globalCurrentUser.userDocId}`,
      'Notifications',
      notifications.id
    );
    await updateDoc(colRef, {
      wasSeen: true,
    }).then(() => {
      globalSetWasSeenVar(!globalWasSeenVar);
    });
  };

  const setTime = () => {
    let time = notifications.timestamp;
    if (time != undefined) {
      let timePosted = time.integerValue;
      let currentTime = Date.now();
      let timeDifferenceMinutes = ((currentTime - timePosted) / 60000).toFixed(
        0
      );
      let timeDifferenceHours = (timeDifferenceMinutes / 60).toFixed(0);
      let timeDifferenceDays = (timeDifferenceHours / 24).toFixed(0);
      let timeDifferenceWeeks = (timeDifferenceDays / 7).toFixed(0);

      if (timeDifferenceMinutes <= 59) {
        setTimeSincePost(
          timeDifferenceMinutes > 1
            ? `${timeDifferenceMinutes} minutes ago`
            : `${timeDifferenceMinutes} minute ago`
        );
      } else if (timeDifferenceMinutes > 59 && timeDifferenceHours <= 23) {
        setTimeSincePost(
          timeDifferenceHours > 1
            ? `${timeDifferenceHours} hours ago`
            : `${timeDifferenceHours} hour ago`
        );
      } else if (
        timeDifferenceDays <= 6 &&
        timeDifferenceMinutes > 59 &&
        timeDifferenceHours > 23
      ) {
        setTimeSincePost(
          timeDifferenceDays > 1
            ? `${timeDifferenceDays} days ago`
            : `${timeDifferenceDays} day ago`
        );
      } else if (
        timeDifferenceWeeks <= 10 &&
        timeDifferenceDays > 6 &&
        timeDifferenceMinutes > 59 &&
        timeDifferenceHours > 23
      ) {
        setTimeSincePost(
          timeDifferenceWeeks > 1
            ? `${timeDifferenceWeeks} weeks ago`
            : `${timeDifferenceWeeks} week ago`
        );
      } else {
        setTimeSincePost('10+ weeks ago');
      }
    }
  };

  return (
    <TouchableOpacity
      // navigate to post page on press
      id='post'
      onPress={() => {
        navigation.navigate('IndividualPosts');
        viewNotificationPost(notifications);
        setWasSeenToTrue(notifications);
      }}
      style={[theme.cardButton, { marginTop: 0, marginBottom: 17 }]}
    >
      <View id='notificationContent'>
        <View
          id='timeStamp-readState'
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={[styleVariables.fontSizes.callout, { opacity: 0.66 }]}>
            {timeSincePost}
          </Text>
          {notifications.wasSeen == false && (
            <View
              id='notificationIndice'
              style={{
                height: 8,
                width: 8,
                backgroundColor: styleVariables.colors.primary,
                borderRadius: 99,
                marginLeft: 8,
              }}
            ></View>
          )}
        </View>
        <Text>{notifications.content}</Text>
      </View>

      <MaterialCommunityIcons
        name='chevron-right'
        size={24}
        color={styleVariables.colors.primary}
        style={{ opacity: 0.33 }}
      />
    </TouchableOpacity>
  );
}

async function viewNotificationPost(notifications) {
  const docRef = doc(db, 'Newsfeed', `${notifications.postID}`);
  const docSnap = await getDoc(docRef);
  let postData = docSnap.data();
  const likesColReference = collection(
    db,
    'Newsfeed',
    `${docSnap.id}`,
    'peopleWhoLiked'
  );
  const data = await getDocs(likesColReference);
  let numberOfLikes = data.docs.length;

  let post = {
    comments: postData.comments.arrayValue,
    id: docSnap.id,
    image: postData.images,
    peopleWhoLiked: postData.peopleWhoLiked,
    postContent: postData.postContent,
    userID: postData.userID,
    userProfileImage: postData.userProfileImage,
    userFirstName: postData.userFirstName,
    userLastName: postData.userLastName,
    numberOfLikes: numberOfLikes,
    timestamp: postData.timestamp,
  };

  if (docSnap.exists()) {
    setNotifPost(post);
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
}

function ListHeader({ navigation, styleVariables, theme }) {
  return (
    <>
      <View id='header' style={theme.header}>
        {/* headerPageTitle */}
        <Text
          id='headerPageTitle'
          style={[
            styleVariables.fontSizes.header,
            {
              color: styleVariables.colors.white,
              marginBottom: 4,
            },
          ]}
        >
          Notifications
        </Text>
        {/* buildingInfo */}
        <Pressable
          id='buildingInfo'
          onPress={() => {
            navigation.navigate('BuildingInfo');
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            opacity: 0.66,
          }}
        >
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.white },
            ]}
          >
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
        <View
          id='topCard'
          style={[
            theme.topCard,
            { elevation: Platform.OS === 'android' ? 0 : 20 },
          ]}
        >
          <Pressable
            id='announcements'
            onPress={() => {
              alert('navigate to announcements (not yet implemented)');
            }}
            style={[theme.cardButton, { marginTop: 17, marginBottom: 17 }]}
          >
            <Text
              style={[
                styleVariables.fontSizes.title,
                { color: styleVariables.colors.primary },
              ]}
            >
              Announcements
            </Text>
            <View id='counter' style={theme.counter}>
              <Text
                id='notificationCounter'
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.white },
                ]}
              >
                2
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

      {/* notices */}
      <View id='secondTopCard'>
        <Pressable
          id='notices'
          onPress={() => {
            alert('navigate to notices (not yet implemented)');
          }}
          style={[theme.cardButton, { marginTop: 0, marginBottom: 17 }]}
        >
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Notices
          </Text>
          <View id='counter' style={theme.counter}>
            <Text
              id='notificationCounter'
              style={[
                theme.notificationCounter,
                styleVariables.fontSizes.callout,
                { color: styleVariables.colors.white },
              ]}
            >
              1
            </Text>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={styleVariables.colors.primary}
            />
          </View>
        </Pressable>
      </View>

      {/* divider */}
      <View id='divider' style={{ width: '100%', alignItems: 'center' }}>
        <Text
          style={{
            height: 1.5,
            width: '66%',
            backgroundColor: styleVariables.colors.primary,
            opacity: 0.33,
            borderRadius: 99,
            marginBottom: 17,
          }}
        ></Text>
      </View>
    </>
  );
}

function ListFooter({ styleVariables }) {
  return (
    <View
      style={{
        height: 102,
        paddingVertical: 17,
        paddingHorizontal: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={[
          styleVariables.fontSizes.callout,
          {
            color: styleVariables.colors.black,
            opacity: 0.66,
            paddingBottom: 17,
          },
        ]}
      >
        You've reached the end
      </Text>
    </View>
  );
}

export default Notifications;
