import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	ScrollView,
	Image,
} from 'react-native';

// Import DB from Firestore config file
import { db } from '../../firebase-config';

// Import required functions
import { collection, getDocs } from '@firebase/firestore';

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

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View>
					<Image
						style={{ width: 300, height: 300, alignSelf: 'center' }}
						source={{
							uri: image,
						}}
					/>
					<Text style={styles.title}>{address}</Text>
					<Text style={styles.title}>{location}</Text>
				</View>
				<View>
					<Text style={styles.title}>CONTACTS</Text>
					<View>
						<Text style={styles.title}>{name}</Text>
						<Text style={styles.title}>{email}</Text>
						<Text style={styles.title}>{phone}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default BuildingInfo;
