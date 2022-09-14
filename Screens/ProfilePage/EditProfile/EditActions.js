import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EditProfileSVG from "../../../components/Icons/EditProfileSVG";
import PersonalProfileSVG from "../../../components/Icons/PersonalInfoSVG";
import EmailIconSVG from "../../../components/Icons/EmailIconSVG";
import LockIconSVG from "../../../components/Icons/LockIconSVG";
import BellIconSVG from "../../../components/Icons/BellIconSVG";

const EditActions = ({ navigation }) => {
	const { theme, styleVariables } = useTheme();
	return (
		<View style={{ backgroundColor: "white", flex: 1 }}>
			<TouchableOpacity
				id="editInfo"
				onPress={() => {
					navigation.navigate("EditPersonalInfo");
				}}
				style={[theme.cardButton, styles.actionButton]}>
				<View style={styles.iconHolderView}>
					<PersonalProfileSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Personal info
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				id="editInfo"
				onPress={() => {
					// navigation.navigate("EditProfile");
				}}
				style={[theme.cardButton, styles.actionButton]}>
				<View style={styles.iconHolderView}>
					<EmailIconSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Email address
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				id="editInfo"
				onPress={() => {
					// navigation.navigate("EditProfile");
				}}
				style={[theme.cardButton, styles.actionButton]}>
				<View style={styles.iconHolderView}>
					<LockIconSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Password
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={24}
					color={styleVariables.colors.primary}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				id="editInfo"
				onPress={() => {
					// navigation.navigate("EditProfile");
				}}
				style={[theme.cardButton, styles.actionButton]}>
				<View style={styles.iconHolderView}>
					<BellIconSVG style={styles.materialIconRight} />
					<Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
						Notifications
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
};

const styles = StyleSheet.create({
	colorPrimary: { color: "#395E66" },
	materialIcon: { marginLeft: 8 },
	materialIconRight: { marginRight: 10 },
	actionButton: { marginVertical: 8 },
	iconHolderView: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 4,
	},
});

export default EditActions;
