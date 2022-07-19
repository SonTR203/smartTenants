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
import Splashscreen from "./Screens/Splashscreen/Splashscreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  NewsfeedNavigator,
  ProfileNavigator,
  NotificationNavigator,
  MarketplaceNavigator,
} from "./Screens/customNavigator.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActionSheetProvider,
  connectActionSheet,
} from "@expo/react-native-action-sheet";
import { View } from "react-native";
import NotificationBadge from "./components/NotificationBadge";
import * as ExpoNotifications from "expo-notifications";
import { getItemById } from "./utils/firebase.services";

import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "./firebase-config";

const Tab = createBottomTabNavigator();

function App() {
  const [showSplashscreen, setShowSplashscreen] = useState(true);

  const responseListener = useRef();
  const navigationRef = useNavigationContainerRef();

  const [post, setPost] = useState({});
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
    let timeout;
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;
          console.log("in-app: ", data.screen);
          switch (data.screen) {
            case "IndividualPosts": {
              // timeout = setTimeout(async () => {
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
              // }, 6000);

              break;
            }
            case "PrivateMessagingScreen": {
              // timeout = setTimeout(() => {
              navigationRef.navigate("MarketplaceNavigator", {
                screen: "PrivateMessagingScreen",
                params: {
                  otherPersonName: data.senderName,
                  otherPersonId: data.senderId,
                  channelId: data.channelId,
                },
              });
              // }, 2000);

              break;
            }
            case "Notices":
              // timeout = setTimeout(() => {
              navigationRef.navigate("NotificationsNavigator", {
                screen: "Notices",
                params: {
                  noticeId: data.noticeId,
                },
              });
              // }, 2000);

              break;
            case "Announcements":
              // timeout = setTimeout(() => {
              navigationRef.navigate("NotificationsNavigator", {
                screen: "Announcements",
                params: {
                  announcementId: data.announcementId,
                },
              });
              // }, 2000);

              break;
            default:
              break;
          }
        }
      );

    return () => {
      ExpoNotifications.removeNotificationSubscription(
        responseListener.current
      );
      if (timeout) {
        clearTimeout(timeout);
      }
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
      <AppContainer
        navigationRef={navigationRef}
        showSplashscreen={showSplashscreen}
        setShowSplashscreen={setShowSplashscreen}
      />
    </AppContext.Provider>
  );
}

function AppContainer({
  showSplashscreen,
  setShowSplashscreen,
  navigationRef,
}) {
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplashscreen(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ActionSheetProvider>
      <ThemeProvider>
        {showSplashscreen ? (
          <Splashscreen />
        ) : (
          <NavigationContainer ref={navigationRef}>
            <Tab.Navigator
              initialRouteName="NewsfeedNavigator"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                  let iconName;
                  let color;
                  if (route.name === "MarketplaceNavigator") {
                    iconName = "store";
                    color = focused ? "#395E66" : "#395E6654";
                  } else if (route.name === "NewsfeedNavigator") {
                    iconName = "newspaper";
                    color = focused ? "#395E66" : "#395E6654";
                  } else if (route.name === "NotificationsNavigator") {
                    iconName = "bell";
                    color = focused ? "#395E66" : "#395E6654";
                  } else if (route.name === "ProfileNavigator") {
                    iconName = "account";
                    color = focused ? "#395E66" : "#395E6654";
                  }
                  return (
                    <View>
                      <MaterialCommunityIcons
                        name={iconName}
                        size={28}
                        color={color}
                      />
                      <NotificationBadge screen={route.name} />
                    </View>
                  );
                },

                headerShown: false,
                tabBarActiveTintColor: "#395E66",
              })}
            >
              {/* ======= Marketplace ======= */}
              <Tab.Screen
                name="MarketplaceNavigator"
                component={MarketplaceNavigator}
                options={{
                  title: "Marketplace",
                  headerShown: false,
                  tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 2,
                  },
                }}
              />

              {/* ======= Newsfeed ======= */}
              <Tab.Screen
                name="NewsfeedNavigator"
                component={NewsfeedNavigator}
                options={({ route }) => ({
                  title: "Newsfeed",
                  left: { display: "none" },
                  tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 2,
                  },
                  tabBarStyle: {
                    display: getRouteName(route) ? getRouteName(route) : "none",
                  },
                })}
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
                  headerShown: false,
                  tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 2,
                  },
                }}
                tabBarOptions={{
                  display: "none",
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </ThemeProvider>
    </ActionSheetProvider>
  );
}

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName?.includes("Login") ||
    routeName?.includes("Signup") ||
    routeName?.includes("AccountApprovalPending") ||
    routeName?.includes("ForgotPassword")
  ) {
    return "none";
  } else if (routeName == undefined) {
    return "none";
  }
  return "flex";
};

const ConnectedApp = connectActionSheet(App);

export default ConnectedApp;
