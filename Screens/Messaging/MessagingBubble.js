import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { updateItemInFirestore } from "../../utils/firebase.services";
import { setTime } from "../../utils/setTime";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function MessagingBubble({ item, index, length, sendingText, channelId }) {
  const { currentUser } = useAppContext();
  const isSender = item.senderId === currentUser.userID;

  const handleSetSeen = async (item, index) => {
    // if the other person seen the last text, update the last text seen
    if (index === length && item.senderId !== currentUser.userID) {
      await updateItemInFirestore(`MessagingList`, channelId, {
        isNew: false,
        "lastMessage.seen": true,
      });

      await updateItemInFirestore(
        `MessagingList/${channelId}/messages`,
        item.id,
        {
          seen: true,
        }
      );
    }
  };

  return (
    <View>
      <View style={styles.itemContainer(isSender)}>
        <Text style={styles.senderText(isSender)}>
          {item.senderName} {isSender ? "(You)" : ""}
        </Text>
        <View style={styles.itemContentContainer}>
          <Text
            onLayout={() => {
              handleSetSeen(item, index);
            }}
            style={styles.itemContent}
          >
            {item.content}
          </Text>
          <Text style={styles.itemTimestamp}>
            {setTime(item.created.seconds * 1000)}
          </Text>
        </View>
      </View>
      <View style={styles.itemStatusContainer}>
        {index === length && isSender ? (
          item.seen ? (
            <MaterialCommunityIcons
              name={"check-all"}
              size={18}
              color={"green"}
            />
          ) : (
            <Text style={styles.sendingText}>
              {sendingText ? "Sending" : "Sent"}
            </Text>
          )
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: (isSender) => ({
    flex: 1,
    backgroundColor: "white",
    margin: 10,
    marginLeft: isSender ? 50 : 10,
    marginRight: isSender ? 10 : 50,
    padding: 10,
    borderRadius: 5,
    shadowColor: "#4d4d4d",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }),
  senderText: (isSender) => ({
    fontSize: 15,
    color: isSender ? "red" : "blue",
  }),
  itemContentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  itemContent: {
    fontSize: 15,
    maxWidth: "75%",
  },
  itemTimestamp: {
    fontSize: 13,
    opacity: 0.5,
  },
  itemStatusContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 10,
  },
  sendingText: {
    fontSize: 13,
    opacity: 0.5,
  },
});

export default MessagingBubble;
