import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAppContext } from '../Context/AppContext';

import {

	Alert,
	Button,
} from 'react-native';
const deletePost = () => {
	const { post, setPost } = useAppContext();

	const optionsAlert = () => {
		console.log('Displaying Alert for options');

		Alert.alert('title', 'My Alert Msg', [
			{
				text: 'Delete',
				onPress:deletePost ,
				style: 'cancel',
			},
			{
				text: 'Turn off Notifications',
				onPress: () => console.log('Turn off Notifications Pressed'),
			},
		]);
	};

	const deletePost = async () => {
		const singleDoc = doc(db, 'Newsfeed', post.id);
		await deleteDoc(singleDoc);
		
	};

	return <Button title="options" onPress={optionsAlert} />;
};

export default deletePost;
