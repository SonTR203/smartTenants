import {
	View,
	Text,
	Pressable,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Image,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../../firebase-config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import { useAppContext } from '../../Context/AppContext';

//Get info about who is currently logged in, get user info
//loop through all and show posts with only that building ID in flatlist

let globalPost;
let setGlobalPost;

const Newsfeed = ({ navigation }) => {
	const [posts, setPosts] = useState([]);
	const { post, setPost } = useAppContext();
	const colRef = collection(db, 'Newsfeed');
	const [refreshing, setRefreshing] = useState(true);

	globalPost = post;
	setGlobalPost = setPost;

	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = async () => {
		const data = await getDocs(colRef);
		setPosts(
			data.docs.map((item) => ({
				...item._document.data.value.mapValue.fields,
				id: item._key.path.segments[6],
			}))
		);
		setRefreshing(false);
	};

	return (
		<>
			{refreshing ? <ActivityIndicator /> : null}

			<Pressable
				onPress={() => {
					navigation.navigate('BuildingInfo');
				}}
			>
				<Text>Building Info</Text>
			</Pressable>

			{posts.length > 0 && (
				<FlatList
					data={posts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Post posts={item} navigation={navigation} />
					)}
					refreshControl={
						<RefreshControl onRefresh={getPosts} refreshing={refreshing} />
					}
				/>
			)}

			{posts.length < 1 && (
				<View>
					<Text>no items to show</Text>
				</View>
			)}

			<FAB
				medium
				icon="plus"
				onPress={() => {
					navigation.navigate('CreatePost');
				}}
				style={{ position: 'absolute', margin: 10, right: 0, bottom: 10 }}
			/>
		</>
	);
};

//============================== Individual Post Cards ==========================
function Post({ posts, navigation }) {
	posts = {
		comments: posts.comments.arrayValue,
		id: posts.id,
		image: posts.images.arrayValue.values[0].stringValue,
		peopleWhoLiked: posts.peopleWhoLiked.arrayValue,
		postContent: posts.postContent.stringValue,
		userID: posts.UserId,
		userProfileImage: posts.userProfileImage.stringValue,
		userFirstName: posts.userFirstName.stringValue,
		userLastName: posts.userLastName.stringValue,
	};

	return (
		<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
			<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
				<Image
					source={{ uri: `${posts.userProfileImage}` }}
					style={{ width: 25, height: 25, borderRadius: 50 }}
				/>
				<Text style={{ marginTop: 3, marginLeft: 5 }}>
					{posts.userFirstName} {posts.userLastName}
				</Text>
			</View>

			<TouchableOpacity
				onPress={() => {
					navigation.navigate('IndividualPosts');
					setGlobalPost(posts);
				}}
			>
				<View className="postTextContent" style={{ margin: 10 }}>
					<Text>{posts.postContent}</Text>
				</View>

				{posts.image != 'no image posted' && (
					<Image
						source={{
							uri: `${posts.image}`,
						}}
						style={{ width: 330, height: 300 }}
					/>
				)}
			</TouchableOpacity>

			<View
				className="likeAndComment"
				style={{ display: 'flex', flexDirection: 'row' }}
			>
				<TouchableOpacity
					onPress={() => {
						console.log('like');
					}}
				>
					<Text>Like</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('IndividualPosts');
						setGlobalPost(posts);
					}}
				>
					<Text>Comment</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default Newsfeed;
