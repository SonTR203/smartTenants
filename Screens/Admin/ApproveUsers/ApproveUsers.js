import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ApproveUsers = ({ route, navigation }) => {
	const { unauthorizedUsers } = route.params;

	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			<View>
				{console.log(unauthorizedUsers)}
				{unauthorizedUsers.length > 0 && (
					<FlatList
						data={unauthorizedUsers}
						keyExtractor={(user) => user.userID}
						renderItem={({ item }) => (
							<UnauthorizedUserItem user={item} navigation={navigation} />
						)}
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

function UnauthorizedUserItem(user) {
	user = user.user;
	return (
		<TouchableOpacity>
			<View style={{ marginBottom: 10 }}>
				<Text>{user.firstName + ' ' + user.lastName}</Text>
				<Text>{user.buildingAddress}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
});

export default ApproveUsers;
