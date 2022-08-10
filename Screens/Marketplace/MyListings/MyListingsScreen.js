import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ScreenSelector from "./ScreenSelector";
import { useAppContext } from "../../../Context/AppContext";
import { getMarketplaceItems } from "../../../utils/firebase.services";
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScreenSelector available={available} setAvailable={setAvailable} />
      <DynamicListingDisplay
        avaialble={available}
        setData={available ? setAvailableListings : setSoldListings}
        data={available ? availableListings : soldListings}
      />
    </View>
  );
}

export default MyListingsScreen;
