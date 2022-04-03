import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ManageBuildings = () => {
  const colRef = collection(db, 'Buildings');
  const [buildings, setBuildings] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getBuildings = async () => {
    const data = await getDocs(colRef);
    setBuildings(data.docs.map((building) => building.data()));
    setFetching(false);
  };

  useEffect(() => {
    getBuildings();
  }, []);

  console.log(buildings);

  return (
    <View>
      <Text>ManageBuildings</Text>
    </View>
  );
};

export default ManageBuildings;
