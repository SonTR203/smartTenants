import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { wait } from "../../utils/wait";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import Fab from "../../components/Fab";
import MarketplaceItem from "./MarketplaceItem";
import MarketplaceFirstItem from "./MarketplaceFirstItem";
import ListFooter from "../Newsfeed/ListFooter";
import { getMarketplaceItems } from "../../utils/firebase.services";
import { useAppContext } from "../../Context/AppContext";
import { Entypo } from "@expo/vector-icons";

const MarketplaceScreen = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [itemList, setItemList] = useState(null);
  const { currentUser, marketplaceBadges } = useAppContext();

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

  const handleNavigate = () => {
    navigation.navigate("MessagesListScreen", {
      userId: currentUser.userID,
    });
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
  });

  return (
    // CONTAINER
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />

      {/* ITEM LIST  */}
      <View style={styles.flatListContainer}>
        {itemList ? (
          <FlatList
            removeClippedSubviews={true}
            initialNumToRender={3}
            style={styles.flatlist}
            data={itemList.slice(1)} // remove first item from list, put first item in Header
            numColumns={2}
            keyExtractor={(item, index) => item + index}
            ListHeaderComponent={() => {
              return (
                <>
                  <TouchableOpacity
                    onPress={handleNavigate}
                    style={{
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
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#395E66",
                          fontSize: 22,
                          lineHeight: 28,
                          marginLeft: 6,
                          fontWeight: "500",
                        }}
                      >
                        Messages
                      </Text>
                      {marketplaceBadges.unseen.length > 0 ? (
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            marginLeft: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            backgroundColor: "#395E66",
                            borderRadius: 20,

                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "400",
                              color: "white",
                              fontSize: 13,
                              lineHeight: 18,
                            }}
                          >
                            {marketplaceBadges.unseen.length}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Entypo
                      name="chevron-small-right"
                      size={40}
                      color="#395E66"
                    />
                  </TouchableOpacity>
                  <MarketplaceFirstItem
                    item={itemList[0]}
                    navigation={navigation}
                  />
                </>
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
