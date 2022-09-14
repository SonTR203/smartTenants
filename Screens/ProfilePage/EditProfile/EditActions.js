import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EditProfileSVG from "../../../components/Icons/EditProfileSVG";

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
					<EditProfileSVG style={styles.materialIconRight} />
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
					<EditProfileSVG style={styles.materialIconRight} />
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
					<EditProfileSVG style={styles.materialIconRight} />
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
					<EditProfileSVG style={styles.materialIconRight} />
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
	materialIconRight: { marginRight: 8 },
	actionButton: {
		marginTop: 20,
	},
	iconHolderView: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
	},
});

export default EditActions;
