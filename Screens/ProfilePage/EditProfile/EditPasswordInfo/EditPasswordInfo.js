//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	Modal,
	Alert,
	StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../../Context/AppContext";
import {
	verifyPassword,
	updateUserPassword,
} from "../../../../utils/firebase.services";
import ErrorArea from "../../../../components/SignUp/ErrorArea";

const EditEmailInfo = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [saveModal, setSaveModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [errorText, setErrorText] = useState("");

	const [buttonDisabled, setButtonDisabled] = useState(true);

	const checkTextInputs = () => {
		try {
			if (email.length) {
				return true;
			} else {
				Alert.alert("ERROR", "Your email cannot be empty");
				return false;
			}
		} catch (error) {
			console.log("ERROR Edit profile: ", error);
		}
	};

	// Check if passwords matches
	const checkPasswords = async () => {
		return newPassword === confirmPassword;
	};
	// async function saveProfileInfo() {
	// 	const userDocRef = doc(db, "Tenants", currentUser.userID);
	// 	if (checkTextInputs()) {
	// 		try {
	// 			await updateDoc(userDocRef, {
	// 				email,
	// 			}).then(() => {
	// 				changeEmail({ email: currentUser.email, newEmail: email });
	// 			});
	// 			setCurrentUser({
	// 				...currentUser,
	// 				email,
	// 			});
	// 			setSaveModal(true);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// }

	const updatePassword = () => {
		updateUserPassword(newPassword);
	};

	const styles = StyleSheet.create({
		profileLoading: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: 85,
			width: 85,
			borderRadius: 18,
		},
		buttonDisabled: {
			backgroundColor: "#748E94",
		},
	});

	// Reset error message whenever the user starts typing the password again
	useEffect(() => {
		setErrorText("");
	}, [password]);
	return (
		<SafeAreaView edges={["top"]}>
			<View>
				<ScrollView
					keyboardShouldPersistTaps="handled"
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
						<View>
							<View id="passwordCurrentInput">
								<Text
									style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
									Current password
								</Text>
								<TextInput
									onChangeText={(text) => setPassword(text)}
									placeholderTextColor={styleVariables.colors.placeholderText}
									placeholder="*******"
									secureTextEntry={true}
									//================================= will need to research how to do this SAFELY ==========================
									style={[theme.textInput, styleVariables.fontSizes.body]}
								/>
							</View>
						</View>
						<View>
							<View id="passwordNewInput">
								<Text
									style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
									New password
								</Text>
								<TextInput
									onChangeText={(text) => setNewPassword(text)}
									placeholderTextColor={styleVariables.colors.placeholderText}
									placeholder="*******"
									secureTextEntry={true}
									//================================= will need to research how to do this SAFELY ==========================
									style={[theme.textInput, styleVariables.fontSizes.body]}
								/>
							</View>
						</View>
						<View>
							<View id="passwordConfirmInput">
								<Text
									style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
									Confirm password
								</Text>
								<TextInput
									onChangeText={(text) => setConfirmPassword(text)}
									placeholderTextColor={styleVariables.colors.placeholderText}
									placeholder="*******"
									secureTextEntry={true}
									//================================= will need to research how to do this SAFELY ==========================
									style={[theme.textInput, styleVariables.fontSizes.body]}
								/>
							</View>
						</View>
					</View>
					{/* save button */}
					<TouchableOpacity
						id="save"
						disabled={buttonDisabled}
						onPress={() => {
							verifyPassword(password, updatePassword, setErrorText);
						}}>
						<View
							style={[
								theme.primaryButton,
								{ margin: 0, shadowColor: "#fff" },
								buttonDisabled ? styles.buttonDisabled : null,
							]}>
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
			</View>
		</SafeAreaView>
	);
};

export default EditEmailInfo;
