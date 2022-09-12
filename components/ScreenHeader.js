import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useAppContext } from "../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import NotificationBadge from "./NotificationBadge";

function ScreenHeader({ title, navigation }) {
	const { currentUser } = useAppContext();
	const { theme, styleVariables } = useTheme();
	const styles = StyleSheet.create({
		headerPageTitle: {
			color: styleVariables.colors.white,
		},
		userBuilding: {
			fontSize: 15,
			fontFamily: "Roboto_400Regular",
			color: "#cdd7d9",
			marginRight: 13,
		},
		userBuildingButton: {
			marginTop: 8,
			alignItems: "center",
			flexDirection: "row",
		},
		marketplaceProfile: {
			position: "absolute",
			right: 16,
			top: 55,
			padding: 10,
			margin: -10,
		},
		profileContainer: {
			width: 32,
			height: 32,
			backgroundColor: "white",
			borderRadius: 8,
			alignItems: "center",
			justifyContent: "center",
			...styleVariables.shadow,
		},
		badgeContainer: {
			position: "absolute",
			right: 74,
			top: 30,
		},
	});

	const handleNavigate = () => {
		navigation.navigate("MarketplaceProfile");
	};
	const handleNavigateBuildings = () => {
		navigation.navigate("BuildingInfo");
	};
	return (
		<View style={theme.header}>
			<View>
				{/* headerPageTitle */}
				<Text style={[styleVariables.fontSizes.header, styles.headerPageTitle]}>
					{title}
				</Text>
				{title === "Profile" ? (
					<>
						<TouchableOpacity
							onPress={handleNavigateBuildings}
							style={[styles.userBuildingButton]}>
							<Text style={[styles.userBuilding]}>
								{currentUser?.buildingAddress}
							</Text>
							<MaterialCommunityIcons
								name="chevron-right"
								size={16}
								color={styleVariables.colors.white}
							/>
						</TouchableOpacity>
					</>
				) : null}
			</View>
			{title === "Marketplace" ? (
				<>
					<TouchableOpacity
						style={styles.marketplaceProfile}
						onPress={handleNavigate}>
						<View style={styles.profileContainer}>
							<Ionicons name="person" size={20} color="#395E66" />
						</View>
					</TouchableOpacity>
					<View style={styles.badgeContainer}>
						<NotificationBadge screen={`${title}Navigator`} />
					</View>
				</>
			) : null}
		</View>
	);
}

export default ScreenHeader;
