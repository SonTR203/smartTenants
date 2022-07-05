//mix tab and stack navigators: https://www.youtube.com/watch?v=dkriklWelm0&t=139s

import React, { useEffect, useState } from "react";
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
import { getItemById } from "../utils/firebase.services";

const Stack = createStackNavigator();

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

const NewsfeedNavigator = () => {
  const { post, currentUser, setCurrentUser } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("user is logged in: ", user.uid);
        const userData = await getItemById("Tenants", uid);
        if (userData) {
          setCurrentUser(userData);
          setIsLoggedIn(true);
        }
        // ...
      } else {
        // User is signed out
        // ...
        setIsLoggedIn(false);
        setCurrentUser({});
        console.log("user is logged out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoggedIn) {
    return (
      <Stack.Navigator>
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
              <CustomSubStackScreenHeader {...props} title={"Building Info"} />
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
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login", headerShown: false }}
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
      </Stack.Navigator>
    );
  }
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
        name="Login"
        component={Login}
        options={{ title: "Login", headerLeft: null }}
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
