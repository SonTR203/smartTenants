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

const Stack = createStackNavigator()

//for admin pages where we need to go 3 or four levels deep, we should be able to add the screens to the main stack and call them from anywhere within the stack
//hypothetically

const NewsfeedNavigator = () => {
  const { post, setPost } = useAppContext()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={Login}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name='Signup'
        component={Signup}
        options={{ title: 'Signup' }}
      />
      <Stack.Screen
        name='AccountApprovalPending'
        component={AccountApprovalPending}
        options={{ title: 'Account Approval Pending' }}
      />
      <Stack.Screen
        name='Newsfeed'
        component={Newsfeed}
        options={{ title: 'Newsfeed', headerLeft: null, headerShown: false }}
      />
      <Stack.Screen
        name='BuildingInfo'
        component={BuildingInfo}
        options={{ title: 'Building Info' }}
      />
      <Stack.Screen
        name='CreatePost'
        component={CreatePost}
        options={{ title: 'Create Post' }}
      />
      <Stack.Screen
        name='IndividualPosts'
        component={IndividualPosts}
        options={{ title: `${post.userFirstName}'s Post` }}
      />
    </Stack.Navigator>
  )
}

export { NewsfeedNavigator }
