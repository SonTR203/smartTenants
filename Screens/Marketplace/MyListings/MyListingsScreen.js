import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import AvailableListings from "./AvailableListings";
import ScreenSelector from "./ScreenSelector";
import { useAppContext } from "../../../Context/AppContext";
import { getMarketplaceItems } from "../../../utils/firebase.services";

function MyListingsScreen() {
  const [available, setAvailable] = useState(true);
  const [myListings, setMyListings] = useState(undefined);
  const { currentUser } = useAppContext();

  useEffect(async () => {
    const list = await getMarketplaceItems();
    const myListingList = list.filter(
      (item) => item.userID === currentUser.userID
    );
    myListingList ? setMyListings(myListingList) : setMyListings([]);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScreenSelector available={available} setAvailable={setAvailable} />
      {available ? <AvailableListings data={myListings} /> : <Text>Sold</Text>}
    </View>
  );
}

export default MyListingsScreen;
