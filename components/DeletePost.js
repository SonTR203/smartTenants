import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAppContext } from '../Context/AppContext';

import { Alert, Button } from 'react-native';
const DeletePost = () => {
	const { post, setPost } = useAppContext();

	const optionsAlert = () => {
		console.log('Displaying Alert for options');

		Alert.alert('Delete Post', 'This will permanently delete your post', [
			{
				text: 'Delete',
				onPress: deletePost,
				style: 'cancel',
			},
			{
				text: 'Cancel',
				onPress: () => console.log('Cancelled delete post'),
			},
		]);
	};

	const deletePost = async () => {
		const singleDoc = doc(db, 'Newsfeed', post.id);
		await deleteDoc(singleDoc);
	};

	return <Button title="options" onPress={optionsAlert} />;
};

export default DeletePost;
