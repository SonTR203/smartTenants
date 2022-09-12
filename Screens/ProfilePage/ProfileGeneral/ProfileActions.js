import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeExpoPushToken } from "../../../utils/firebase.services";
import { useAppContext } from "../../../Context/AppContext";
import ResidentPortalSVG from "../../../components/Icons/ResidentPortalSVG";
import MyPostsSVG from "../../../components/Icons/MyPostsSVG";
import LogoutSVG from "../../../components/Icons/LogoutSVG";
import EditProfileSVG from "../../../components/Icons/EditProfileSVG";

function ProfileActions({ navigation }) {
	const { theme, styleVariables } = useTheme();
	const { setNotificationBadges, setMarketplaceBadges } = useAppContext();
	const auth = getAuth();

	/*This function logs out the user of both the Firebase database cloud service and the user application
	 *input: none
	 *output: none
	 */
	const logUserOut = async () => {
		await removeExpoPushToken(auth.currentUser.uid);
		await auth.signOut();
		navigation.navigate("Login", {
			reload: true,
		});
		setMarketplaceBadges({
			unseen: [],
			list: [],
		});
		setNotificationBadges({
			unseen: [],
			list: [],
		});
	};

	return (
		<View style={{ backgroundColor: "white", flex: 1 }}>
			{/* editInfo */}
			<TouchableOpacity
				id="editInfo"
				/*Navigate to the Edit Profile screen */
				onPress={() => {
					navigation.navigate("EditProfile");
				}}
				style={[theme.cardButton, { marginTop: 34 }]}>
				<View style={styles.iconHolderView}>
					<EditProfileSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Edit profile Info
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>
			{/* myPosts */}
			<TouchableOpacity
				id="myPosts"
				/*Navigate to the My Posts screen*/
				onPress={() => navigation.navigate("MyPosts")}
				style={theme.cardButton}>
				<View style={styles.iconHolderView}>
					<MyPostsSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						My Posts
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>
			{/* residentPortal */}
			<TouchableOpacity
				id="residentPortal"
				/*Link to the Smart Living residential portal*/
				onPress={async () => {
					await WebBrowser.openBrowserAsync(
						"https://smartlivinggroup.securecafe.com/residentservices/apartmentsforrent/userlogin.aspx"
					);
				}}
				style={theme.cardButton}>
				<View style={styles.iconHolderView}>
					<ResidentPortalSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Resident Portal
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>

			{/* logOut */}
			<TouchableOpacity
				id="logOut"
				/*Logs out the user*/
				onPress={logUserOut}
				style={theme.cardButton}>
				<View style={styles.iconHolderView}>
					<LogoutSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Log Out
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	colorPrimary: { color: "#395E66" },
	materialIcon: { marginLeft: 8 },
	materialIconRight: { marginRight: 8 },
	iconHolderView: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
	},
});

export default ProfileActions;
