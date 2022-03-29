import {
	View,
	Text,
	Pressable,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Image,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, deleteDoc, addDoc } from '@firebase/firestore';
import { db } from '../../firebase-config';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import _ from 'lodash';
const windowWidth = Dimensions.get('window').width;

let globalPost;
let setGlobalPost;
let globalCurrentUser;

const Newsfeed = ({ navigation }) => {
	const [theme, styleVariables] = useTheme();
	const [posts, setPosts] = useState([]);
	const { post, setPost } = useAppContext();
	const { currentUser, setCurrentUser } = useAppContext();
	const colRef = collection(db, 'Newsfeed');
	const [refreshing, setRefreshing] = useState(true);

	globalPost = post;
	setGlobalPost = setPost;
	globalCurrentUser = currentUser;

	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = async () => {
		const data = await getDocs(colRef);
		let listOfPosts = data.docs.map((item) => ({
			...item._document.data.value.mapValue.fields,
			id: item._key.path.segments[6],
		}));
		let sortedListOfPosts = _.sortBy(
			listOfPosts,
			'timestamp.integerValue'
		).reverse();
		setPosts(sortedListOfPosts);

		setRefreshing(false);
	};

	let comparePosts = (a, b) => {
		if (a.timestamp < b.timestamp) {
			return -1;
		}
		if (a.timestamp > b.timestamp) {
			return 1;
		}
		return 0;
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
			edges={['top']}
		>
			<StatusBar style="auto" />
			<View style={theme.pageContainer}>
				{refreshing ? <ActivityIndicator /> : null}

				{posts.length > 0 && (
					<FlatList
						ListHeaderComponent={
							<ListHeader
								navigation={navigation}
								styleVariables={styleVariables}
								theme={theme}
							/>
						}
						data={posts}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<Post
								posts={item}
								navigation={navigation}
								theme={theme}
								styleVariables={styleVariables}
								windowWidth={windowWidth}
							/>
						)}
						refreshControl={
							<RefreshControl
								onRefresh={getPosts}
								refreshing={refreshing}
								style={{ backgroundColor: styleVariables.colors.primary }}
								tintColor={'white'}
							/>
						}
						ListFooterComponent={
							<ListFooter styleVariables={styleVariables} theme={theme} />
						}
					/>
				)}

				{posts.length < 1 && (
					<View>
						<Text>no items to show</Text>
					</View>
				)}

				{/* FAB */}
				<Pressable
					id="FAB"
					onPress={() => {
						navigation.navigate('CreatePost');
					}}
					style={theme.fab}
				>
					<MaterialCommunityIcons
						name="plus"
						size={24}
						color={styleVariables.colors.white}
					/>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

