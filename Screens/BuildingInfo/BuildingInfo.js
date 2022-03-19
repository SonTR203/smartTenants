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

// Import DB from Firestore config file
import { db } from '../../firebase-config';

// Import required functions
import { collection, getDocs } from '@firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

const BuildingInfo = () => {
	const [theme, styleVariables] = useTheme();

	const [building, setBuilding] = useState({});
	let userBuilding = 'hGNLpcFncmAy3RokTThv';
	useEffect(() => {
		// Get collections data
		getDocs(colRef).then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (doc.id == userBuilding) {
					setBuilding({ ...doc.data(), id: doc.id });
				} else {
					alert('No building found');
				}
			});
		});
	}, []);

	console.log(building);

	let image = building.buildingImage;
	let address = building.buildingAddress;
	let location = building.buildingLocation;
	let name = building.fullName;
	let email = building.email;
	let phone = building.phone;

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

	return (
		<ScrollView style={theme.pageContainer}>
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
					<Text style={styleVariables.fontSizes.header}>{address}</Text>
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
						{location}
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
					<Text style={[styleVariables.fontSizes.title, { marginBottom: 10 }]}>
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
		</ScrollView>
	);
};

export default BuildingInfo;
