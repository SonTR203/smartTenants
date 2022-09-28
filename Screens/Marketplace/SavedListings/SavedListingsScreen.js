import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useAppContext } from "../../../Context/AppContext";
import {
  getMarketplaceItems,
  updateItemInFirestore,
} from "../../../utils/firebase.services";
import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";
import { useTheme } from "../../../ThemeContext";

function SavedListingsScreen({ navigation }) {
  const {
    currentUser,
    setCurrentMarketplacePost,
    currentMarketplacePost,
    updatedMarketplacePosts,
    setUpdatedMarketplacePosts,
  } = useAppContext();
  const [data, setData] = useState(undefined);
  const { styleVariables } = useTheme();

  /**
   * Update the list whenever the user saves/unsaves a Marketplace post.
   */
  useEffect(() => {
    if (updatedMarketplacePosts && updatedMarketplacePosts.length > 0) {
      const updatedItemList = data
        .map((item) => {
          // if the item is the one that was updated, return the updated item
          // else, return the original item in the list
          if (item.id === currentMarketplacePost.id) {
            return currentMarketplacePost;
          }
          return item;
        })
        // filter to only show items that are saved by the current user
        .filter((item) => item.isSavedBy.includes(currentUser.userID));

      setUpdatedMarketplacePosts([]);
      setData(updatedItemList);
    }
  }, [updatedMarketplacePosts]);

  useEffect(() => {
    async function setSavedListings() {
      const list = await getMarketplaceItems();
      const mySavedListings = list.filter((item) =>
        item.isSavedBy.includes(currentUser.userID)
      );

      mySavedListings ? setData(mySavedListings) : setData([]);
    }
    setSavedListings();
  }, []);

  const renderSavedItems = ({ item }) => {
    const handleUnSaved = async () => {
      const updateSavedList = item.isSavedBy.filter(
        (item) => item !== currentUser.userID
      );

      const res = await updateItemInFirestore("Marketplace", item.id, {
        isSavedBy: updateSavedList,
      });
      if (!res) {
        Alert.alert("Error", "Failed to unsave item. Please try again later");
        return;
      }
      setCurrentMarketplacePost({
        ...item,
        isSavedBy: updateSavedList,
        updated: true,
      });

      const updatedSavedListings = data.filter(
        (listing) => listing.id !== item.id
      );
      setData(updatedSavedListings);

      // add the updated item to the updatedMarketplacePosts array
      setUpdatedMarketplacePosts([
        ...updatedMarketplacePosts,
        {
          ...item,
          isSavedBy: updateSavedList,
        },
      ]);
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

  const renderListEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: styleVariables.colors.black }}>
          You have no saved listings
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        ListEmptyComponent={renderListEmpty}
        data={data}
        renderItem={renderSavedItems}
      />
    </View>
  );
}

export default SavedListingsScreen;
