import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';

const Notifications = () => {
	const { currentUser, setCurrentUser } = useAppContext();
	console.log(currentUser);

	//the user document id is: currentUser.userDocId

	return (
		<SafeAreaView>
			<Text>Notifications</Text>
			<Text>{currentUser.userDocId}</Text>
		</SafeAreaView>
	);
};

export default Notifications;
