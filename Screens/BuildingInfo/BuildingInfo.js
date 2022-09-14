import React, { useState, useEffect } from "react";
import {
	Alert,
	Platform,
	View,
	Text,
	ScrollView,
	Image,
	Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../../Context/AppContext";

// Import DB from Firestore config file
import { db } from "../../firebase-config";

// Import required functions
import { collection, getDocs } from "@firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

// Create collection Reference
const colRef = collection(db, "Buildings");

const BuildingInfo = () => {
	const { currentUser } = useAppContext();

	const { theme, styleVariables } = useTheme();
	const [building, setBuilding] = useState({});
	const [buildingLocation, setBuildingLocation] = useState("");

	const makePhoneCall = () => {
		let phoneNumber = "";
		if (Platform.OS !== "android") {
			phoneNumber = `telprompt:${phone}`;
		} else {
			phoneNumber = `tel:${phone}`;
		}
		Linking.canOpenURL(phoneNumber)
			.then((supported) => {
				if (!supported) {
					Alert.alert("Phone number is not available");
				} else {
					return Linking.openURL(phoneNumber);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		// Get collections data
		getDocs(colRef).then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (doc.id == currentUser.buildingID) {
					setBuildingLocation(doc.data().buildingAddress.slice(-19, -1));
					return setBuilding({ ...doc.data(), id: doc.id });
				}
			});
		});
	}, []);
	return (
		<ScrollView style={theme.pageContainer}>
			<StatusBar style="dark" />
			<View style={theme.globalMargins}>
				<View id="buildingInfoCard" style={theme.card}>
					<Image
						style={theme.buildingImagePreview}
						source={require("../../assets/icon.png")}
					/>
					<View
						id="buildingInfoAddress"
						style={{
							display: "flex",
							alignContent: "center",
							justifyContent: "space-between",
							flexDirection: "row",
							width: "100%",
							marginTop: 17,
						}}>
						<Text style={styleVariables.fontSizes.header}>
							{building.buildingAddress}
						</Text>
						<MaterialCommunityIcons
							name="arrow-top-right"
							size={32}
							color={styleVariables.colors.primary}
						/>
					</View>
					<View
						id="buildingInfoLocation"
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							width: "100%",
							marginTop: 6,
							marginBottom: 4,
						}}>
						<MaterialCommunityIcons
							name="map-marker-outline"
							size={18}
							color={styleVariables.colors.primary}
							style={{ marginRight: 8, height: 18 }}
						/>
						<Text
							style={[
								styleVariables.fontSizes.body,
								{ color: styleVariables.colors.primary },
							]}>
							{buildingLocation}
						</Text>
					</View>
				</View>
				<View id="contacts" style={{ marginTop: 17, padding: 17 }}>
					<Text
						style={[
							styleVariables.fontSizes.secondaryHeader,
							{ marginBottom: 14 },
						]}>
						Contacts
					</Text>
					{/* TODO: build the list dynamically using admin data */}
					<View style={{ display: "none" }}>
						<Text
							style={[styleVariables.fontSizes.title, { marginBottom: 10 }]}>
							{building.fullName}
						</Text>
						<View
							style={{
								display: "flex",
								alignContent: "center",
								flexDirection: "row",
								width: "100%",
								marginTop: 6,
								marginBottom: 4,
								opacity: 0.66,
							}}>
							<MaterialCommunityIcons
								name="email-outline"
								size={18}
								color={styleVariables.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<TouchableOpacity
								onPress={() => Linking.openURL(`mailto:${email}`)}>
								<Text
									style={[
										styleVariables.fontSizes.body,
										{ color: styleVariables.colors.primary },
									]}>
									{building.email}
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								display: "flex",
								alignContent: "center",
								flexDirection: "row",
								width: "100%",
								marginTop: 6,
								marginBottom: 4,
								opacity: 0.66,
							}}>
							<MaterialCommunityIcons
								name="phone-outline"
								size={18}
								color={styleVariables.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<TouchableOpacity onPress={makePhoneCall}>
								<Text
									style={[
										styleVariables.fontSizes.body,
										{ color: styleVariables.colors.primary },
									]}>
									{building.phone}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default BuildingInfo;
