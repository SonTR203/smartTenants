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

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth();

const Stack = createStackNavigator();

var logged;

onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		//const uid = user.uid;
		logged = true;
		console.log(user.is)
		// ...
	} else {
		// User is signed out
		// ...
		logged = false
		console.log("user is signed out")
	}
});




const NewsfeedNavigator = () => {

	const { post, setPost } = useAppContext();
	const { currentUser, setCurrentUser } = useAppContext();

	if (currentUser && currentUser.tenantAuthorized, logged) {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Newsfeed"
					component={Newsfeed}
					options={{ title: 'Newsfeed', headerLeft: null, headerShown: false }}
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
				name="ProfileGeneral"
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
				component={MyPosts}
				options={{ title: "My Posts" }}
			/>
			<Stack.Screen
				name="BuildingInfo"
				component={BuildingInfo}
				options={{ title: 'Building Info' }}
			/>
		</Stack.Navigator>
	)
};


export { NewsfeedNavigator, ProfileNavigator }

