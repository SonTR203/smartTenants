import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import ScreenSelector from "./ScreenSelector";
import { useAppContext } from "../../../Context/AppContext";
import {
  getMarketplaceItems,
  updateItemInFirestore,
} from "../../../utils/firebase.services";
import DynamicListingDisplay from "./DynamicListingDisplay";
import { Timestamp } from "@firebase/firestore";

function MyListingsScreen() {
  const [available, setAvailable] = useState(true);
  const [availableListings, setAvailableListings] = useState(undefined);
  const [soldListings, setSoldListings] = useState(undefined);
  const { currentUser } = useAppContext();

  useEffect(() => {
    async function setMarketplaceListings() {
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
    }
    setMarketplaceListings();
  }, []);

  const handleSetListingSold = async (selectedItem) => {
    const res = await updateItemInFirestore("Marketplace", selectedItem.id, {
      isSold: true,
      soldDate: Timestamp.fromDate(new Date()),
    });
    if (!res) {
      Alert.alert("Something went wrong");
      return;
    }
    const updatedItem = {
      ...selectedItem,
      isSold: true,
    };
    const newDataList = availableListings.filter(
      (item) => item.id !== selectedItem.id
    );
    const newSoldListings = soldListings
      ? [...soldListings, updatedItem]
      : [updatedItem];
    setAvailableListings(newDataList);
    setSoldListings(newSoldListings);
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
        available={available}
        setData={available ? setAvailableListings : setSoldListings}
        data={available ? availableListings : soldListings}
      />
    </View>
  );
}

export default MyListingsScreen;
