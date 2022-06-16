//mix tab and stack navigators: https://www.youtube.com/watch?v=dkriklWelm0&t=139s

import React from "react";
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
import AdminPanel from "./Admin/AdminPanel/AdminPanel";
import ManageBuildings from "./Admin/ManageBuildings/ManageBuildings";
import ApproveUsers from "./Admin/ApproveUsers/ApproveUsers";
import ManageUsers from "./Admin/ManageUsers/ManageUsers";
import SendNotice from "./Admin/SendNotice/SendNotice";
import DeletePost from "../components/DeletePost";
import Notifications from "./Notifications/Notifications";
import Announcements from "./Annoucements/Announcements";
import Notices from "./Notices/Notices";
import IndividualNotice from "./IndividualNotice/IndividualNotice";
import CustomSubStackScreenHeader from "./CustomSubStackScreenHeader.js";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ManageBuilding from "./Admin/ManageBuildings/ManageBuilding";
import ConfirmUser from "./Admin/ApproveUsers/ConfirmUser";
import ManageUser from "./Admin/ManageUsers/ManageUser";
import CreateAnnouncement from "./Admin/CreateAnnouncement/CreateAnnouncement";
import ScreenHeader from "../components/ScreenHeader";

const Stack = createStackNavigator();

const NewsfeedNavigator = () => {
  const { post, currentUser } = useAppContext();

  if (currentUser && currentUser.tenantAuthorized) {
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
          options={{
            title: `${post.userFirstName}'s Post`,
            headerRight: () => {
              if (
                currentUser.userDocId === post.userID ||
                currentUser.isAdmin
              ) {
                return <DeletePost />;
              }
            },
          }}
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
  const { post } = useAppContext();

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

      {/* Admin Pages */}

      <Stack.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Admin panel"} />
          ),
        }}
      />
      <Stack.Screen
        name="ApproveUsers"
        component={ApproveUsers}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Approve users"} />
          ),
        }}
      />
      <Stack.Screen
        name="ConfirmUser"
        component={ConfirmUser}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Confirm user"} />
          ),
        }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsers}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Manage users"} />
          ),
        }}
      />
      <Stack.Screen
        name="ManageUser"
        component={ManageUser}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Manage user"} />
          ),
        }}
      />
      <Stack.Screen
        name="CreateAnnouncement"
        component={CreateAnnouncement}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader
              {...props}
              title={"Create announcement"}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SendNotice"
        component={SendNotice}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Send notice"} />
          ),
        }}
      />
      <Stack.Screen
        name="ManageBuildings"
        component={ManageBuildings}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Manage buildings"} />
          ),
        }}
      />
      <Stack.Screen
        name="ManageBuilding"
        component={ManageBuilding}
        options={{
          header: (props) => (
            <CustomSubStackScreenHeader {...props} title={"Manage building"} />
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
    </Stack.Navigator>
  );
};

export { NewsfeedNavigator, ProfileNavigator, NotificationNavigator };
