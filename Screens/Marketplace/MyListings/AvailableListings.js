import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";

import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";

function AvailableListings({ navigation, data }) {
  const renderMyListings = ({ item }) => {
    return (
      <MarketplaceFirstItem own={true} item={item} navigation={navigation} />
    );
  };

  if (!data) {
    return (
      <Text
        style={{
          textAlign: "center",
        }}
      >
        Loading...
      </Text>
    );
  }
  return (
    <FlatList
      data={data}
      renderItem={renderMyListings}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={() => <Text>You have no listing available</Text>}
    />
  );
}

export default AvailableListings;
