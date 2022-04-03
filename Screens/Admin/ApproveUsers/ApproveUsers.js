import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ApproveUsers = ({ route, navigation }) => {
  const { unauthorizedUsers } = route.params;

  // unauthorizedUsers.forEach((user) => console.log(user.firstName));

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  // const Item = ({ title }) => (
  //   <View style={styles.item}>
  //     <Text style={styles.title}>{title}</Text>
  //   </View>
  // );
  // const renderItem = ({ item }) => <Item title={item.title} />;

  // const Item = ({ firstName, lastName, address }) => (
  //   <View>
  //     <Text>{`${firstName} ${lastName}`}</Text>
  //     <Text>{`${address}`}</Text>
  //   </View>
  // );

  // const renderItem = ({ user }) => (
  //   <Item
  //     firstName={user.firstName}
  //     lastName={user.lastName}
  //     address={user.buildingAddress}
  //   />
  // );

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
