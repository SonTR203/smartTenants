import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import _ from "lodash";

function MessagesListScreen({ navigation }) {
  const [buyingList, setBuyingList] = useState([]);
  const [sellingList, setSellingList] = useState([]);
  const [messageListFilter, setMessageListFilter] = useState("Buying");
  const { currentUser, marketplaceBadges } = useAppContext();
  const { styleVariables } = useTheme();

  useEffect(() => {
    // console.log("marketplace screen list: ", marketplaceBadges.list.length);
    if (marketplaceBadges.list.length > 0) {
      const sortedListOfNotifications = _.sortBy(
        marketplaceBadges.list,
        "timestamp"
      ).reverse();
      const buyerList = sortedListOfNotifications.filter(
        (item) => currentUser.userID == item.buyerId
      );
      const sellerList = sortedListOfNotifications.filter(
        (item) => currentUser.userID == item.sellerId
      );
      console.log("Buyers:", buyerList);
      // console.log("Sellers:", sellerList);
      setSellingList(sellerList);
      setBuyingList(buyerList);
    }
  }, [marketplaceBadges.list]);

  const handleNavigateToPrivateMessagingScreen = async (
    otherPersonName,
    otherPersonId,
    channelId,
    messageImage,
    itemTitle,
    sellerId,
    price,
    isSold,
    marketplacePostId
  ) => {
    const isSeller = currentUser.userID == sellerId;
    navigation.navigate("PrivateMessagingScreen", {
      otherPersonName: otherPersonName,
      otherPersonId: otherPersonId,
      channelId: channelId,
      messageImage: messageImage,
      itemTitle: itemTitle,
      isSeller: isSeller,
      price: price,
      isSold: isSold,
      marketplacePostId: marketplacePostId,
    });
  };

  function configureItemTime(time) {
    let timestamp = time * 1000;
    let date = new Date(timestamp).toTimeString().split(":");
    if (date[0] > 12) {
      return `${date[0] - 12}:${date[1]}pm`;
    } else {
      return `${date[0]}:${date[1]}am`;
    }
  }

  const renderItem = ({ item }) => {
    const otherPersonName =
      item.sellerId === currentUser.userID ? item.buyerName : item.sellerName;
    const otherPersonId =
      item.sellerId === currentUser.userID ? item.buyerId : item.sellerId;
    return item.lastMessage ? (
      <View style={[styles.itemContainer]}>
        <TouchableOpacity
          onPress={() => {
            handleNavigateToPrivateMessagingScreen(
              otherPersonName,
              otherPersonId,
              item.id,
              item.messageImage,
              item.title,
              item.sellerId,
              item.price,
              item.isSold,
              item.marketplacePostId
            );
          }}
          style={styles.itemTouchable}
        >
          <Image style={styles.itemImage} source={{ uri: item.messageImage }} />

          <View style={styles.itemTextContainer}>
            <View style={styles.flexApart}>
              <View style={styles.flexApart}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.isSold == true ? (
                  <View style={styles.isSoldView}>
                    <Text style={styles.isSoldText}>Sold</Text>
                  </View>
                ) : null}
              </View>
              {item.lastMessage ? (
                <Text style={styles.itemTimestamp}>
                  {configureItemTime(item.lastMessage.timestamp.seconds)}
                </Text>
              ) : null}
            </View>
            <Text style={styles.itemPersonName}>{otherPersonName}</Text>
            <View style={styles.flexApart}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.itemContent}
              >
                {item.lastMessage.content}
              </Text>
              {marketplaceBadges.unseen.includes(item.id) ? (
                <View style={styles.newMessageIcon}>
                  <Text style={styles.newMessageText}>New</Text>
                </View>
              ) : item.lastMessage ? (
                <View>
                  {item.lastMessage.seen ? (
                    <MaterialCommunityIcons
                      name={"check-all"}
                      size={16}
                      color={styleVariables.colors.primary}
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const styles = StyleSheet.create({
    flatlist: {
      height: "100%",
      paddingTop: 24,
    },
    noItemText: {
      textAlign: "center",
    },
    itemContainer: {
      flex: 1,
      padding: 8,
      backgroundColor: "white",
      flexDirection: "row-reverse",
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 16,
      ...styleVariables.shadow,
    },
    itemTouchable: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    itemImage: {
      width: 83.2,
      height: 64,
      borderRadius: 8,
    },
    itemTextContainer: {
      flex: 1,
      marginLeft: 20,
    },
    itemTitle: {
      fontSize: 15,
      marginBottom: 2,
      color: styleVariables.colors.black,
    },
    itemPersonName: {
      fontSize: 13,
      marginBottom: 4,
      color: styleVariables.colors.black,
    },
    itemContent: {
      fontSize: 13,
      opacity: 0.5,
      flex: 1,
    },
    itemTimestamp: {
      fontSize: 11,
      opacity: 0.5,
      color: styleVariables.colors.black,
    },
    primaryClr: {
      color: styleVariables.colors.primary,
    },
    messageFilter: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 32,
      paddingTop: 7,
    },
    bottomBar: {
      height: 4,
      width: 150,
      backgroundColor: styleVariables.colors.primary,
      marginTop: 8,
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    },
    filterTitle: {
      display: "flex",
      alignItems: "center",
    },
    hidden: {
      backgroundColor: "white",
    },
    flexApart: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    newMessageIcon: {
      backgroundColor: styleVariables.colors.primary,
      borderRadius: 50,
      padding: 5,
    },
    newMessageText: {
      fontSize: 11,
      color: styleVariables.colors.white,
    },
    isSoldView: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#EBEFF0",
      paddingVertical: 2,
      paddingHorizontal: 8,
      marginLeft: 4,
      borderRadius: 50,
    },
    isSoldText: {
      fontSize: 11,
      color: styleVariables.colors.primary,
    },
  });

  return (
    <View style={{ backgroundColor: "white" }}>
      <StatusBar style="dark" />
      <View style={styles.messageFilter}>
        <TouchableOpacity
          onPress={() => {
            setMessageListFilter("Buying");
          }}
          style={styles.filterTitle}
        >
          <Text style={[styleVariables.fontSizes.title, styles.primaryClr]}>
            Buying
          </Text>
          <View
            style={[
              styles.bottomBar,
              messageListFilter != "Buying" ? styles.hidden : "",
            ]}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setMessageListFilter("Selling");
          }}
          style={styles.filterTitle}
        >
          <Text style={[styleVariables.fontSizes.title, styles.primaryClr]}>
            Selling
          </Text>
          <View
            style={[
              styles.bottomBar,
              messageListFilter != "Selling" ? styles.hidden : "",
            ]}
          ></View>
        </TouchableOpacity>
      </View>
      <FlatList
        ListEmptyComponent={() => {
          return <Text style={styles.noItemText}>You have no messages.</Text>;
        }}
        style={styles.flatlist}
        keyExtractor={(item) => item.id}
        data={messageListFilter == "Buying" ? buyingList : sellingList}
        renderItem={renderItem}
      />
    </View>
  );
}
export default MessagesListScreen;
