//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	Modal,
	StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../Context/AppContext";
import DynamicProfilePicture from "../../../components/ProfilePicture/DynamicProfilePicture";
import EditActions from "./EditActions";

const EditProfile = ({ route, navigation }) => {
	const { currentUser, setCurrentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const [isLoading, setIsLoading] = useState(false);

	const changeModalVisibility = (bool) => {
		setModalVisible(bool);
	};

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
				marginBottom: 8,
			},
			headerSection: {
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				paddingTop: 24,
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
						transparent={true}
						statusBarTranslucent={true}
						visible={route.params?.saveModal === true ? true : false}
						onRequestClose={() => {
							setSaveModal(!saveModal);
						}}
						onShow={(e) => {
							setTimeout(() => {
								navigation.setParams({
									saveModal: false,
								});
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
