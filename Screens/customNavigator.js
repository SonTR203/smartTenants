//mix tab and stack navigators: https://www.youtube.com/watch?v=dkriklWelm0&t=139s

import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Newsfeed from './Newsfeed/Newsfeed'
import BuildingInfo from './BuildingInfo/BuildingInfo'
import CreatePost from './CreatePost/CreatePost'
import { useAppContext } from '../Context/AppContext'
import Login from './Login/Login'
import Signup from './Signup/Signup'
import AccountApprovalPending from './AccountApprovalPending/AccountApprovalPending'
import IndividualPosts from './IndividualPosts/IndividualPosts'
import EditProfile from './ProfilePage/EditProfile/EditProfile'
import MyPosts from './ProfilePage/MyPosts/MyPosts'
import ProfileGeneral from './ProfilePage/ProfileGeneral/ProfileGeneral'
import AdminPanel from './Admin/AdminPanel/AdminPanel'
import ManageBuildings from './Admin/ManageBuildings/ManageBuildings'
import ManageBuilding from './Admin/ManageBuildings/ManageBuilding'
import ApproveUsers from './Admin/ApproveUsers/ApproveUsers'
import ConfirmUser from './Admin/ApproveUsers/ConfirmUser'
import ManageUsers from './Admin/ManageUsers/ManageUsers'
import ManageUser from './Admin/ManageUsers/ManageUser'
import SendNotice from './Admin/SendNotice/SendNotice'
import DeletePost from '../components/DeletePost'
import CreateAnnouncement from './Admin/CreateAnnouncement/CreateAnnouncement'
import Notifications from './Notifications/Notifications'
import CustomSubStackScreenHeader from './CustomSubStackScreenHeader.js'

const Stack = createStackNavigator()

const NewsfeedNavigator = () => {
  const { post, setPost } = useAppContext()
  const { currentUser, setCurrentUser } = useAppContext()

  if (currentUser && currentUser.tenantAuthorized) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='Newsfeed'
          component={Newsfeed}
          options={{ headerLeft: null, headerShown: false }}
        />
        <Stack.Screen
          name='BuildingInfo'
          component={BuildingInfo}
          options={{
            header: props => (
              <CustomSubStackScreenHeader {...props} title={'Building Info'} />
            )
          }}
        />
        <Stack.Screen
          name='CreatePost'
          component={CreatePost}
          options={{
            header: props => (
              <CustomSubStackScreenHeader {...props} title={'Create post'} />
            )
          }}
        />
        <Stack.Screen
          name='IndividualPosts'
          component={IndividualPosts}
          options={{
            header: props => {
              if (
                currentUser.userDocId === post.userID ||
                currentUser.isAdmin
              ) {
                return (
                  <CustomSubStackScreenHeader
                    {...props}
                    title={`${post.userFirstName}'s Post`}
                    headerFunc={<DeletePost />}
                  />
                )
              } else {
                return (
                  <CustomSubStackScreenHeader
                    {...props}
                    title={`${post.userFirstName}'s Post`}
                  />
                )
              }
            }
          }}
        />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Signup'
          component={Signup}
          options={{
            header: props => (
              <CustomSubStackScreenHeader {...props} title={'Sign up'} />
            )
          }}
        />
        <Stack.Screen
          name='AccountApprovalPending'
          component={AccountApprovalPending}
          options={{
            header: props => (
              <CustomSubStackScreenHeader {...props} title={' '} />
            )
          }}
        />
      </Stack.Navigator>
    )
  }
}

const ProfileNavigator = () => {
  const { post, setPost } = useAppContext()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ProfileGeneral'
        component={ProfileGeneral}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen
        name='EditProfile'
        component={EditProfile}
        options={{
          header: props => (
            <CustomSubStackScreenHeader {...props} title={'Edit profile'} />
          )
        }}
      />
      <Stack.Screen
        name='MyPosts'
        component={MyPosts}
        options={{
          header: props => (
            <CustomSubStackScreenHeader {...props} title={'My posts'} />
          )
        }}
      />
      <Stack.Screen
        name='IndividualPosts'
        component={IndividualPosts}
        options={{
          header: props => (
            <CustomSubStackScreenHeader
              {...props}
              title={`${post.userFirstName}'s Post`}
            />
          )
        }}
      />
      <Stack.Screen
        name='Login'
        component={Login}
        options={{ title: 'Login', headerLeft: null }}
      />
      <Stack.Screen
        name='BuildingInfo'
        component={BuildingInfo}
        options={{
          header: props => (
            <CustomSubStackScreenHeader {...props} title={'Building Info'} />
          )
        }}
      />

      {/* Admin Pages */}

      <Stack.Screen
        name='AdminPanel'
        component={AdminPanel}
        options={{ title: 'Admin Panel' }}
      />
      <Stack.Screen
        name='ApproveUsers'
        component={ApproveUsers}
        options={{ title: 'Approve Users' }}
      />
      <Stack.Screen
        name='ConfirmUser'
        component={ConfirmUser}
        options={{ title: 'Confirm User' }}
      />
      <Stack.Screen
        name='ManageUsers'
        component={ManageUsers}
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen
        name='ManageUser'
        component={ManageUser}
        options={{ title: 'Manage User' }}
      />
      <Stack.Screen
        name='CreateAnnouncement'
        component={CreateAnnouncement}
        options={{ title: 'Create Announcement' }}
      />
      <Stack.Screen
        name='SendNotice'
        component={SendNotice}
        options={{ title: 'Send Notice' }}
      />
      <Stack.Screen
        name='ManageBuildings'
        component={ManageBuildings}
        options={{ title: 'Manage Buildings' }}
      />
      <Stack.Screen
        name='ManageBuilding'
        component={ManageBuilding}
        options={{ title: 'Manage Building' }}
      />
    </Stack.Navigator>
  )
}

const NotificationNavigator = () => {
  const { post, setPost } = useAppContext()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Notifications'
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='IndividualPosts'
        component={IndividualPosts}
        options={{
          header: props => (
            <CustomSubStackScreenHeader
              {...props}
              title={`${post.userFirstName}'s Post`}
            />
          )
        }}
      />
      <Stack.Screen
        name='BuildingInfo'
        component={BuildingInfo}
        options={{
          header: props => (
            <CustomSubStackScreenHeader {...props} title={'Building Info'} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

export { NewsfeedNavigator, ProfileNavigator, NotificationNavigator }
