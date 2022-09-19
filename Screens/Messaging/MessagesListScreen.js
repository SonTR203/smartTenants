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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../Context/AppContext";
import { setTime } from "../../utils/setTime";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import _ from "lodash";

function MessagesListScreen({ navigation }) {
  const [buyingList, setBuyingList] = useState([]);
  const [sellingList, setSellingList] = useState([]);
  const [messageListFilter, setMessageListFilter] = useState("Buying");
  const { currentUser, marketplaceBadges } = useAppContext();
  const { theme, styleVariables } = useTheme();

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
      console.log("Sellers:", sellerList);
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
    price
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
    });
  };

  const renderItem = ({ item }) => {
    const otherPersonName =
      item.sellerId === currentUser.userID ? item.buyerName : item.sellerName;
    const otherPersonId =
      item.sellerId === currentUser.userID ? item.buyerId : item.sellerId;

    const isNew = item.isNew;
    let lastMessage = "";
    if (!isNew) {
      // if you sent the last message
      if (item.lastMessage.senderId === currentUser.userID) {
        lastMessage = `${
          item.lastMessage.senderId === currentUser.userID
            ? "You"
            : item.lastMessage.senderFirstName
        }: ${item.lastMessage.content}`;
      } else {
        // if you received the last message
        lastMessage = `${item.lastMessage.senderFirstName}: ${item.lastMessage.content}`;
      }
    }
    return (
      <View style={[styles.itemContainer]}>
        {marketplaceBadges.unseen.includes(item.id) ? (
          <MaterialCommunityIcons name="new-box" size={30} color={"red"} />
        ) : null}
        <TouchableOpacity
          onPress={() => {
            handleNavigateToPrivateMessagingScreen(
              otherPersonName,
              otherPersonId,
              item.id,
              item.messageImage,
              item.title,
              item.sellerId,
              item.price
            );
          }}
          style={styles.itemTouchable}
        >
          <Image style={styles.itemImage} source={{ uri: item.messageImage }} />

          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPersonName}>{otherPersonName}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.itemContent}
            >
              {isNew ? "New Inquiry" : lastMessage}
            </Text>
            {item.lastMessage ? (
              <View style={styles.itemTimestamp}>
                <Text>
                  {/* {setTime(item.lastMessage.timestamp.seconds * 1000)} */}
                </Text>
                {item.lastMessage.seen ? (
                  <MaterialCommunityIcons
                    name={"check-all"}
                    size={25}
                    color={"green"}
                  />
                ) : null}
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
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
      padding: 10,
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
      fontSize: 20,
      marginBottom: 5,
    },
    itemPersonName: {
      fontSize: 17,
      marginBottom: 5,
      opacity: 0.8,
    },
    itemContent: {
      fontSize: 15,
      opacity: 0.5,
      width: "95%",
    },
    itemTimestamp: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      opacity: 0.5,
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
  });

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar style="dark" />
      <View>
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
          // data={messagesList}
          data={messageListFilter == "Buying" ? buyingList : sellingList}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}
export default MessagesListScreen;
