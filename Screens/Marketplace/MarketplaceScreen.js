import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  Animated,
} from "react-native";
import { wait } from "../../utils/wait";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import Fab from "../../components/Fab";
import ListFooter from "../Newsfeed/ListFooter";
import { listenForNewListing } from "../../utils/Marketplace/marketplace.services";
import { getMarketplaceItems } from "../../utils/firebase.services";
import { useAppContext } from "../../Context/AppContext";
import EmptyListComponent from "../../components/EmptyListComponent";
import { refreshDelay } from "../../utils/constants";
import FlatListRefreshControl from "../../components/FlatListRefreshControl";
import MarketplaceFirstItem from "./MarketplaceItem/MarketplaceFirstItem";
import MarketplaceItem from "./MarketplaceItem/MarketplaceItem";
import SortSVG from "../../components/Icons/SortSVG";
import FilterSVG from "../../components/Icons/FilterSVG";
import Modal from "react-native-modal";
import FilterModal from "../../components/FilterModal";
import SortModal from "../../components/SortModal";

const MarketplaceScreen = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [itemList, setItemList] = useState(null);
  const [filteredItemList, setFilteredItemList] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [sortingBy, setSortingBy] = useState("Date(newest)");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [distance, setDistance] = useState("100");
  const [listingAmount, setListingAmount] = useState("0");
  const [sortActive, setSortActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [newPostsLength, setNewPostsLength] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const slideDown = useRef(new Animated.Value(-100)).current;
  let flatListRef;
  const {
    updatedMarketplacePosts,
    setUpdatedMarketplacePosts,
    currentUserBuilding,
  } = useAppContext();
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    console.log("run");
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetAnimation();
    wait(refreshDelay).then(async () => {
      const list = await getMarketplaceItems();
      const listWithDistance = list.map((item) => {
        if (!item) return;
        const distance = getDistanceFromLatLonInKm(
          currentUserBuilding.location.latitude,
          currentUserBuilding.location.longitude,
          item.buildingCoord.latitude,
          item.buildingCoord.longitude
        );
        return { ...item, distance: distance };
      });
      console.log(listWithDistance);
      setItemList(listWithDistance);
      setRefreshing(false);
    });
  }, []);
  const startAnimation = () => {
    Animated.spring(slideDown, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const resetAnimation = () => {
    Animated.spring(slideDown, {
      toValue: -100,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // only fetching available items, not sold items
  async function fetchMarketplaceList() {
    const list = await getMarketplaceItems();
    const listWithDistance = list.map((item) => {
      if (!item) return;
      const distance = getDistanceFromLatLonInKm(
        currentUserBuilding.location.latitude,
        currentUserBuilding.location.longitude,
        item.buildingCoord.latitude,
        item.buildingCoord.longitude
      );
      return { ...item, distance: distance };
    });
    const avaialbleListings = listWithDistance.filter((item) => {
      return !item.isSold;
    });
    setItemList(avaialbleListings);
    setRefreshing(false);
  }

  // get most popular marketplace item
  const getMostPopularItem = () => {
    let sortedListByClicks = itemList.sort((a, b) => {
      return b.clicks - a.clicks;
    });
    return sortedListByClicks[0];
  };
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
  useEffect(() => {
    const unsubscribe = listenForNewListing(setNewPostsLength);
    return () => {
      unsubscribe();
    };
  }, []);
  // new itemList button animation handler
  useEffect(() => {
    if (refreshing) return;
    if (newPostsLength > itemList.length) {
      startAnimation();
    }
  }, [newPostsLength, itemList]);
  const renderEmpty = () => {
    if (itemList.length === 1) {
      return null;
    }
    return <EmptyListComponent screenName={"marketplace"} />;
  };

  // Toast handler
  const displayModal = () => {
    if (route.params?.immediately)
      return setToastVisible(route.params?.saveModal === true ? true : false);
    window.setTimeout(() => {
      return setToastVisible(route.params?.saveModal === true ? true : false);
    }, 400);
  };

  useEffect(() => {
    displayModal();
  }, [route.params]);
  const renderListHeader = () => {
    return (
      <>
        <View style={styles.filterSort}>
          <TouchableOpacity
            onPress={() => {
              setSortModalVisible(true);
            }}
            style={[
              styles.headerBtn,
              sortActive ? styles.activeCondition : null,
            ]}
            activeOpacity={1}>
            <Text
              style={[styles.btnText, styleVariables.fontSizes.calloutBold]}>
              Sort
            </Text>
            <SortSVG />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFilterModalVisible(true);
            }}
            style={[
              styles.filterBtn,
              styles.headerBtn,
              filterActive ? styles.activeCondition : null,
            ]}
            activeOpacity={1}>
            <Text
              style={[styles.btnText, styleVariables.fontSizes.calloutBold]}>
              Filter
            </Text>
            <FilterSVG />
          </TouchableOpacity>
        </View>
        <MarketplaceFirstItem
          isPopular={true}
          item={getMostPopularItem()}
          navigation={navigation}
        />
      </>
    );
  };

  const renderListFooter = () => {
    if (itemList.length > 0) {
      return (
        <ListFooter
          styleVariables={styleVariables}
          theme={theme}
          isMarketplace={true}
        />
      );
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
    filterSort: {
      display: "flex",
      flexDirection: "row",
      paddingTop: 16,
      paddingHorizontal: 8,
    },
    headerBtn: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ebeff0",
      marginHorizontal: 8,
      borderRadius: 8,
      paddingVertical: 8,
    },
    btnText: {
      marginRight: 8,
      color: styleVariables.colors.primary,
    },
    modal: {
      display: "flex",
      justifyContent: "flex-end",
      margin: 0,
    },
    activeCondition: {
      backgroundColor: "#CDD7D9",
    },
    newPostsButtonContainer: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "7.5%",
      zIndex: 2,
    },
    newPostsButton: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: 36,
      backgroundColor: "#29AA6B",
      paddingVertical: 8,
      paddingHorizontal: 24,
      gap: 8,
      borderRadius: 16,
    },
  });

  return (
    // CONTAINER
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />
      {/* SUCCESS / ERROR TOAST */}
      <Modal
        animationType="slide"
        transparent={true}
        // statusBarTranslucent={true}
        visible={toastVisible}
        onRequestClose={() => {
          navigation.setParams({
            saveModal: false,
            reload: null,
            immediately: null,
          });
        }}
        onShow={() => {
          setTimeout(() => {
            navigation.setParams({
              saveModal: false,
              reload: null,
              immediately: null,
            });
          }, 2000);
        }}>
        <PopupModal
          inlineStyles={{ width: "100%", bottom: -20 }}
          modalType={route.params?.modalType}
          message={route.params?.message}
          hideModal={() => {
            navigation.setParams({
              saveModal: false,
              reload: null,
              immediately: true,
            });
          }}
        />
      </Modal>
      {/* SORT MODAL */}
      <Modal
        backdropOpacity={0.5}
        isVisible={sortModalVisible}
        style={styles.modal}
        onBackdropPress={() => {
          setSortModalVisible(false);
        }}
        statusBarTranslucent={true}>
        <SortModal
          setSortModalVisible={setSortModalVisible}
          marketplaceData={itemList}
          filteredItemList={filteredItemList}
          setFilteredItemList={setFilteredItemList}
          sortingBy={sortingBy}
          setSortingBy={setSortingBy}
          setSortActive={setSortActive}
        />
      </Modal>
      {/* FILTER MODAL */}
      <Modal
        backdropOpacity={0.5}
        isVisible={filterModalVisible}
        style={styles.modal}
        onBackdropPress={() => setFilterModalVisible(false)}
        statusBarTranslucent={true}>
        <FilterModal
          marketplaceData={itemList}
          setFilteredItemList={setFilteredItemList}
          setFilterModalVisible={setFilterModalVisible}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          distance={distance}
          setDistance={setDistance}
          listingAmount={listingAmount}
          setListingAmount={setListingAmount}
          setFilterActive={setFilterActive}
        />
      </Modal>
      {/* ITEM LIST  */}
      <View style={styles.flatListContainer}>
        {itemList ? (
          <>
            <FlatListRefreshControl refreshing={refreshing} />
            <Animated.View
              style={[
                styles.newPostsButtonContainer,
                {
                  transform: [{ translateY: slideDown }],
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  resetAnimation();
                  flatListRef.scrollToOffset({ offset: 0, animated: true });
                  setRefreshing(true);
                  fetchMarketplaceList();
                }}
                activeOpacity={1}
                style={styles.newPostsButton}>
                <Text
                  style={[
                    { color: "#fff" },
                    styleVariables.fontSizes.calloutBold,
                  ]}>
                  New posts
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <FlatList
              ListEmptyComponent={renderEmpty}
              removeClippedSubviews={true}
              initialNumToRender={3}
              style={styles.flatlist}
              ref={(ref) => (flatListRef = ref)}
              data={
                filteredItemList ? filteredItemList.slice(1) : itemList.slice(1)
              } // remove first item from list, put first item in Header
              numColumns={2}
              keyExtractor={(item, index) => item + index}
              ListHeaderComponent={renderListHeader}
              renderItem={renderMarketplaceItems}
              ListFooterComponent={renderListFooter}
              refreshControl={
                <RefreshControl
                  tintColor="transparent"
                  progressBackgroundColor="white"
                  colors={[styleVariables.colors.primary]}
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
