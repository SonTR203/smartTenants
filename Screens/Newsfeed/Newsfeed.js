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
import React, { useState, useEffect } from 'react';
import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
} from '@firebase/firestore';
import { db } from '../../firebase-config';
import { useAppContext } from '../../Context/AppContext';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import _ from 'lodash';
const windowWidth = Dimensions.get('window').width;
import { Platform } from 'expo-modules-core';

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
	const [numberOfComments, setNumberOfComments] = useState(0);
	const [timeSincePost, setTimeSincePost] = useState('');
	const [userLiked, setUserLiked] = useState(false);
	let peopleWhoLiked = [];
	let peopleWhoLikedDocIds = [];

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
		timestamp: posts.timestamp,
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
		data.docs.map((item) => {
			peopleWhoLiked.push(item._document.data.value.mapValue.fields.userID);
		});

		//set new array of the docoument ids for all likes
		data.docs.map((item) => {
			peopleWhoLikedDocIds.push(item._document.key.path.segments[8]);
		});

		setTime();
		getComments();
		setHeartsToGreen();
	};
	getLikes();

	const setHeartsToGreen = () => {
		peopleWhoLiked.map((item) => {
			if (item.stringValue == globalCurrentUser.userDocId) {
				setUserLiked(true);
			}
		});
	};

	const getComments = async () => {
		const likesColReference = collection(
			db,
			'Newsfeed',
			`${posts.id}`,
			'peopleWhoCommented'
		);
		const data = await getDocs(likesColReference);
		setNumberOfComments(data.docs.length);
	};

	const likePost = async () => {
		// ================ checking is current user liked post ====================
		if (peopleWhoLiked != 0) {
			peopleWhoLiked.map((item) => {
				if (item.stringValue == globalCurrentUser.userDocId) {
					setUserLiked(false);

					removeLike();
				} else {
					createLikeInDB();
				}
			});
		} else {
			createLikeInDB();
		}
	};

	const createLikeInDB = async () => {
		const notificationColRef = collection(
			db,
			`Users/${posts.userID}/Notifications`
		);
		const peopleWhoLikedColRef = collection(
			db,
			`Newsfeed/${posts.id}/peopleWhoLiked`
		);

		//=========== adding like notification============
		try {
			await addDoc(notificationColRef, {
				content: `${globalCurrentUser.firstName} ${globalCurrentUser.lastName} liked your post.`,
				postID: posts.id,
				userID: posts.userID,
				wasSeen: false,
				timestamp: Date.now(),
			}).then(() => {
				getLikes();
			});
		} catch (error) {
			console.log(error);
		}

		// =============== adding user to peopleWhoLiked subcollection =============
		try {
			await addDoc(peopleWhoLikedColRef, {
				firstName: globalCurrentUser.firstName,
				lastName: globalCurrentUser.lastName,
				postID: posts.id,
				userID: globalCurrentUser.userDocId,
			}).then(() => {
				setUserLiked(true);
			});
		} catch (error) {
			console.log(error);
		}
	};

	const removeLike = async () => {
		//remove user from list of peopleWhoLiked
		peopleWhoLikedDocIds.map(async (item) => {
			if ((item.userID = globalCurrentUser.userDocId)) {
				const singleDoc = doc(
					db,
					`Newsfeed/${posts.id}/peopleWhoLiked/${item}`
				);
				await deleteDoc(singleDoc);
			}
		});

		//========= TODO:  delete notification from other user that there was a like =========

		// const notificationSingleDoc = doc(db, `Users/${posts.userID}/Notifications/${}`)
		// await deleteDoc(notificationSingleDoc);
	};

	const setTime = () => {
		let time = posts.timestamp;
		if (time != undefined) {
			let timePosted = time.integerValue;
			let currentTime = Date.now();
			let timeDifferenceMinutes = ((currentTime - timePosted) / 60000).toFixed(
				0
			);
			let timeDifferenceHours = (timeDifferenceMinutes / 60).toFixed(0);
			let timeDifferenceDays = (timeDifferenceHours / 24).toFixed(0);
			let timeDifferenceWeeks = (timeDifferenceDays / 7).toFixed(0);

			if (timeDifferenceMinutes <= 59) {
				setTimeSincePost(`${timeDifferenceMinutes} minutes ago`);
			} else if (timeDifferenceMinutes > 59 && timeDifferenceHours <= 23) {
				setTimeSincePost(`${timeDifferenceHours} hours ago`);
			} else if (
				timeDifferenceDays <= 6 &&
				timeDifferenceMinutes > 59 &&
				timeDifferenceHours > 23
			) {
				setTimeSincePost(`${timeDifferenceDays} days ago`);
			} else if (
				timeDifferenceWeeks <= 10 &&
				timeDifferenceDays > 6 &&
				timeDifferenceMinutes > 59 &&
				timeDifferenceHours > 23
			) {
				setTimeSincePost(timeDifferenceWeeks, ' weeks ago');
			} else {
				setTimeSincePost('10+ weeks ago');
			}
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
					{timeSincePost}
				</Text>
			</View>

			{/* postContent */}
			<TouchableOpacity
				id="postContent"
				onPress={() => {
					navigation.push('IndividualPosts');
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
					{userLiked && (
						<MaterialCommunityIcons
							name="heart"
							size={24}
							color="#0AA74C"
							style={{ marginRight: 8 }}
						/>
					)}
					{!userLiked && (
						<MaterialCommunityIcons
							name="heart-outline"
							size={24}
							color={styleVariables.colors.black}
							style={{ marginRight: 8 }}
						/>
					)}
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
						{numberOfComments}
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
						{globalCurrentUser.buildingAddress}
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
				<View
					id="topCard"
					style={[
						theme.topCard,
						{ elevation: Platform.OS === 'android' ? 0 : 20 },
					]}
				>
					<Pressable
						id="announcements"
						onPress={() => {
							alert('navigate to announcements (not yet implemented)');
						}}
						style={[theme.cardButton, { marginTop: 17, marginBottom: 22 }]}
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

function ListFooter({ styleVariables }) {
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
