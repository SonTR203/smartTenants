import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeExpoPushToken } from "../../../utils/firebase.services";
import { useAppContext } from "../../../Context/AppContext";
import ResidentPortalSVG from "../../../components/Icons/ResidentPortalSVG";
import MyPostsSVG from "../../../components/Icons/MyPostsSVG";
import LogoutSVG from "../../../components/Icons/LogoutSVG";
import EditProfileSVG from "../../../components/Icons/EditProfileSVG";

const EditActions = () => {
	return (
		<View style={{ backgroundColor: "white", flex: 1 }}>
			<TouchableOpacity
				id="editInfo"
				onPress={() => {
					// navigation.navigate("EditProfile");
				}}
				style={[theme.cardButton, { marginTop: 34 }]}>
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
				style={[theme.cardButton, { marginTop: 34 }]}>
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
				style={[theme.cardButton, { marginTop: 34 }]}>
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
				style={[theme.cardButton, { marginTop: 34 }]}>
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

export default EditActions;
