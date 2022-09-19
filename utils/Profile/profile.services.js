import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import _ from "lodash";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const getMyPosts = async (currentUser) => {
	const peopleWhoLikedColRef = collection(db, `Newsfeed`);
	const q = query(
		peopleWhoLikedColRef,
		where("userID", "==", currentUser.userID)
	);

	const data = await getDocs(q);

	const formattedData = data.docs.map((doc) => {
		return {
			...doc.data(),
			id: doc.id,
		};
	});

	const sortedListOfPosts = _.sortBy(formattedData, "timestamp").reverse();

	return sortedListOfPosts;
};
export const getMyMarketplacePosts = async (currentUser) => {
	const peopleWhoLikedColRef = collection(db, `Marketplace`);
	const q = query(
		peopleWhoLikedColRef,
		where("userID", "==", currentUser.userID)
	);

	const data = await getDocs(q);

	const formattedData = data.docs.map((doc) => {
		return {
			...doc.data(),
			id: doc.id,
		};
	});

	const sortedListOfPosts = _.sortBy(formattedData, "timestamp").reverse();

	return sortedListOfPosts;
};

export const compressFileSize = async (uri) => {
	const compressedUri = await manipulateAsync(uri, [], {
		compress: 0.5,
		format: SaveFormat.JPEG,
	});
	return compressedUri;
};

export const getFileInfo = async (fileURI) => {
	const fileInfo = await FileSystem.getInfoAsync(fileURI);
	if (fileInfo.size) {
		return fileInfo.size / 1024 / 1024;
	}
	return fileInfo;
};

export const checkPermissionMediaLibrary = async () => {
	const permissionResult =
		await ImagePicker.requestMediaLibraryPermissionsAsync();

	if (permissionResult.granted === false) {
		Alert.alert("Permission Denied", "You need to allow access to media", [
			{
				text: "Settings",
				style: "cancel",
				onPress: () => {
					Linking.openSettings();
				},
			},
			{ text: "OK" },
		]);
		return false;
	} else {
		return true;
	}
};

export const getRandomGradientColor = () => {
	const colorArray = [
		{
			start: "#63A3FD",
			end: "#3185FC",
		},
		{
			start: "#FB6B72",
			end: "#F93943",
		},
		{
			start: "#FDA0C8",
			end: "#FC6DAB",
		},
		{
			start: "#BAB8FF",
			end: "#8884FF",
		},
		{
			start: "#FF6633",
			end: "#FF4000",
		},
		{
			start: "#7FE692",
			end: "#53DD6C",
		},
	];
	const randomColorObj =
		colorArray[Math.floor(Math.random() * colorArray.length)];

	return randomColorObj;
};
