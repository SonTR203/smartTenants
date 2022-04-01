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
import EditProfile from './ProfilePage/EditProfile/EditProfile';
import MyPosts from './ProfilePage/MyPosts/MyPosts';
import ProfileGeneral from './ProfilePage/ProfileGeneral/ProfileGeneral';
import CustomSubStackScreenHeader from './CustomSubStackScreenHeader.js';
import AdminPanel from './Admin/AdminPanel/AdminPanel';
import ManageBuildings from './Admin/ManageBuildings/ManageBuildings';
import ApproveUsers from './Admin/ApproveUsers/ApproveUsers';
import ManageUsers from './Admin/ManageUsers/ManageUsers';
import SendNotice from './Admin/SendNotice/SendNotice';
import DeletePost from '../components/DeletePost';
import Notifications from './Notifications/Notifications';

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
					options={{ title: 'Newsfeed', headerLeft: null, headerShown: false }}
				/>
				<Stack.Screen
					name="BuildingInfo"
					component={BuildingInfo}
					options={{
						header: (props) => (
							<CustomSubStackScreenHeader {...props} title={'Building Info'} />
						),
					}}
				/>
				<Stack.Screen
					name="CreatePost"
					component={CreatePost}
					options={{
						header: (props) => (
							<CustomSubStackScreenHeader {...props} title={'Create post'} />
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
	const { post, setPost } = useAppContext();

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
				options={{ title: 'Edit Profile' }}
			/>
			<Stack.Screen
				name="MyPosts"
				component={MyPosts}
				options={{ title: 'My Posts' }}
			/>
			<Stack.Screen
				name="IndividualPosts"
				component={IndividualPosts}
				options={{ title: `${post.userFirstName}'s Post` }}
			/>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{ title: 'Login', headerLeft: null }}
			/>
			<Stack.Screen
				name="BuildingInfo"
				component={BuildingInfo}
				options={{ title: 'Building Info' }}
			/>

			{/* Admin Pages */}

			<Stack.Screen
				name="AdminPanel"
				component={AdminPanel}
				options={{ title: 'Admin Panel' }}
			/>
			<Stack.Screen
				name="ApproveUsers"
				component={ApproveUsers}
				options={{ title: 'Approve Users' }}
			/>
			<Stack.Screen
				name="ManageUsers"
				component={ManageUsers}
				options={{ title: 'Manage Users' }}
			/>
			<Stack.Screen
				name="SendNotice"
				component={SendNotice}
				options={{ title: 'Send Notice' }}
			/>
			<Stack.Screen
				name="ManageBuildings"
				component={ManageBuildings}
				options={{ title: 'Manage Buildings' }}
			/>
		</Stack.Navigator>
	);
};

const NotificationNavigator = () => {
	const { post, setPost } = useAppContext();

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Notifications"
				component={Notifications}
				options={{ title: 'Notifications' }}
			/>
			<Stack.Screen
				name="IndividualPosts"
				component={IndividualPosts}
				options={{ title: `${post.userFirstName}'s Post` }}
			/>
		</Stack.Navigator>
	);
};

export { NewsfeedNavigator, ProfileNavigator, NotificationNavigator };
