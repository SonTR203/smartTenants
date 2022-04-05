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
import { ScrollView } from 'react-native-gesture-handler';

const ManageBuildings = ({ navigation }) => {
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
    <SafeAreaView>
      <StatusBar style="auto" />
      <ScrollView>
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
      </ScrollView>
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
