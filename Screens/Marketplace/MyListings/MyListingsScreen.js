import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import ScreenSelector from "./ScreenSelector";
import { useAppContext } from "../../../Context/AppContext";
import {
  getMarketplaceItems,
  updateItemInFirestore,
} from "../../../utils/firebase.services";
import DynamicListingDisplay from "./DynamicListingDisplay";

function MyListingsScreen() {
  const [available, setAvailable] = useState(true);
  const [availableListings, setAvailableListings] = useState(undefined);
  const [soldListings, setSoldListings] = useState(undefined);
  const { currentUser } = useAppContext();

  useEffect(async () => {
    const list = await getMarketplaceItems();
    const myListingList = list.filter(
      (item) => item.userID === currentUser.userID && !item.isSold
    );
    const mySoldListingList = list.filter(
      (item) => item.userID === currentUser.userID && item.isSold
    );

    myListingList
      ? setAvailableListings(myListingList)
      : setAvailableListings([]);
    mySoldListingList
      ? setSoldListings(mySoldListingList)
      : setSoldListings([]);
  }, []);

  const handleSetListingSold = async (selectedItem) => {
    // console.log(selectedItem);
    const res = await updateItemInFirestore("Marketplace", selectedItem, {
      isSold: true,
    });
    if (!res) {
      Alert.alert("Somethign went wrong");
    } else {
      const newDataList = setAvailableListings.filter(
        (item) => item.id !== selectedItem.id
      );
      setAvailableListings(newDataList);
      setSoldListings([...soldListings, selectedItem]);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScreenSelector available={available} setAvailable={setAvailable} />
      <DynamicListingDisplay
        handleSetListingSold={handleSetListingSold}
        avaialble={available}
        setData={available ? setAvailableListings : setSoldListings}
        data={available ? availableListings : soldListings}
      />
    </View>
  );
}

export default MyListingsScreen;
