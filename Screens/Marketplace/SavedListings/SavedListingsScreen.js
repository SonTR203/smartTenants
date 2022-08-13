import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useAppContext } from "../../../Context/AppContext";
import { getMarketplaceItems } from "../../../utils/firebase.services";
import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";

function SavedListingsScreen({ navigation }) {
  const { currentUser } = useAppContext();
  const [data, setData] = useState(undefined);

  useEffect(async () => {
    const list = await getMarketplaceItems();
    const mySavedListings = list.filter((item) =>
      item.isSavedBy.includes(currentUser.userID)
    );

    mySavedListings ? setData(mySavedListings) : setData([]);
  }, []);

  const renderSavedItems = ({ item }) => {
    return (
      <MarketplaceFirstItem saved={true} item={item} navigation={navigation} />
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList data={data} renderItem={renderSavedItems} />
    </View>
  );
}

export default SavedListingsScreen;
