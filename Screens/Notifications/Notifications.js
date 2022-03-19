import { View, Text } from 'react-native';
import { React, useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';

const Notifications = () => {
	const { currentUser, setCurrentUser } = useAppContext();
	console.log(currentUser);

	//the user document id is: currentUser.userDocId

	return (
		<View>
			<Text>Notifications</Text>
			<Text>{currentUser.userDocId}</Text>
		</View>
	);
};

export default Notifications;
