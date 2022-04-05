import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	ScrollView,
	Image,
	Linking,
} from 'react-native';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../Context/AppContext';

// Import DB from Firestore config file
import { db } from '../../firebase-config';

// Import required functions
import { collection, getDocs } from '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deepCopy } from '@firebase/util';

// Create collection Reference
const colRef = collection(db, 'Buildings');
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		backgroundColor: 'pink',
		marginHorizontal: 20,
	},
	title: {
		fontSize: 20,
		alignSelf: 'center',
	},
});
let numberAndStreet;
let addressCityProvPostal;
let address;
let name;
let email;
let phone;
let location;
let image;

const BuildingInfo = () => {
	const { currentUser, setCurrentUser } = useAppContext();
	const [theme, styleVariables] = useTheme();
	const [building, setBuilding] = useState({});

	let userBuilding = currentUser.buildingID;
	useEffect(() => {
		// Get collections data
		getDocs(colRef).then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				let currentBuildingInLoop =
					doc._document.data.value.mapValue.fields.buildingAddress.stringValue;
				currentBuildingInLoop = currentBuildingInLoop.replace(/\s/g, '');
				if (currentBuildingInLoop == userBuilding) {
					console.log('HEY SETTING THE BUILDING');
					setBuilding({ ...doc.data(), id: doc.id });
					setBuildingInfo({ ...doc.data(), id: doc.id });
				} else {
					console.log('No building found');
				}
			});
		});
	}, []);

	const setBuildingInfo = (buildingObject) => {
		image = buildingObject.buildingImage;
		address = buildingObject.buildingAddress;
		location = buildingObject.buildingLocation;
		name = buildingObject.fullName;
		email = buildingObject.email;
		phone = buildingObject.phone;

		let addressSegments = address && address.split(',');
		numberAndStreet = address && addressSegments[0];
		addressCityProvPostal = `${addressSegments[1]}, ${addressSegments[2]}, ${addressSegments[3]}`;
	};

	const makePhoneCall = () => {
		if (Platform.OS !== 'android') {
			phoneNumber = `telprompt:${phone}`;
		} else {
			phoneNumber = `tel:${phone}`;
		}
		Linking.canOpenURL(phoneNumber)
			.then((supported) => {
				if (!supported) {
					Alert.alert('Phone number is not available');
				} else {
					return Linking.openURL(phoneNumber);
				}
			})
			.catch((err) => console.log(err));
	};

	console.log(numberAndStreet, addressCityProvPostal);
	return (
		<ScrollView style={theme.pageContainer}>
			<View style={theme.globalMargins}>
				<View id="buildingInfoCard" style={theme.card}>
					<Image
						style={theme.buildingImagePreview}
						source={require('../../assets/icon.png')}
					/>

					<View
						id="buildingInfoAddress"
						style={{
							display: 'flex',
							alignContent: 'center',
							justifyContent: 'space-between',
							flexDirection: 'row',
							width: '100%',
							marginTop: 17,
						}}
					>
						<Text style={styleVariables.fontSizes.header}>
							{numberAndStreet && numberAndStreet}
						</Text>
						<MaterialCommunityIcons
							name="arrow-top-right"
							size={24}
							color={styleVariables.colors.primary}
						/>
					</View>

					<View
						id="buildingInfoLocation"
						style={{
							display: 'flex',
							alignContent: 'center',
							flexDirection: 'row',
							width: '100%',
							marginTop: 6,
							marginBottom: 4,
						}}
					>
						<MaterialCommunityIcons
							name="map-marker-outline"
							size={18}
							color={styleVariables.colors.primary}
							style={{ marginRight: 8 }}
						/>
						<Text
							style={[
								styleVariables.fontSizes.body,
								{ color: styleVariables.colors.primary },
							]}
						>
							{addressCityProvPostal && addressCityProvPostal}
						</Text>
					</View>
				</View>

				<View id="contacts" style={{ marginTop: 17, padding: 17 }}>
					<Text
						style={[
							styleVariables.fontSizes.secondaryHeader,
							{ marginBottom: 14 },
						]}
					>
						Contacts
					</Text>

					<View>
						<Text
							style={[styleVariables.fontSizes.title, { marginBottom: 10 }]}
						>
							{name}
						</Text>
						<View
							style={{
								display: 'flex',
								alignContent: 'center',
								flexDirection: 'row',
								width: '100%',
								marginTop: 6,
								marginBottom: 4,
								opacity: 0.66,
							}}
						>
							<MaterialCommunityIcons
								name="email-outline"
								size={18}
								color={styleVariables.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<TouchableOpacity
								onPress={() => Linking.openURL(`mailto:${email}`)}
							>
								<Text
									style={[
										styleVariables.fontSizes.body,
										{ color: styleVariables.colors.primary },
									]}
								>
									{email}
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								display: 'flex',
								alignContent: 'center',
								flexDirection: 'row',
								width: '100%',
								marginTop: 6,
								marginBottom: 4,
								opacity: 0.66,
							}}
						>
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
									]}
								>
									{phone}
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
