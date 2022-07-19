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
import { AppProvider, useAppContext } from "./Context/AppContext";
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

const Tab = createBottomTabNavigator();

function App() {
  const [showSplashscreen, setShowSplashscreen] = useState(true);

  let [fontLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <AppProvider>
      <AppContainer
        showSplashscreen={showSplashscreen}
        setShowSplashscreen={setShowSplashscreen}
      />
    </AppProvider>
  );
}

function AppContainer({ showSplashscreen, setShowSplashscreen }) {
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplashscreen(false), 2000);
    return () => clearTimeout(timeout);
  }, []);
  const { setPost } = useAppContext();

  const responseListener = useRef();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;
          console.log("in-app: ", data.screen);
          switch (data.screen) {
            case "IndividualPosts": {
              const notificationPost = await getItemById(
                "Newsfeed",
                data.postId
              );
              await setPost(notificationPost);
              navigationRef.navigate("IndividualPosts", {
                commentId: data.commentId || null,
                itemUserId: notificationPost.userID,
                item: notificationPost,
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
        }
      );

    return () => {
      ExpoNotifications.removeNotificationSubscription(
        responseListener.current
      );
    };
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
