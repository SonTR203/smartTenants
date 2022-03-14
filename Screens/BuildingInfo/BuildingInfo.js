import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	ScrollView,
	Image,
} from 'react-native';

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
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View>
					<Image
						style={{ width: 300, height: 300, alignSelf: 'center' }}
						source={{
							uri: 'https://dummyimage.com/800',
						}}
					/>
					<Text style={styles.title}>123 Robinson Road</Text>
					<Text style={styles.title}>Ottawa, Ontario, CA KIK 5T9</Text>
				</View>
				<View>
					<Text style={styles.title}>CONTACTS</Text>
					{/* Flatlist will go here */}
					<View>
						<Text style={styles.title}>Santino Santino</Text>
						<Text style={styles.title}>santino@gmail.com</Text>
						<Text style={styles.title}>6136136136</Text>
					</View>
					<View>
						<Text style={styles.title}>Santino Santino</Text>
						<Text style={styles.title}>santino@gmail.com</Text>
						<Text style={styles.title}>6136136136</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default BuildingInfo;
