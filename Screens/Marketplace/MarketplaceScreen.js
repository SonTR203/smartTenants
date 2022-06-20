import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
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
import ListFooter from "../Newsfeed/ListFooter";

const MarketplaceScreen = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [itemList, setItemList] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(async () => {
      const list = await getMarketplaceItems();
      setItemList(list);
      setRefreshing(false);
    });
  }, []);

  async function fetchMarketplaceList() {
    const list = await getMarketplaceItems();
    setItemList(list);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchMarketplaceList();
  }, []);

  useEffect(() => {
    if (route.params && route.params.reload) {
      setRefreshing(true);
      fetchMarketplaceList();
    }
  }, [route.params]);

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
              return (
                <MarketplaceFirstItem
                  item={itemList[0]}
                  navigation={navigation}
                />
              );
            }}
            renderItem={({ item, index }) => {
              return (
                <MarketplaceItem
                  item={item}
                  index={index}
                  navigation={navigation}
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
            ListFooterComponent={
              <ListFooter styleVariables={styleVariables} theme={theme} />
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
        route={"CreateMarketplaceItem"}
        navigation={navigation}
        theme={theme}
        styleVariables={styleVariables}
      />
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
