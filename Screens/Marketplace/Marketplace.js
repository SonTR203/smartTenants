import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { wait } from "../../utils/wait";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { getMarketplaceItems } from "../../utils/Marketplace/marketplace.services";
import Fab from "../../components/Fab";
import MarketplaceItem from "./MarketplaceItem";
import MarketplaceFirstItem from "./MarketplaceFirstItem";

const Marketplace = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [itemList, setItemList] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      // getPosts();
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    (async function fetchNotifications() {
      const list = await getMarketplaceItems();
      // console.log("marketplace items: ", list);
      setItemList(list);
      setRefreshing(false);
    })();
  }, []);

  const styles = StyleSheet.create({
    newsfeedContainer: {
      flex: 1,
      backgroundColor: styleVariables.colors.primary,
      overflow: "hidden",
    },
    loader: {
      flex: 1,
    },
    flatlist: {
      flex: 1,
      paddingLeft: 17,
      paddingRight: 17,
      backgroundColor: "transparent",
    },
    flatListContainer: {
      flex: 1,
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      overflow: "hidden",
      backgroundColor: "white",
    },
  });

  return (
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.flatListContainer}>
        {itemList ? (
          <FlatList
            removeClippedSubviews={true}
            initialNumToRender={3}
            style={styles.flatlist}
            data={itemList.slice(1)}
            numColumns={2}
            keyExtractor={(item, index) => item + index}
            ListHeaderComponent={() => {
              return <MarketplaceFirstItem item={itemList[0]} />;
            }}
            renderItem={({ item, index }) => {
              return (
                <MarketplaceItem
                  item={item}
                  index={index}
                  length={itemList.slice(1).length}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={refreshing}
                style={{
                  backgroundColor: styleVariables.colors.white,
                }}
                tintColor={styleVariables.colors.primary}
              />
            }
          />
        ) : (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={styleVariables.colors.primary}
          />
        )}
      </View>

      {/* FAB */}
      <Fab
        navigation={navigation}
        theme={theme}
        styleVariables={styleVariables}
      />
    </SafeAreaView>
  );
};

export default Marketplace;
