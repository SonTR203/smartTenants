import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../../Context/AppContext';

const ManageUsers = ({ navigation }) => {
	const { allUsers } = useAppContext();

	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			<View>
				{allUsers.length > 0 && (
					<FlatList
						data={allUsers}
						keyExtractor={(user) => user.userID}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('ManageUser', { user: item });
								}}
							>
								<AllUsersItem user={item} />
							</TouchableOpacity>
						)}
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

function AllUsersItem(user) {
	user = user.user;
	return (
		<View style={{ marginBottom: 10 }}>
			<Text>{user.firstName + ' ' + user.lastName}</Text>
			<Text>{user.buildingAddress}</Text>
		</View>
	);
}

export default ManageUsers;
