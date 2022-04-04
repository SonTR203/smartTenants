import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ApproveUsers = ({ route, navigation }) => {
  const { unauthorizedUsers } = route.params;

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <View>
        {unauthorizedUsers.length > 0 && (
          <FlatList
            data={unauthorizedUsers}
            keyExtractor={(user) => user.userID}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ConfirmUser', { user: item });
                }}
              >
                <UnauthorizedUserItem user={item} />
              </TouchableOpacity>
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
    <View style={{ marginBottom: 10 }}>
      <Text>{user.firstName + ' ' + user.lastName}</Text>
      <Text>{user.buildingAddress}</Text>
    </View>
  );
}

export default ApproveUsers;
