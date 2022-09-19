//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	TextInput,
	TouchableOpacity,
	Alert,
	StyleSheet,
	Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../../../firebase-config";
import { useTheme } from "../../../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../../Context/AppContext";
import {
	changeEmail,
	verifyPassword,
} from "../../../../utils/firebase.services";
import ErrorArea from "../../../../components/SignUp/ErrorArea";

const EditEmailInfo = ({ navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [email, setEmail] = useState(currentUser.email);
	const [password, setPassword] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [errorText, setErrorText] = useState("");

	const checkTextInputs = () => {
		try {
			if (email.length) {
				return true;
			} else {
				setErrorText("Your email cannot be empty !");
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
					email,
				}).then(() => {
					changeEmail({ email: currentUser.email, newEmail: email });
				});
				setCurrentUser({
					...currentUser,
					email,
				});
				navigation.navigate("EditProfile", { saveModal: true });
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
					<View>
						<ErrorArea errorText={errorText} />
						<View id="emailInput" style={{ marginTop: 7 }}>
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
							verifyPassword(password, saveProfileInfo, setErrorText);
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