//============================== Individual Post Cards ==========================
function Post({ posts, navigation, theme, styleVariables, windowWidth }) {
	const [numberOfLikes, setNumberOfLikes] = useState(0);
	posts = {
		comments: posts.comments.arrayValue,
		id: posts.id,
		image: posts.images.arrayValue.values[0].stringValue,
		peopleWhoLiked: posts.peopleWhoLiked.arrayValue,
		postContent: posts.postContent.stringValue,
		userID: posts.userID.stringValue,
		userProfileImage: posts.userProfileImage.stringValue,
		userFirstName: posts.userFirstName.stringValue,
		userLastName: posts.userLastName.stringValue,
		numberOfLikes: numberOfLikes,
	};

	const getLikes = async () => {
		const likesColReference = collection(
			db,
			'Newsfeed',
			`${posts.id}`,
			'peopleWhoLiked'
		);

		const data = await getDocs(likesColReference);
		setNumberOfLikes(data.docs.length);
	};
	getLikes();

	const likePost = async () => {
		const notificationColRef = collection(
			db,
			`Users/${posts.userID}/Notifications`
		);
		const peopleWhoLikedColRef = collection(
			db,
			`Newsfeed/${posts.id}/peopleWhoLiked`
		);

		try {
			await addDoc(notificationColRef, {
				content: `${globalCurrentUser.firstName} ${globalCurrentUser.lastName} liked your post.`,
				notificationID: 2,
				postID: posts.id,
				userID: posts.userID,
				wasSeen: false,
			});
		} catch (error) {
			console.log(error);
		}

		try {
			await addDoc(peopleWhoLikedColRef, {
				firstName: globalCurrentUser.firstName,
				lastName: globalCurrentUser.lastName,
				postID: posts.id,
				userID: posts.userID,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View id="post" style={theme.cardContainer}>
			{/* ownerInfo */}
			<View
				id="ownerInfo"
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: '100%',
					marginBottom: 12,
				}}
			>
				<View
					className="ownerImageAndName"
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Image
						source={{ uri: `${posts.userProfileImage}` }}
						style={{ height: 43, width: 43, borderRadius: 12 }}
					/>
					<Text
						style={[
							styleVariables.fontSizes.bodyBold,
							{ color: styleVariables.colors.black, marginLeft: 8 },
						]}
					>
						{posts.userFirstName} {posts.userLastName}
					</Text>
				</View>
				<Text
					id="timePosted"
					style={[
						styleVariables.fontSizes.callout,
						{ color: styleVariables.colors.black, opacity: 0.66 },
					]}
				>
					30m
				</Text>
			</View>

			{/* postContent */}
			<TouchableOpacity
				id="postContent"
				onPress={() => {
					navigation.navigate('IndividualPosts');
					setGlobalPost(posts);
				}}
			>
				<View className="postTextContent">
					<Text
						style={[
							styleVariables.fontSizes.body,
							{ color: styleVariables.colors.black, marginBottom: 17 },
						]}
					>
						{posts.postContent}
					</Text>
				</View>

				{posts.image != 'no image posted' && (
					<Image
						source={{
							uri: `${posts.image}`,
						}}
						style={{
							height: windowWidth - 68,
							width: windowWidth - 68,
							borderRadius: 16,
							marginBottom: 17,
						}}
					/>
				)}
			</TouchableOpacity>

			{/* likeAndComment */}
			<View
				className="likeAndComment"
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					marginBottom: 5,
				}}
			>
				{/* =========================== LIKE ============================= */}
				<TouchableOpacity
					id="like"
					onPress={likePost}
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
					}}
				>
					<MaterialCommunityIcons
						name="heart-outline"
						size={24}
						color={styleVariables.colors.black}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={[
							styleVariables.fontSizes.body,
							{ color: styleVariables.colors.black },
						]}
					>
						{numberOfLikes}
					</Text>
				</TouchableOpacity>

				{/* =========================== COMMENT ============================= */}
				<TouchableOpacity
					id="comment"
					onPress={() => {
						navigation.navigate('IndividualPosts');
						setGlobalPost(posts);
					}}
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
						marginLeft: 17,
					}}
				>
					<MaterialCommunityIcons
						name="message-outline"
						size={24}
						color={styleVariables.colors.black}
						style={{ marginRight: 8 }}
					/>
					<Text
						style={[
							styleVariables.fontSizes.body,
							{ color: styleVariables.colors.black },
						]}
					>
						8
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function ListHeader({ navigation, styleVariables, theme }) {
	return (
		<>
			<View id="header" style={theme.header}>
				{/* headerPageTitle */}
				<Text
					id="headerPageTitle"
					style={[
						styleVariables.fontSizes.header,
						{
							color: styleVariables.colors.white,
							marginBottom: 4,
						},
					]}
				>
					Newsfeed
				</Text>
				{/* buildingInfo */}
				<Pressable
					id="buildingInfo"
					onPress={() => {
						navigation.navigate('BuildingInfo');
					}}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						opacity: 0.66,
					}}
				>
					<Text
						style={[
							styleVariables.fontSizes.body,
							{ color: styleVariables.colors.white },
						]}
					>
						Building Info
					</Text>
					<MaterialCommunityIcons
						name="chevron-right"
						size={24}
						color={styleVariables.colors.white}
					/>
				</Pressable>
			</View>

			{/* announcements */}
			<View style={theme.firstListItem}>
				<View id="topCard" style={theme.topCard}>
					<Pressable
						id="announcements"
						onPress={() => {
							alert('navigate to announcements (not yet implemented)');
						}}
						style={theme.cardButton}
					>
						<Text
							style={[
								styleVariables.fontSizes.title,
								{ color: styleVariables.colors.primary },
							]}
						>
							Announcements
						</Text>
						<View id="counter" style={theme.counter}>
							<Text
								id="notificationCounter"
								style={[
									theme.notificationCounter,
									styleVariables.fontSizes.callout,
									{ color: styleVariables.colors.white },
								]}
							>
								99+
							</Text>
							<MaterialCommunityIcons
								name="chevron-right"
								size={24}
								color={styleVariables.colors.primary}
							/>
						</View>
					</Pressable>
				</View>
			</View>
		</>
	);
}

function ListFooter({ theme, styleVariables }) {
	return (
		<View
			style={{
				height: 204,
				paddingVertical: 17,
				paddingHorizontal: 34,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text
				style={[
					styleVariables.fontSizes.callout,
					{
						color: styleVariables.colors.black,
						opacity: 0.66,
						paddingBottom: 8,
					},
				]}
			>
				Oh oh! Seems like you've reached the end.
			</Text>
			<Text
				style={[
					styleVariables.fontSizes.callout,
					{
						color: styleVariables.colors.black,
						opacity: 0.66,
						paddingBottom: 102,
					},
				]}
			>
				Refresh at the top for new posts!
			</Text>
		</View>
	);
}

export default Newsfeed;
