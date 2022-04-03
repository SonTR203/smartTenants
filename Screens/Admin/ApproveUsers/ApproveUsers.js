import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ApproveUsers = () => {
  const colRef = collection(db, 'Users');
  const [unauthorizedUsers, setUnauthorizedUsers] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getUsers = async () => {
    const data = await getDocs(colRef);
    const users = data.docs.map((user) => user.data());
    setUnauthorizedUsers(users.filter((user) => !user.tenantAuthorized));
    setFetching(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  console.log(unauthorizedUsers);

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <View>
        {fetching ? <ActivityIndicator /> : null}
        {/* {unauthorizedUsers.length > 0 && (
          <FlatList
            data={unauthorizedUsers}
            keyExtractor={(user) => user.userID}
            renderItem={({ user }) => (
              <View>
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
                <Text>{`${user.buildingAddress}`}</Text>
              </View>
            )}
          />
        )} */}
      </View>
    </SafeAreaView>
  );
};

export default ApproveUsers;
