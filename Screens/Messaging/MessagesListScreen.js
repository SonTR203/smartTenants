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
import _ from "lodash";

function MessagesListScreen({ navigation }) {
  const [messagesList, setMessagesList] = useState([]);
  const { currentUser, marketplaceBadges } = useAppContext();

  useEffect(() => {
    // console.log("marketplace screen list: ", marketplaceBadges.list.length);
    if (marketplaceBadges.list.length > 0) {
      const sortedListOfNotifications = _.sortBy(
        marketplaceBadges.list,
        "timestamp"
      ).reverse();
      setMessagesList(sortedListOfNotifications);
    }
  }, [marketplaceBadges.list]);

  const handleNavigateToPrivateMessagingScreen = async (
    otherPersonName,
    otherPersonId,
    channelId
  ) => {
    navigation.navigate("PrivateMessagingScreen", {
      otherPersonName: otherPersonName,
      otherPersonId: otherPersonId,
      channelId: channelId,
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
      <View style={styles.itemContainer}>
        {marketplaceBadges.unseen.includes(item.id) ? (
          <MaterialCommunityIcons name="new-box" size={30} color={"red"} />
        ) : null}
        <TouchableOpacity
          onPress={() => {
            handleNavigateToPrivateMessagingScreen(
              otherPersonName,
              otherPersonId,
              item.id
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
                  {setTime(item.lastMessage.timestamp.seconds * 1000)}
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

  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <View>
        <FlatList
          ListEmptyComponent={() => {
            return <Text style={styles.noItemText}>You have no messages.</Text>;
          }}
          style={styles.flatlist}
          keyExtractor={(item) => item.id}
          data={messagesList}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatlist: {
    height: "100%",
  },
  noItemText: {
    textAlign: "center",
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#4d4d4d",
    flexDirection: "row-reverse",
  },
  itemTouchable: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#4d4d4d",
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
});

export default MessagesListScreen;
