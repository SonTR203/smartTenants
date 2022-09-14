//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	TextInput,
	TouchableOpacity,
	Modal,
	Alert,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../../firebase-config";
import ModalPicker from "../../../components/ModalBuildingPicker";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../Context/AppContext";
import * as ImagePicker from "expo-image-picker";
import {
	checkPermissionMediaLibrary,
	compressFileSize,
	getFileInfo,
} from "../../../utils/Profile/profile.services";
import DynamicProfilePicture from "../../../components/ProfilePicture/DynamicProfilePicture";
import { uploadImageToStorage } from "../../../utils/firebase.services";
import EditActions from "./EditActions";

const EditProfile = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [email, setEmail] = useState(currentUser.email);
	const [firstName, setFirstName] = useState(currentUser.firstName);
	const [lastName, setLastName] = useState(currentUser.lastName);
	const [buildingAddress, setBuildingAddress] = useState(
		currentUser.buildingAddress
	);
	const [buildingID, setBuildingID] = useState(currentUser.buildingID);
	const [buildingName, setBuildingName] = useState(currentUser.buildingName);
	const [modalVisible, setModalVisible] = useState(false);
	const [userProfileImage, setUserProfileImage] = useState(
		currentUser.userProfileImage
	);
	const [saveModal, setSaveModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const changeModalVisibility = (bool) => {
		setModalVisible(bool);
	};

	const setData = (building) => {
		setBuildingAddress(building.buildingAddress.stringValue);
		setBuildingName(building.buildingName.stringValue);
		setBuildingID(building.id);
	};

	const checkTextInputs = () => {
		try {
			if (
				firstName.length >= 1 &&
				lastName.length >= 1 &&
				email.length >= 1 &&
				buildingAddress.length >= 1
			) {
				return true;
			} else {
				Alert.alert("ERROR", "Please fill out all fields");
				return false;
			}
		} catch (error) {
			console.log("ERROR Edit profile: ", error);
		}
	};

	async function saveProfileInfo() {
		const userDocRef = doc(db, "Tenants", currentUser.userID);
		if (checkTextInputs()) {
			try {
				await updateDoc(userDocRef, {
					firstName,
					lastName,
					buildingID,
					buildingAddress,
					buildingName,
					email,
				});

				setCurrentUser({
					...currentUser,
					firstName,
					lastName,
					buildingID,
					buildingAddress,
					buildingName,
					email,
				});

				setSaveModal(true);
			} catch (error) {
				console.log(error);
			}
		}
	}

	//=========================== Change profile picture ====================

	const pickImage = async () => {
		const permissionResult = await checkPermissionMediaLibrary();

		if (permissionResult !== false) {
			let result = await ImagePicker.launchImageLibraryAsync({
				// Commented out because it broke the image upload feature
				// presentationStyle: 0,
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.1,
			});

			if (result.cancelled === false) {
				const size = await getFileInfo(result.uri);
				if (size > 5) {
					Alert.alert(
						"ERROR",
						"File size is too large. Please select a file smaller than 5MB"
					);
					return;
				}
				const path = await compressFileSize(result.uri);
				uploadImage(path.uri);
			}
		}
	};

	async function uploadImage(newImage) {
		try {
			setIsLoading(true);
			const imageName = `userProfileImages/${currentUser.userID}/avatar.jpeg`;
			const imageUrl = await uploadImageToStorage(imageName, newImage);
			setUserProfileImage(imageUrl);
			setCurrentUser({
				...currentUser,
				userProfileImage: imageUrl,
			});
			changeProfileImageInDatabase(imageUrl);
			Alert.alert("Success", "Profile image updated");
			setIsLoading(false);
		} catch (err) {
			setIsLoading(false);
			console.log("error uploading image: ", err);
		}
	}

	async function changeProfileImageInDatabase(imgUrl) {
		const userDocRef = doc(db, "Tenants", currentUser.userID);

		try {
			await updateDoc(userDocRef, {
				userProfileImage: imgUrl,
			});

			setCurrentUser({
				...currentUser,
				userProfileImage: imgUrl,
			});
		} catch (error) {
			console.log(error);
		}
	}

	const styles = (styleVariables) =>
		StyleSheet.create({
			container: {
				flex: 1,
				backgroundColor: styleVariables.colors.primary,
			},
			scrollContainer: {
				marginTop: 44,
				backgroundColor: styleVariables.colors.white,
				borderTopLeftRadius: 27,
				borderTopRightRadius: 27,
			},
			colorPrimary: {
				color: styleVariables.colors.primary,
			},
			topCard: {
				elevation: Platform.OS === "android" ? 0 : 20,
				borderTopLeftRadius: 27,
				borderTopRightRadius: 27,
				marginBottom: 16,
			},
			headerSection: {
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				paddingTop: 34,
			},
			userImageContainer: {
				borderRadius: 99,
				shadowColor: styleVariables.colors.black,
				shadowOffset: {
					width: 0,
					height: 8,
				},
				shadowOpacity: 0.14,
				shadowRadius: 17,
				elevation: 20,
				backgroundColor: "white",
			},
			fullNameText: { paddingTop: 17, paddingBottom: 8 },
			adminButton: {
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			},
			materialIcon: { marginLeft: 8 },
			rewardsButton: {
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			},
			calloutText: {
				color: styleVariables.colors.black,
				opacity: 0.66,
			},
			footer: {
				paddingVertical: 17,
				paddingBottom: 68,
				paddingHorizontal: 34,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "row",
			},
			profileLoading: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: 85,
				width: 85,
				borderRadius: 18,
			},
		});

	return (
		<SafeAreaView edges={["top"]}>
			<KeyboardAvoidingView behavior="padding">
				<ScrollView
					style={[theme.pageContainer, theme.globalMargins, theme.fullHeight]}>
					<StatusBar style="dark" />
					<Modal
						animationType="slide"
						transparent={false}
						statusBarTranslucent={true}
						visible={saveModal}
						onRequestClose={() => {
							setSaveModal(!saveModal);
						}}
						onShow={() => {
							setTimeout(() => {
								setSaveModal(!saveModal);
								navigation.navigate("ProfileGeneral");
							}, 2000);
						}}>
						<View style={theme.container}>
							<View style={theme.modalView}>
								<Text
									style={{
										fontSize: 17,
										fontFamily: "Roboto_400Regular",
										color: "#191919",
									}}>
									{"Changes Saved"}
								</Text>
							</View>
						</View>
					</Modal>
					<View style={[theme.topCard, styles(styleVariables).topCard]}>
						<View style={styles(styleVariables).headerSection}>
							{/* userImage */}
							<View
								id="userImage"
								style={styles(styleVariables).userImageContainer}>
								<DynamicProfilePicture
									user={{
										userProfileImage: currentUser.userProfileImage,
										firstName: currentUser.firstName,
										lastName: currentUser.lastName,
										colors: currentUser.colors,
									}}
									size={85}
									borderRadius={8}
								/>
							</View>
							{/* userFullName */}
							<Text
								id="userFullName"
								style={[
									styleVariables.fontSizes.header,
									styles(styleVariables).fullNameText,
								]}>
								{`${currentUser.firstName} ${currentUser.lastName}`}
							</Text>
						</View>
					</View>
					<EditActions navigation={navigation} />
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default EditProfile;
