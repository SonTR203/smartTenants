import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { wait } from "../../utils/wait";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import Fab from "../../components/Fab";
import ListFooter from "../Newsfeed/ListFooter";
import { getMarketplaceItems } from "../../utils/firebase.services";
import { useAppContext } from "../../Context/AppContext";
import { Entypo } from "@expo/vector-icons";
import EmptyListComponent from "../../components/EmptyListComponent";
import { refreshDelay } from "../../utils/constants";
import FlatListRefreshControl from "../../components/FlatListRefreshControl";
import MarketplaceFirstItem from "./MarketplaceItem/MarketplaceFirstItem";
import MarketplaceItem from "./MarketplaceItem/MarketplaceItem";

const MarketplaceScreen = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [itemList, setItemList] = useState(null);
  const { currentUser, updatedMarketplacePosts, setUpdatedMarketplacePosts } =
    useAppContext();

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(refreshDelay).then(async () => {
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

  /**
   * Whenever the user save/unsave a Marketplace post,
   * "updatedMarketplacePosts" is updated to be the changed item.
   * useEffect is used to listen to these changes to "updatedMarketplacePosts".
   *
   * We then find that changed item in the list and update the list with
   * the newest data.
   */
  useEffect(() => {
    if (updatedMarketplacePosts && updatedMarketplacePosts.length > 0) {
      // find and replace item in list
      const updatedItemList = itemList.map((item) => {
        // if the item is the one that was updated, return the updated item
        // else, return the original item
        return updatedMarketplacePosts.find((i) => i.id === item.id) ?? item;
      });

      setUpdatedMarketplacePosts([]);
      setItemList(updatedItemList);
    }
  }, [updatedMarketplacePosts]);

  useEffect(() => {
    if (route.params && route.params.reload) {
      setRefreshing(true);
      fetchMarketplaceList();
    }
  }, [route.params]);

  const handleNavigate = () => {
    navigation.navigate("MessagesListScreen", {
      userId: currentUser.userID,
    });
  };

  const renderEmpty = () => {
    return <EmptyListComponent screenName={"marketplace"} />;
  };

  const renderListHeader = () => {
    return (
      <>
        <TouchableOpacity
          onPress={handleNavigate}
          style={styles.messageContainer}
        >
          <View style={styles.messageView}>
            <Text style={styles.messageText}>Messages</Text>
          </View>

          <Entypo name="chevron-small-right" size={40} color="#395E66" />
        </TouchableOpacity>
        <MarketplaceFirstItem item={itemList[0]} navigation={navigation} />
      </>
    );
  };

  const renderListFooter = () => {
    if (itemList.length > 0) {
      return <ListFooter styleVariables={styleVariables} theme={theme} />;
    } else {
      return null;
    }
  };

  const renderMarketplaceItems = ({ item, index }) => {
    return (
      <MarketplaceItem item={item} index={index} navigation={navigation} />
    );
  };

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
    messageContainer: {
      margin: 16,
      backgroundColor: "white",
      padding: 16,
      borderRadius: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    messageView: {
      flexDirection: "row",
      alignItems: "center",
    },
    messageText: {
      color: "#395E66",
      fontSize: 22,
      lineHeight: 28,
      marginLeft: 6,
      fontWeight: "500",
    },
  });

  return (
    // CONTAINER
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />

      {/* ITEM LIST  */}
      <View style={styles.flatListContainer}>
        {itemList ? (
          <>
            <FlatListRefreshControl refreshing={refreshing} />
            <FlatList
              ListEmptyComponent={renderEmpty}
              removeClippedSubviews={true}
              initialNumToRender={3}
              style={styles.flatlist}
              data={itemList.slice(1)} // remove first item from list, put first item in Header
              numColumns={2}
              keyExtractor={(item, index) => item + index}
              ListHeaderComponent={renderListHeader}
              renderItem={renderMarketplaceItems}
              ListFooterComponent={renderListFooter}
              refreshControl={
                <RefreshControl
                  tintColor="transparent"
                  colors={["transparent"]}
                  style={{ backgroundColor: "transparent" }}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                />
              }
            />
          </>
        ) : (
          <FlatListRefreshControl refreshing={refreshing} />
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
