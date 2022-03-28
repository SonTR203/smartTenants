import {
	View,
	Text,
	ActivityIndicator,
	Image,
	Alert,
	Button,
	FlatList,
	TextInput,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import { collection, getDocs, deleteDoc, addDoc } from '@firebase/firestore';
import { Component } from 'react/cjs/react.production.min';

const IndividualPosts = ({ route, navigation }) => {
	const { post } = useAppContext();
	const { currentUser } = useAppContext();

	const [textInputValue, setTextInputValue] = useState('');

	const [comments, setComments] = useState([]);

	// Get all Comments
	const getComments = () => {
		console.log('fetching all comments');
		 let id = '5w4FRE3tKt45t5tMcUEc';
		// Create Comments collection Reference

		// Need to replace id to post.id
		const colRef = collection(
			db,
			`/Newsfeed/${post.id}/peopleWhoCommented`
		);

		// Get collections data
		getDocs(colRef).then((snapshot) => {
			let commentsArray = [];
			snapshot.docs.forEach((doc) => {
				commentsArray.push({ ...doc.data(), id: doc.id });
			});
			setComments(commentsArray);
		});
	};

	console.log(post.id)

	// execute function
	useEffect(() => {
		getComments();
	}, [post.id]);

	//  render comment structure
	const renderItem = ({ item }) => {
		return (
			<View>
				<View>
					<Image src={item.userProfileImage}></Image>
					<Text>
						{item.firstName}
						{item.lastName}{' '}
					</Text>
				</View>

				<View>
					<Text>{item.commentContent}</Text>
				</View>
			</View>
		);
	};

	// Post Comments
	const postComment = () => {
		const peopleWhoCommentedColRef = collection(
			db,
			`Newsfeed/${post.id}/peopleWhoCommented`
		);

		if (!textInputValue) return;

		try {
			addDoc(peopleWhoCommentedColRef, {
				firstName: currentUser.firstName,
				lastName: currentUser.lastName,
				userProfileImage: currentUser.userProfileImage,
				commentContent: textInputValue,
				postUserID: post.userID,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
			<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
				{/* post owner info */}

				<Image
					source={{ uri: `${post.userProfileImage}` }}
					style={{ width: 25, height: 25, borderRadius: 50 }}
				/>
				<Text style={{ marginTop: 3, marginLeft: 5 }}>
					{post.userFirstName} {post.userLastName}
				</Text>
			</View>

			{/* post content */}

			<View className="postTextContent" style={{ margin: 10 }}>
				<Text>{post.postContent}</Text>
				{post.image != 'no image posted' && (
					<Image
						source={{
							uri: `${post.image}`,
						}}
						style={{ width: 330, height: 300 }}
					/>
				)}

				<Text> Liked by {}</Text>
			</View>

			{/* post comments */}

			<View>
				<Text>Comments</Text>
				<FlatList
					data={comments}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<View>
				<TextInput
					placeholder="say something"
					onChangeText={(text) => setTextInputValue(text)}
					value={textInputValue}
				/>
				{/* disable button class if no text input for comments */}

				<Button title="comment" onPress={postComment}></Button>
			</View>
		</View>
	);
};

export default IndividualPosts;
