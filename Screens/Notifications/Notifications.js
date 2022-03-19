import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const Notifications = () => {
	const { currentUser, setCurrentUser } = useAppContext();
	const [notifications, setNotifications] = useState([]);
	const colReference  = collection(db, "Users", `${currentUser.userDocId}`, "notifications");

	return (
		<SafeAreaView>
			<Text>Notifications</Text>
			<Text>{currentUser.userDocId}</Text>
		</SafeAreaView>
	);
};

export default Notifications;
