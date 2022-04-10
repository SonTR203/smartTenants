import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../../Context/AppContext';

const ManageBuildings = ({ navigation }) => {
	const colRef = collection(db, 'Buildings');
	const { buildings, setBuildings } = useAppContext();
	const [fetching, setFetching] = useState(true);

	const getBuildings = async () => {
		const data = await getDocs(colRef);
		setBuildings(
			data.docs.map((building) => {
				let buildingDocId = building._key.path.segments[6];

				return (building = {
					...building.data(),
					buildingDocId,
				});
			})
		);
		setFetching(false);
	};

	useEffect(() => {
		getBuildings();
	}, []);

	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			{fetching && <ActivityIndicator />}
			<View>
				{buildings.length > 0 && (
					<FlatList
						data={buildings}
						// buildingName is temp. should be id
						keyExtractor={(building) => building.buildingName}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('ManageBuilding', { building: item });
								}}
							>
								<BuildingsItem building={item} />
							</TouchableOpacity>
						)}
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

function BuildingsItem(building) {
	building = building.building;
	return (
		<View style={{ marginBottom: 10 }}>
			<Text>{building.buildingAddress}</Text>
		</View>
	);
}

export default ManageBuildings;
