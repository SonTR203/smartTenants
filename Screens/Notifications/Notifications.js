import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const Notifications = () => {
	const { currentUser, setCurrentUser } = useAppContext();
	const [notifications, setNotifications] = useState([]);
	const colReference  = collection(db, "Users", `${currentUser.userDocId}`, "Notifications");

	useEffect(() => {
		getDocs(colReference)
		.then(snapshot => {
		  let notificationList = []
		  snapshot.docs.forEach(doc => {
			notificationList.push({ ...doc.data(), id: doc.id })
		  })
		  setNotifications(notificationList);
		})
		.catch(err => {
		  console.log(err.message)
		});
	},[]);

	return (
		<SafeAreaView>
			<Text>Notifications</Text>
			<FlatList
       		data={notifications}
       		renderItem={(notif) => (
         	<Text>{notif.item.content}</Text>
       		)}
       		keyExtractor={item => item.id}
     		/>
		</SafeAreaView>
	);
};

export default Notifications;
