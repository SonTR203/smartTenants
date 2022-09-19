import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { updateItemInFirestore } from "../../utils/firebase.services";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import { constants } from "../../utils/constants";

function MessagingBubble({ item, index, length, sendingText, channelId }) {
  const { theme, styleVariables } = useTheme();
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

  function configureItemTime(time) {
    let timestamp = time * 1000;
    let date = new Date(timestamp).toTimeString().split(":");
    if (date[0] > 12) {
      return `${date[0] - 12}:${date[1]}pm`;
    } else {
      return `${date[0]}:${date[1]}am`;
    }
  }

  const styles = StyleSheet.create({
    itemContainer: (isSender) => ({
      // maxWidth: constants.width * 0.8,
      display: "flex",
      flexDirection: "row",
      // alignItems: "flex-start",
      // flex: 1,
      backgroundColor: "white",
      marginVertical: 10,
      marginLeft: isSender ? "auto" : 10,
      marginRight: isSender ? 10 : "auto",
      padding: 10,
      shadowColor: "#4d4d4d",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
    itemContentContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemContent: {
      maxWidth: constants.width * 0.7,
      fontSize: 15,
      marginRight: 8,
    },
    itemTimestamp: {
      fontSize: 11,
    },
    itemStatusContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      marginRight: 10,
    },
    sender: {
      backgroundColor: styleVariables.colors.primary,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 2,
    },
    receiver: {
      backgroundColor: "#EDEDED",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 16,
    },
    receiverText: {
      color: styleVariables.colors.black,
    },
    senderText: {
      color: styleVariables.colors.white,
    },
  });

  return (
    <View>
      <View
        style={[
          styles.itemContainer(isSender),
          isSender ? styles.sender : styles.receiver,
        ]}
      >
        {/* <View style={styles.itemContentContainer}> */}
        <Text
          onLayout={() => {
            handleSetSeen(item, index);
          }}
          style={[
            styles.itemContent,
            isSender ? styles.senderText : styles.receiverText,
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.itemTimestamp,
            isSender ? styles.senderText : styles.receiverText,
          ]}
        >
          {configureItemTime(item.created.seconds)}
        </Text>
        {/* </View> */}
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

export default MessagingBubble;
