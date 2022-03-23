//mix tab and stack navigators: https://www.youtube.com/watch?v=dkriklWelm0&t=139s

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Newsfeed from './Newsfeed/Newsfeed';
import BuildingInfo from './BuildingInfo/BuildingInfo';
import CreatePost from './CreatePost/CreatePost';
import { useAppContext } from '../Context/AppContext';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import AccountApprovalPending from './AccountApprovalPending/AccountApprovalPending';
import IndividualPosts from './IndividualPosts/IndividualPosts';
import EditProfile from './ProfilePage/EditProfile/EditProfile'
import MyPosts from './ProfilePage/MyPosts/MyPosts'
import ProfileGeneral from './ProfilePage/ProfileGeneral/ProfileGeneral';
//import Notifications from './Notifications/Notifications';

const Stack = createStackNavigator();

const NewsfeedNavigator = () => {
	const { post, setPost } = useAppContext();
	const { currentUser, setCurrentUser } = useAppContext();

	if (currentUser && currentUser.tenantAuthorized) {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Newsfeed"
					component={Newsfeed}
					options={{ title: 'Newsfeed', headerLeft: null }}
				/>
				<Stack.Screen
					name="BuildingInfo"
					component={BuildingInfo}
					options={{ title: 'Building Info' }}
				/>
				<Stack.Screen
					name="CreatePost"
					component={CreatePost}
					options={{ title: 'Create Post' }}
				/>
				<Stack.Screen
					name="IndividualPosts"
					component={IndividualPosts}
					options={{ title: `${post.userFirstName}'s Post` }}
				/>
			</Stack.Navigator>
		)
	} else {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{ title: 'Login' }}
				/>
				<Stack.Screen
					name="Signup"
					component={Signup}
					options={{ title: 'Signup' }}
				/>
				<Stack.Screen
					name="AccountApprovalPending"
					component={AccountApprovalPending}
					options={{ title: 'Account Approval Pending' }}
				/>
			</Stack.Navigator>
		);
	}
};


const ProfileNavigator = () => {

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Profile"
				component={ProfileGeneral}
				options={{ title: 'Profile' }}
			/>
			<Stack.Screen
				name="EditProfile"
				component={EditProfile}
				options={{ title: "Edit Profile" }}
			/>
			<Stack.Screen
				name="MyPosts"
				component={IndividualPosts}
				options={{ title: "My Posts" }}
			/>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{ title: "Login" }}
			/>

		</Stack.Navigator>
	)
};

export { NewsfeedNavigator, ProfileNavigator }
