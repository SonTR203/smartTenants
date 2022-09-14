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
import { db } from "../../../../firebase-config";
import { useTheme } from "../../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../../Context/AppContext";
import * as ImagePicker from "expo-image-picker";

import {
	checkPermissionMediaLibrary,
	compressFileSize,
	getFileInfo,
} from "../../../../utils/Profile/profile.services";
import DynamicProfilePicture from "../../../../components/ProfilePicture/DynamicProfilePicture";
import { uploadImageToStorage } from "../../../../utils/firebase.services";

const EditPersonalInfo = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [firstName, setFirstName] = useState(currentUser.firstName);
	const [lastName, setLastName] = useState(currentUser.lastName);
	const [userProfileImage, setUserProfileImage] = useState(
		currentUser.userProfileImage
	);
	const [saveModal, setSaveModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const checkTextInputs = () => {
		try {
			if (firstName.length >= 1 && lastName.length >= 1) {
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
				});
				setCurrentUser({
					...currentUser,
					firstName,
					lastName,
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

	const styles = StyleSheet.create({
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
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "position" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}>
				<ScrollView
					contentContainerStyle={{
						flex: 1,
						justifyContent: "space-between",
					}}
					style={[
						theme.pageContainer,
						theme.globalMargins,
						{
							height: "100%",
						},
					]}>
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
					<View>
						{/* userHeader */}
						<View
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "row",
								width: "100%",
								paddingVertical: 34,
							}}>
							{isLoading ? (
								<View style={styles.profileLoading}>
									<ActivityIndicator
										size="large"
										color={styleVariables.colors.primary}
									/>
								</View>
							) : (
								<DynamicProfilePicture
									user={{
										userProfileImage: userProfileImage,
										firstName: currentUser.firstName,
										lastName: currentUser.lastName,
										colors: currentUser.colors,
									}}
									size={85}
									borderRadius={18}
								/>
							)}
							<View style={{ paddingLeft: 17 }}>
								<Text
									style={[styleVariables.fontSizes.title, { marginBottom: 4 }]}>
									{currentUser.firstName} {currentUser.lastName}
								</Text>
								<TouchableOpacity
									onPress={() => pickImage()}
									style={{ flexDirection: "row" }}>
									<Text
										style={[
											styleVariables.fontSizes.body,
											{ color: styleVariables.colors.primary, opacity: 0.66 },
										]}>
										Change profile picture
									</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={24}
										color={styleVariables.colors.primary}
										style={{ opacity: 0.66 }}
									/>
								</TouchableOpacity>
							</View>
						</View>
						{/* signupInputs */}
						<View id="signupInputs">
							<View id="firstNameInput">
								<Text
									style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
									First Name
								</Text>
								<TextInput
									placeholderTextColor={styleVariables.colors.placeholderText}
									placeholder="John"
									defaultValue={currentUser.firstName}
									onChangeText={(text) => setFirstName(text)}
									style={[theme.textInput, styleVariables.fontSizes.body]}
								/>
							</View>
							<View id="lastNameInput">
								<Text
									style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
									Last name
								</Text>
								<TextInput
									placeholderTextColor={styleVariables.colors.placeholderText}
									placeholder="Doe"
									defaultValue={currentUser.lastName}
									onChangeText={(text) => setLastName(text)}
									style={[theme.textInput, styleVariables.fontSizes.body]}
								/>
							</View>
						</View>
					</View>
					{/* save button */}
					<TouchableOpacity id="save" onPress={saveProfileInfo}>
						<View
							style={[theme.primaryButton, { margin: 0, shadowColor: "#fff" }]}>
							<Text
								style={[
									theme.primaryButtonText,
									styleVariables.fontSizes.bodyBold,
								]}>
								Save
							</Text>
						</View>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default EditPersonalInfo;
