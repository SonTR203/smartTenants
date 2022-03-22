import { View, Text } from 'react-native';
import React from 'react';
import { useAppContext } from '../../../Context/AppContext';

const ProfileGeneral = () => {
	const { currentUser, setCurrentUser } = useAppContext();
	console.log(currentUser);

	//the user document id is: currentUser.userDocId

	return (
		<View>
			<Text>ProfileGeneral</Text>
			<Text>{currentUser.userDocId}</Text>
		</View>
		
	);
};

export default ProfileGeneral;
