//https://www.youtube.com/watch?v=aSOsfpsMriI

import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../firebase-config';

const colRef = collection(db, 'Buildings');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const ModalPicker = (props) => {
	const [buildings, setBuildings] = useState([]);
	const onPressItem = (building) => {
		props.changeModalVisibility(false);
		props.setData(building);
	};

	const building = buildings.map((item, index) => {
		return (
			<TouchableOpacity key={index} onPress={() => onPressItem(item)}>
				<Text>{item.buildingAddress.stringValue}</Text>
			</TouchableOpacity>
		);
	});

	useEffect(() => {
		getBuildings();
	}, []);

	const getBuildings = async () => {
		const data = await getDocs(colRef);
		setBuildings(
			data.docs.map((item) => ({
				...item._document.data.value.mapValue.fields,
				id: item._key.path.segments[6],
			}))
		);
	};

	return (
		<TouchableOpacity
			onPress={() => props.changeModalVisibility(false)}
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<View
				style={[
					{ backgroundColor: 'grey' },
					{ width: WIDTH - 20 },
					{ height: HEIGHT - 20 },
					{ borderRadius: 20 },
				]}
			>
				<ScrollView>{building}</ScrollView>
			</View>
		</TouchableOpacity>
	);
};

export default ModalPicker;
