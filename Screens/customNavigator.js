//mix tab and stack navigators: https://www.youtube.com/watch?v=dkriklWelm0&t=139s

import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Newsfeed from "./Newsfeed/Newsfeed";
import BuildingInfo from "./BuildingInfo/BuildingInfo";
import CreatePost from "./CreatePost/CreatePost";
import { useAppContext } from "../Context/AppContext";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import AccountApprovalPending from "./AccountApprovalPending/AccountApprovalPending";
import IndividualPosts from "./IndividualPosts/IndividualPosts";
import EditProfile from "./ProfilePage/EditProfile/EditProfile";
import MyPosts from "./ProfilePage/MyPosts/MyPosts";
import ProfileGeneral from "./ProfilePage/ProfileGeneral/ProfileGeneral";
import Notifications from "./Notifications/Notifications";
import Announcements from "./Annoucements/Announcements";
import Notices from "./Notices/Notices";
import IndividualNotice from "./IndividualNotice/IndividualNotice";
import CustomSubStackScreenHeader from "./CustomSubStackScreenHeader.js";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ScreenHeader from "../components/ScreenHeader";
import MarketplaceScreen from "./Marketplace/MarketplaceScreen";
import MarketplaceItemInfoScreen from "./Marketplace/MarketplaceItemInfoScreen";
import MarketplaceNewPostScreen from "./Marketplace/MarketplaceNewPostScreen";
import IndividualAnnouncement from "./IndividualAnnouncement/IndividualAnnouncement";
import PrivateMessagingScreen from "./Messaging/PrivateMessagingScreen";
import MessagesListScreen from "./Messaging/MessagesListScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getItemById, uploadExpoPushToken } from "../utils/firebase.services";
import * as ExpoNotifications from "expo-notifications";
import TermsAndConditions from "./TermsAndConditions/TermsAndConditions";

const Stack = createStackNavigator();

// For in-app notificaion badges & alert. Need use in the future
// ExpoNotifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: false,
//     shouldPlaySound: false,
//     shouldSetBadge: true,
//   }),
// });

