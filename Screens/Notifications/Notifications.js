import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import {
	collection,
	getDocs,
	getDoc,
	doc,
	updateDoc,
} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import _ from 'lodash';

let notificationCount;
let setNotifPost;
let globalCurrentUser;

const Notifications = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { post, setPost } = useAppContext();
	const [notifications, setNotifications] = useState([]);
	notificationCount = notifications.length;
	setNotifPost = setPost;
	globalCurrentUser = currentUser;

	const colReference = collection(
		db,
		'Users',
		`${currentUser.userDocId}`,
		'Notifications'
	);
	let notificationList = [];

	getDocs(colReference).then((snapshot) => {
		snapshot.docs.forEach((doc) => {
			notificationList.push({ ...doc.data(), id: doc.id });
		});
		let sortedNotificationList = _.sortBy(
			notificationList,
			'timestamp'
		).reverse();
		setNotifications(sortedNotificationList);
	});

	return (
		<SafeAreaView>
			<Text>Notifications</Text>
			{notifications.length > 0 && (
				<FlatList
					data={notifications}
					renderItem={({ item }) => (
						<NotificationItem notifications={item} navigation={navigation} />
					)}
					keyExtractor={(item) => item.id}
				/>
			)}
		</SafeAreaView>
	);
};

function NotificationItem({ notifications, navigation }) {
	const setWasSeenToTrue = async (notifications) => {
		const colRef = doc(
			db,
			'Users',
			`${globalCurrentUser.userDocId}`,
			'Notifications',
			notifications.id
		);
		await updateDoc(colRef, {
			wasSeen: true,
		});
	};
	return (
		// navigate to post page on press
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('IndividualPosts');
				viewNotificationPost(notifications);
				setWasSeenToTrue(notifications);
			}}
			style={{ display: 'flex', flexDirection: 'row' }}
		>
			<Text>{notifications.content}</Text>
			{notifications.wasSeen == false && <Text>*unread*</Text>}
		</TouchableOpacity>
	);
}

async function viewNotificationPost(notifications) {
	const docRef = doc(db, 'Newsfeed', `${notifications.postID}`);
	const docSnap = await getDoc(docRef);
	let postData = docSnap.data();
	const likesColReference = collection(
		db,
		'Newsfeed',
		`${docSnap.id}`,
		'peopleWhoLiked'
	);
	const data = await getDocs(likesColReference);
	let numberOfLikes = data.docs.length;

	let post = {
		comments: postData.comments.arrayValue,
		id: docSnap.id,
		image: postData.images,
		peopleWhoLiked: postData.peopleWhoLiked,
		postContent: postData.postContent,
		userID: postData.userID,
		userProfileImage: postData.userProfileImage,
		userFirstName: postData.userFirstName,
		userLastName: postData.userLastName,
		numberOfLikes: numberOfLikes,
		timestamp: postData.timestamp,
	};

	if (docSnap.exists()) {
		setNotifPost(post);
	} else {
		// doc.data() will be undefined in this case
		console.log('No such document!');
	}
}

export default Notifications;
