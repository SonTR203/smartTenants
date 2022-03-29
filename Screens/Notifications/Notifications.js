import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import _ from 'lodash';

let notificationCount;
let setNotifPost;

const Notifications = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { post, setPost } = useAppContext();
	const [notifications, setNotifications] = useState([]);
	notificationCount = notifications.length;
	setNotifPost = setPost;

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
	return (
		// navigate to post page on press
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('IndividualPosts');
				viewNotificationPost(notifications);
			}}
		>
			<Text>{notifications.content}</Text>
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
