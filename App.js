import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { ThemeProvider } from "./ThemeContext";
import AppLoading from "expo-app-loading";
import React, { useState, useEffect, useRef } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppContext } from "./Context/AppContext";
import {
  NewsfeedNavigator,
  ProfileNavigator,
  NotificationNavigator,
  MarketplaceNavigator,
} from "./Screens/customNavigator.js";
import {
  ActionSheetProvider,
  connectActionSheet,
} from "@expo/react-native-action-sheet";
import * as ExpoNotifications from "expo-notifications";
import { getItemById } from "./utils/firebase.services";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "./firebase-config";
import { wait } from "./utils/wait";
import { TabBar } from "./components/TabBar/TabBar";

const Tab = createBottomTabNavigator();

function App() {
  const responseListener = useRef();
  const navigationRef = useNavigationContainerRef();

  const [post, setPost] = useState({});
  const [currentMarketplacePost, setCurrentMarketplacePost] = useState({});
  const [announcements, setAnnouncements] = useState(0);
  const [notices, setNotices] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [notifications, setNotifications] = useState({});
  const [unauthorizedUsers, setUnauthorizedUsers] = useState({});
  const [allUsers, setAllUsers] = useState({});
  const [buildings, setBuildings] = useState({});
  const [marketplaceBadges, setMarketplaceBadges] = useState({
    unseen: [],
    list: [],
  });
  const [notificationBadges, setNotificationBadges] = useState({
    unseen: [],
    list: [],
  });
  const states = {
    post,
    setPost,
    currentUser,
    setCurrentUser,
    notifications,
    setNotifications,
    unauthorizedUsers,
    setUnauthorizedUsers,
    allUsers,
    setAllUsers,
    buildings,
    setBuildings,
    marketplaceBadges,
    setMarketplaceBadges,
    notificationBadges,
    setNotificationBadges,
    announcements,
    setAnnouncements,
    notices,
    setNotices,
    currentMarketplacePost,
    setCurrentMarketplacePost,
  };

  useEffect(() => {
    let unsubscribeMarketplace;
    if (currentUser && currentUser.userID) {
      // console.log("register for marketplace notifications");
      const marketplaceReference = collection(db, `MessagingList`);
      const marketplaceQuery = query(
        marketplaceReference,
        where("hasPeople", "array-contains", currentUser.userID)
      );
      unsubscribeMarketplace = onSnapshot(marketplaceQuery, (querySnapshot) => {
        const newMessages = [];
        const messagesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.lastMessage &&
            data.lastMessage.senderId !== currentUser.userID &&
            (!data.lastMessage.seen || data.isNew)
          ) {
            newMessages.push(data.id);
          }
          messagesList.push(data);
        });

        console.log("messagesList onSnapshot", messagesList.length);
        setMarketplaceBadges({
          unseen: newMessages,
          list: messagesList,
        });
      });

      return () => {
        if (unsubscribeMarketplace) {
          unsubscribeMarketplace();
        }
      };
    }
  }, [currentUser.userID]);

  useEffect(() => {
    let unsubscribeNotifications;
    if (currentUser && currentUser.userID) {
      const notificationRef = collection(
        db,
        `Tenants/${currentUser.userID}/Notifications`
      );
      unsubscribeNotifications = onSnapshot(
        notificationRef,
        (querySnapshot) => {
          const unseenNotifications = [];
          const list = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.wasSeen === false) {
              unseenNotifications.push(data.id);
            }
            list.push(data);
          });

          setNotificationBadges({
            unseen: unseenNotifications,
            list: list,
          });
        }
      );
    }

    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, [currentUser.userID]);

  useEffect(() => {
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;
          // if app is opened => no timeout. If app was closed => set timeout of 5s for loading user data & splashscreen.
          const timeout = currentUser.userID ? 0 : 5000;
          wait(timeout).then(async () => {
            switch (data.screen) {
              case "IndividualPosts": {
                console.log("start navigation");
                const notificationPost = await getItemById(
                  "Newsfeed",
                  data.postId
                );
                setPost(notificationPost);
                navigationRef.navigate("NewsfeedNavigator", {
                  screen: "IndividualPosts",
                  params: {
                    commentId: data.commentId || null,
                    itemUserId: notificationPost.userID,
                    item: notificationPost,
                  },
                });

                // update notification item as seen
                const colRef = doc(
                  db,
                  "Tenants",
                  currentUser.userID,
                  "Notifications",
                  data.notificationId
                );
                await updateDoc(colRef, {
                  wasSeen: true,
                });

                break;
              }
              case "PrivateMessagingScreen": {
                navigationRef.navigate("MarketplaceNavigator", {
                  screen: "PrivateMessagingScreen",
                  params: {
                    otherPersonName: data.senderName,
                    otherPersonId: data.senderId,
                    channelId: data.channelId,
                  },
                });

                break;
              }
              case "Notices":
                navigationRef.navigate("NotificationsNavigator", {
                  screen: "Notices",
                  params: {
                    noticeId: data.noticeId,
                  },
                });

                break;
              case "Announcements":
                navigationRef.navigate("NotificationsNavigator", {
                  screen: "Announcements",
                  params: {
                    announcementId: data.announcementId,
                  },
                });

                break;
              default:
                break;
            }
          });
        }
      );

    return () => {
      ExpoNotifications.removeNotificationSubscription(
        responseListener.current
      );
    };
  }, []);

  let [fontLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <AppContext.Provider value={states}>
      <AppContainer navigationRef={navigationRef} />
    </AppContext.Provider>
  );
}

function AppContainer({ navigationRef }) {
  return (
    <ActionSheetProvider>
      <ThemeProvider>
        <NavigationContainer ref={navigationRef}>
          <Tab.Navigator
            initialRouteName="NewsfeedNavigator"
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={() => ({
              headerShown: false,
              tabBarActiveTintColor: "#395E66",
              tabBarStyle: {
                height: 70,
                backgroundColor: "white",
                shadowColor: "#4D4D4D", // color: #4D4D4D
                shadowOffset: {
                  // no offset x, y
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.15, // opacity: 0.15
                shadowRadius: 24, // radius: 24
                elevation: 5, // elevation: 5
              },
            })}
          >
            {/* ======= Newsfeed ======= */}
            <Tab.Screen
              name="NewsfeedNavigator"
              component={NewsfeedNavigator}
              options={() => ({
                title: "Newsfeed",
              })}
            />

            {/* ======= Marketplace ======= */}
            <Tab.Screen
              name="MarketplaceNavigator"
              component={MarketplaceNavigator}
              options={{
                title: "Marketplace",
              }}
            />

            {/* ======= Notifications ======= */}
            <Tab.Screen
              name="NotificationsNavigator"
              component={NotificationNavigator}
              options={{
                title: "Notifications",
                tabBarLabelStyle: {
                  fontSize: 12,
                  paddingBottom: 2,
                },
              }}
            />

            {/* ======= Profile ======= */}
            <Tab.Screen
              name="ProfileNavigator"
              component={ProfileNavigator}
              options={{
                title: "Profile",
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </ActionSheetProvider>
  );
}

const ConnectedApp = connectActionSheet(App);

export default ConnectedApp;
