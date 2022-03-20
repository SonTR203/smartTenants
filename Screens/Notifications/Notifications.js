import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Item = ({ content }) => (
	<View>
		<Text>{content}</Text>
	</View>
);

const Notifications = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const [notifications, setNotifications] = useState([]);
	const colReference = collection(
		db,
		'Users',
		`${currentUser.userDocId}`,
		'Notifications'
	);

	useEffect(() => {
		getDocs(colReference)
			.then((snapshot) => {
				let notificationList = [];
				snapshot.docs.forEach((doc) => {
					notificationList.push({ ...doc.data(), id: doc.id });
				});
				setNotifications(notificationList);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, []);

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
	console.log(notifications);
	return (
		// navigate to post page on press
		<TouchableOpacity>
			<Text>{notifications.content}</Text>
		</TouchableOpacity>
	);
}

export default Notifications;
