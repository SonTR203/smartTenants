import {
	View,
	Text,
	FlatList,
	RefreshControl,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { React, useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { useTheme } from "../../../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getMyPosts } from "../../../utils/Profile/profile.services";
import Post from "../../Newsfeed/Post";
import { constants } from "../../../utils/constants";
import { wait } from "../../../utils/wait";

const MyPosts = () => {
	const { currentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [userPosts, setUserPosts] = useState([]);
	const [postsType, setPostsType] = useState("Newsfeed");
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchMyPosts();
	}, []);

	async function fetchMyPosts() {
		const list = await getMyPosts(currentUser);
		setUserPosts(list);
		setRefreshing(false);
	}

	const onRefresh = useCallback(() => {
		setRefreshing(true);

		wait(1000).then(() => {
			fetchMyPosts();
		});
	}, []);

	const callBackRender = useCallback(
		({ item, index }) => renderPostItem({ item, index }),
		[[userPosts]]
	);

	const renderPostItem = ({ item }) => (
		<Post passedPost={item} windowWidth={constants.width} />
	);

	const styles = StyleSheet.create({
		postsOptions: {
			position: "absolute",
			width: "100%",
			top: -10,
			paddingHorizontal: 17,
		},
		slider: {
			height: 4,
			marginTop: 7,
			backgroundColor: "#395E66",
			borderTopRightRadius: 2,
			borderTopLeftRadius: 2,
		},
		postOptionButton: {
			paddingHorizontal: 7,
			flex: 1,
		},
		postOptionButtonText: {
			color: styleVariables.colors.primary,
			textAlign: "center",
		},
	});
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
			<StatusBar style="auto" />
			<View style={[theme.stackHeader, styles.postsOptions]}>
				<TouchableOpacity
					style={[styles.postOptionButton]}
					onPress={() => setPostsType("Newsfeed")}>
					<Text
						style={[
							styleVariables.fontSizes.title,
							styles.postOptionButtonText,
							{
								fontFamily:
									postsType === "Newsfeed"
										? "Roboto_500Medium"
										: "Roboto_400Regular",
							},
						]}>
						Newsfeed
					</Text>
					<View
						style={[
							styles.slider,
							{ opacity: postsType === "Newsfeed" ? 1 : 0 },
						]}></View>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.postOptionButton]}
					onPress={() => setPostsType("Marketplace")}>
					<Text
						style={[
							styleVariables.fontSizes.title,
							styles.postOptionButtonText,
							{
								fontFamily:
									postsType === "Marketplace"
										? "Roboto_500Medium"
										: "Roboto_400Regular",
							},
						]}>
						Marketplace
					</Text>
					<View
						style={[
							styles.slider,
							{ opacity: postsType === "Marketplace" ? 1 : 0 },
						]}></View>
				</TouchableOpacity>
			</View>
			{userPosts.length > 0 && (
				<FlatList
					data={userPosts}
					renderItem={callBackRender}
					keyExtractor={(item) => item.id}
					refreshControl={
						<RefreshControl
							onRefresh={onRefresh}
							refreshing={refreshing}
							style={{
								backgroundColor: styleVariables.colors.white,
							}}
							tintColor={styleVariables.colors.primary}
						/>
					}
					ListFooterComponent={
						<ListFooter styleVariables={styleVariables} theme={theme} />
					}
				/>
			)}
		</SafeAreaView>
	);
};

function ListFooter({ styleVariables }) {
	return (
		<View
			style={{
				height: 204,
				paddingVertical: 17,
				paddingHorizontal: 34,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<Text
				style={[
					styleVariables.fontSizes.callout,
					{
						color: styleVariables.colors.black,
						opacity: 0.66,
						paddingBottom: 8,
					},
				]}>
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
				]}>
				Refresh at the top for new posts!
			</Text>
		</View>
	);
}

export default MyPosts;
