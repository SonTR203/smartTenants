import React from "react";
import {
	StyleSheet,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../../ThemeContext";
import { useAppContext } from "../../../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import ProfileActions from "./ProfileActions";
import DynamicProfilePicture from "../../../components/ProfilePicture/DynamicProfilePicture";
import CoinStackSVG from "../../../components/Icons/CoinStackSVG";

/* This is the profile/my info screen for the logged-in user. It *allows the user to navigate to various screens to edit his profile, *see his posts, visit Smart Living residential portal, navigate to *building info screen, admin panel screen if the user is an admin, *as well as logout of the application if the user wishes to
 */
const ProfileGeneral = ({ navigation }) => {
	const { theme, styleVariables } = useTheme();

	const { currentUser } = useAppContext();

	return (
		<SafeAreaView style={styles(styleVariables).container} edges={["top"]}>
			<StatusBar style="auto" />
			{/* scroll view body */}
			<ScrollView style={styles(styleVariables).scrollContainer}>
				{/* userHeader */}
				<View style={[theme.topCard, styles(styleVariables).topCard]}>
					<View style={styles(styleVariables).headerSection}>
						{/* userImage */}

						<View id="userImage" style={styles(styleVariables).userImageContainer}>
							<DynamicProfilePicture
								user={{
									userProfileImage: currentUser.userProfileImage,
									firstName: currentUser.firstName,
									lastName: currentUser.lastName,
									colors: currentUser.colors,
								}}
								size={88}
								borderRadius={16}
							/>
						</View>

						{/* userFullName */}
						<Text
							id="userFullName"
							style={[
								styleVariables.fontSizes.header,
								styles(styleVariables).fullNameText,
								{
									color: styleVariables.colors.black,
								},
							]}>
							{`${currentUser.firstName} ${currentUser.lastName}`}
						</Text>

						{/* goToRewardsOrAdmin */}
						<View id="goToRewardsOrAdmin">
							{currentUser.isAdmin ? (
								<TouchableOpacity
									id="goToAdmin"
									/* Navigate to the admin *panel screen if the *user is an admin
									 */
									onPress={() => {
										navigation.navigate("AdminPanel");
									}}
									style={styles(styleVariables).adminButton}>
									<Text
										style={[
											styleVariables.fontSizes.bodyBold,
											styles(styleVariables).colorPrimary,
										]}>
										Admin Panel
									</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={24}
										color={styleVariables.colors.primary}
										style={styles(styleVariables).materialIcon}
									/>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									id="goToRewards"
									onPress={() => {
										// navigation.navigate('Rewards')
										alert("navigate to rewards (not yet implemented)");
									}}
									style={styles(styleVariables).rewardsButton}>
									<CoinStackSVG />
									<Text
										style={[
											styleVariables.fontSizes.bodyBold,
											styles(styleVariables).colorPrimary,
										]}>
										500
									</Text>
									<MaterialCommunityIcons
										name="chevron-right"
										size={24}
										color={styleVariables.colors.primary}
										style={styles(styleVariables).materialIcon}
									/>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>

				{/* user action areas */}
				<ProfileActions navigation={navigation} />

				{/* footer */}
				<View id="footer" style={styles(styleVariables).footer}>
					<Text
						style={[
							styleVariables.fontSizes.callout,
							styles(styleVariables).calloutText,
						]}>
						Created by{" "}
					</Text>
					<TouchableOpacity
						/*Link to the application's developer team on google search*/
						onPress={async () => {
							await WebBrowser.openBrowserAsync(
								`https://www.algonquincollege.com/arie/facilities/data-analytics-centre/`
							);
						}}>
						<Text
							style={[
								styleVariables.fontSizes.calloutBold,
								styles(styleVariables).intellidevText,
							]}>
							Algonquin College DAC
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
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
	});

export default ProfileGeneral;
