import {
	View,
	Text,
	Pressable,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../../firebase-config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';

//Get info about who is currently logged in, get user info
//loop through all and show posts with only that building ID in flatlist

const Newsfeed = ({ navigation }) => {
	const [posts, setPosts] = useState([]);
	const colRef = collection(db, 'Newsfeed');
	const [refreshing, setRefreshing] = useState(true);

	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = async () => {
		const data = await getDocs(colRef);
		console.log('DATA.DOCS', data.docs);
		setPosts(
			data.docs.map((item) => ({
				...item._document.data.value.mapValue.fields,
				id: item._key.path.segments[6],
			}))
		);
		setRefreshing(false);
	};
	console.log(posts);

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
	return (
		<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
			<View className="postOwnerInfo"></View>

			<TouchableOpacity
				onPress={() => {
					navigation.navigate('IndividualPosts');
				}}
			>
				<View className="postTextContent" style={{ margin: 10 }}>
					<Text>{posts.postContent.stringValue}</Text>
				</View>

				{posts.images.arrayValue.values[0].stringValue != 'no image posted' && (
					<Image
						source={{ uri: `${posts.images.arrayValue.values[0].stringValue}` }}
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
					}}
				>
					<Text>Comment</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default Newsfeed;
