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
	StyleSheet,
	Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../../../firebase-config";
import {
	reauthenticateWithCredential,
	EmailAuthProvider,
	getAuth,
} from "firebase/auth";
import { useTheme } from "../../../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../../Context/AppContext";
import { changeEmail } from "../../../../utils/firebase.services";

const EditEmailInfo = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [email, setEmail] = useState(currentUser.email);
	const [password, setPassword] = useState("");

	const [saveModal, setSaveModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
	const verifyPassword = async () => {
		const auth = getAuth();
		const creds = EmailAuthProvider.credential(
			auth.currentUser.email,
			password
		);
		try {
			await reauthenticateWithCredential(auth.currentUser, creds).then(
				(res) => {
					saveProfileInfo();
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

	async function saveProfileInfo() {
		const userDocRef = doc(db, "Tenants", currentUser.userID);
		if (checkTextInputs()) {
			try {
				await updateDoc(userDocRef, {
					email,
				}).then(() => {
					changeEmail({ email: currentUser.email, newEmail: email });
				});
				setCurrentUser({
					...currentUser,
					email,
				});
				setSaveModal(true);
			} catch (error) {
				console.log(error);
			}
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
						<View id="emailInput" style={{ marginTop: 16 }}>
							<Text
								style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
								Email
							</Text>
							<TextInput
								placeholderTextColor={styleVariables.colors.placeholderText}
								placeholder="name@company.com"
								defaultValue={currentUser.email}
								onChangeText={(text) => {
									setEmail(text);
								}}
								style={[theme.textInput, styleVariables.fontSizes.body]}
							/>
						</View>
						<View id="passwordInput">
							<Text
								style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
								Password
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
					{/* save button */}
					<TouchableOpacity
						id="save"
						onPress={() => {
							verifyPassword();
						}}>
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
			</View>
		</SafeAreaView>
	);
};

export default EditEmailInfo;
