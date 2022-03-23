//mix tab and stack navigators: https://www.youtube.com/watch?v=dkriklWelm0&t=139s

import React from 'react';
import { Button , Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Newsfeed from './Newsfeed/Newsfeed';
import BuildingInfo from './BuildingInfo/BuildingInfo';
import CreatePost from './CreatePost/CreatePost';
import { useAppContext } from '../Context/AppContext';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import AccountApprovalPending from './AccountApprovalPending/AccountApprovalPending';
import IndividualPosts from './IndividualPosts/IndividualPosts';


import { deleteDoc, doc} from 'firebase/firestore';

import { db } from '../firebase-config';

const Stack = createStackNavigator();

const NewsfeedNavigator = () => {
	const { post, setPost } = useAppContext();
	const { currentUser, setCurrentUser } = useAppContext();


console.log(post.id);

	const optionsAlert = () =>{

	console.log("Displaying Alert for options");

Alert.alert('title', 'My Alert Msg', [
	{
		text: 'Delete',
		onPress: deletePost,
		style: 'cancel',
	},
	{
		text: 'Turn off Notifications',
		onPress: () => console.log('Turn off Notifications Pressed'),
	},
]);  
	}

	const deletePost = async () => {
		const singleDoc = doc(db, 'Newsfeed', post.id);
		await deleteDoc(singleDoc);
	};

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
					options={{
						title: `${post.userFirstName}'s Post`,
						headerRight: () => {
							if (currentUser.userDocId === post.userID || currentUser.isAdmin) {
								return <Button title="options" onPress={optionsAlert} />;
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

export { NewsfeedNavigator };
