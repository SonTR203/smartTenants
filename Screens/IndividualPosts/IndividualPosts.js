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
import React, { useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { db } from '../../firebase-config';
import { collection, getDocs, deleteDoc, addDoc } from '@firebase/firestore';
import { Component } from 'react/cjs/react.production.min';

const IndividualPosts = ({ route, navigation }) => {
	const { post } = useAppContext();
	const { currentUser } = useAppContext();

	const [likes, setLikes] = useState();
	const [textInputValue, setTextInputValue] = useState('');

	let data = [
		{ name: 'ben', image: 'url', comment: 'This is the best post' },
		{ name: 'ken', image: 'url', comment: 'This is the best post' },
		{ name: 'shen', image: 'url', comment: 'This is the best post' },
		{ name: 'ten', image: 'url', comment: 'This is the best post' },
	];

	const Comment = ({ item }) => (
		<View>
			<Text>{item.name} </Text>
			<Text>{item.comment} </Text>
		</View>
	);

	const renderItem = ({ item }) => <Comment item={item} />;

	const postComment = async () => {
		const peopleWhoCommentedColRef = collection(
			db,
			`Newsfeed/${post.id}/peopleWhoCommented`
		);

		try {
			await addDoc(peopleWhoCommentedColRef, {
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

	// Todo: get likes count

	console.log(textInputValue);

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
				<FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={(item) => item.name}
				/>
			</View>

			<View>
				<TextInput
					placeholder="say something"
					onChangeText={(text) => setTextInputValue(text)}
					value={textInputValue}
				/>

				<Button title="comment" onPress={postComment}></Button>
			</View>
		</View>
	);
};

export default IndividualPosts;