const MarketplaceNavigator = () => {
  const { currentUser } = useAppContext();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MarketplaceScreen"
        component={MarketplaceScreen}
        options={{
          headerShown: true,
          header: () => <ScreenHeader title={"Marketplace"} />,
        }}
      />
      <Stack.Screen
        name="BuildingInfo"
        component={BuildingInfo}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Building Info"} />
          ),
        }}
      />
      <Stack.Screen
        name="MarketplaceItemInfo"
        component={MarketplaceItemInfoScreen}
        options={({ route }) => ({
          header: (props) => (
            <CustomSubStackScreenHeader
              {...props}
              title={route.params.title + "'s Post"}
              currentUserId={currentUser.userID}
              itemUserId={route.params.item.userID}
              item={route.params.item}
              previousScreen={"MarketplaceScreen"}
              collection={"Marketplace"}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CreateMarketplaceItem"
        component={MarketplaceNewPostScreen}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Create post"} />
          ),
        }}
      />
      <Stack.Screen
        name="PrivateMessagingScreen"
        component={PrivateMessagingScreen}
        options={({ route }) => ({
          header: (props) => (
            <CustomSubStackScreenHeader
              {...props}
              title={route.params.otherPersonName}
            />
          ),
        })}
      />
      <Stack.Screen
        name="MessagesListScreen"
        component={MessagesListScreen}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Your Messages"} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const NewsfeedNavigator = ({ navigation }) => {
  const { post, currentUser, setCurrentUser, setPost } = useAppContext();

  const responseListener = useRef();

  useEffect(() => {
    responseListener.current =
      ExpoNotifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;
          console.log(data.screen);
          switch (data.screen) {
            case "IndividualPosts": {
              const notificationPost = await getItemById(
                "Newsfeed",
                data.postId
              );
              await setPost(notificationPost);
              navigation.navigate("IndividualPosts", {
                commentId: data.commentId || null,
                itemUserId: notificationPost.userID,
                item: notificationPost,
              });
              break;
            }
            case "PrivateMessagingScreen": {
              navigation.navigate("MarketplaceNavigator", {
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
              navigation.navigate("NotificationsNavigator", {
                screen: "Notices",
                params: {
                  noticeId: data.noticeId,
                },
              });
              break;
            case "Announcements":
              navigation.navigate("NotificationsNavigator", {
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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User has just signed in or already signed in from previous session
        const uid = user.uid;
        console.log("user is logged in with id: ", uid);
        const userData = await getItemById("Tenants", uid);
        if (userData && userData.tenantAuthorized && userData.isActive) {
          uploadExpoPushToken(user);
          setCurrentUser(userData);
        }
        // ...
      } else {
        // User is not logged in or just signed out
        // ...
        console.log("user is not logged in");
        setCurrentUser({});
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Stack.Navigator>
      {currentUser && currentUser.tenantAuthorized ? (
        <>
          <Stack.Screen
            name="Newsfeed"
            component={Newsfeed}
            options={{
              title: "Newsfeed",
              headerLeft: null,
              headerShown: true,
              header: () => <ScreenHeader title={"Newsfeed"} />,
            }}
          />
          <Stack.Screen
            name="BuildingInfo"
            component={BuildingInfo}
            options={{
              header: (props) => (
                <CustomSubStackScreenHeader
                  {...props}
                  title={"Building Info"}
                />
              ),
            }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePost}
            options={{
              header: (props) => (
                <CustomSubStackScreenHeader {...props} title={"Create post"} />
              ),
            }}
          />
          <Stack.Screen
            name="IndividualPosts"
            component={IndividualPosts}
            options={({ route }) => ({
              header: (props) => (
                <CustomSubStackScreenHeader
                  {...props}
                  title={`${post.userFirstName}'s Post`}
                  currentUserId={currentUser.userID}
                  itemUserId={route.params.item.userID}
                  item={route.params.item}
                  previousScreen={"Newsfeed"}
                  collection={"Newsfeed"}
                />
              ),
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
              headerShown: false,
              tabBarVisible: false,
              // hide tab bar to use when user Logs out in Profile screen
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              header: (props) => (
                <CustomSubStackScreenHeader {...props} title={"Sign up"} />
              ),
            }}
          />
          <Stack.Screen
            name="AccountApprovalPending"
            component={AccountApprovalPending}
            options={{
              header: (props) => (
                <CustomSubStackScreenHeader {...props} title={" "} />
              ),
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              header: (props) => (
                <CustomSubStackScreenHeader {...props} title={" "} />
              ),
            }}
          />
          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditions}
            options={{
              header: (props) => (
                <CustomSubStackScreenHeader
                  {...props}
                  title={"Terms & Conditions"}
                />
              ),
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const ProfileNavigator = () => {
  const { post, currentUser } = useAppContext();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileGeneral"
        component={ProfileGeneral}
        options={{
          title: "Profile",
          headerShown: true,
          header: () => <ScreenHeader title={"Profile"} />,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Edit profile"} />
          ),
        }}
      />
      <Stack.Screen
        name="MyPosts"
        component={MyPosts}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"My posts"} />
          ),
        }}
      />
      <Stack.Screen
        name="IndividualPosts"
        component={IndividualPosts}
        options={({ route }) => ({
          header: (props) => (
            <CustomSubStackScreenHeader
              {...props}
              title={`${post.userFirstName}'s Post`}
              currentUserId={currentUser.userID}
              itemUserId={route.params.item.userID}
              item={route.params.item}
              collection={"Newsfeed"}
              previousScreen={"MyPosts"}
            />
          ),
        })}
      />
      <Stack.Screen
        name="BuildingInfo"
        component={BuildingInfo}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Building Info"} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const NotificationNavigator = () => {
  const { post } = useAppContext();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: true,
          header: () => <ScreenHeader title={"Notifications"} />,
        }}
      />
      <Stack.Screen
        name="IndividualPosts"
        component={IndividualPosts}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader
              {...props}
              title={`${post.userFirstName}'s Post`}
            />
          ),
        }}
      />
      <Stack.Screen
        name="BuildingInfo"
        component={BuildingInfo}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Building Info"} />
          ),
        }}
      />
      <Stack.Screen
        name="Announcements"
        component={Announcements}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Announcements"} />
          ),
        }}
      />
      <Stack.Screen
        name="Notices"
        component={Notices}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Notices"} />
          ),
        }}
      />
      <Stack.Screen
        name="IndividualNotice"
        component={IndividualNotice}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Notice"} />
          ),
        }}
      />
      <Stack.Screen
        name="IndividualAnnouncement"
        component={IndividualAnnouncement}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Announcement"} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export {
  MarketplaceNavigator,
  NewsfeedNavigator,
  ProfileNavigator,
  NotificationNavigator,
};
