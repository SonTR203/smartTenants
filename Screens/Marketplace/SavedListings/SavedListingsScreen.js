import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useAppContext } from "../../../Context/AppContext";
import { getMarketplaceItems } from "../../../utils/firebase.services";
import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";

function SavedListingsScreen({ navigation }) {
  const { currentUser, setCurrentMarketplacePost } = useAppContext();
  const [data, setData] = useState(undefined);

  useEffect(async () => {
    const list = await getMarketplaceItems();
    const mySavedListings = list.filter((item) =>
      item.isSavedBy.includes(currentUser.userID)
    );

    mySavedListings ? setData(mySavedListings) : setData([]);
  }, []);

  const renderSavedItems = ({ item }) => {
    const handleUnSaved = () => {
      const updateSavedList = item.isSavedBy.filter(
        (item) => item !== currentUser.userID
      );
      setCurrentMarketplacePost({
        ...item,
        isSavedBy: updateSavedList,
        updated: true,
      });

      const updatedSavedListings = data.filter(
        (listing) => listing.id !== item.id
      );
      setData(updatedSavedListings);
    };

    return (
      <MarketplaceFirstItem
        handleUnSaved={handleUnSaved}
        saved={true}
        item={item}
        navigation={navigation}
      />
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
