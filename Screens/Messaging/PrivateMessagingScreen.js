import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "@firebase/firestore";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { db } from "../../firebase-config";
import uuid from "react-native-uuid";
import { createItemInFirestore } from "../../utils/firebase.services";
import { constants } from "../../utils/constants";

import MessagingBubble from "./MessagingBubble";

function PrivateMessagingScreen({ route }) {
  const [channelId, setChannelId] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [messages, setMessages] = useState("");
  const listRef = useRef();
  const [sendingText, setSendingText] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser, newPrivateMessages, setNewPrivateMessages } =
    useAppContext();

  useEffect(() => {
    if (route.params && route.params.channelId) {
      setChannelId(route.params.channelId);
      // console.log("channel id: ", route.params.channelId);
      if (newPrivateMessages.length > 0) {
        // console.log("new private messages: ", newPrivateMessages);
        const updatedMessages = newPrivateMessages.filter(
          (message) => message.id === route.params.channelId
        );
        // console.log("updatedMessages: ", updatedMessages);
        setNewPrivateMessages(updatedMessages);
      }
    }
  }, [route.params]);

  useEffect(() => {
    let unsubscribe;
    if (channelId) {
      const colReference = collection(
        db,
        `MessagingList/${channelId}/messages`
      );
      const q = query(colReference, orderBy("created", "asc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const latestMsgs = [];
        querySnapshot.forEach((doc) => {
          latestMsgs.push(doc.data());
        });
        setMessagesList([...latestMsgs]);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [channelId]);

  const handleSendMessage = async () => {
    setSendingText(true);
    if (messages.length > 0) {
      const id = uuid.v4();
      const messageObj = {
        id,
        content: messages,
        senderId: currentUser.userID,
        senderName: `${currentUser.firstName} ${currentUser.lastName}`,
        created: Timestamp.fromDate(new Date()),
        otherPersonId: route.params.otherPersonId,
        seen: false,
      };
      const res = await createItemInFirestore(
        `MessagingList/${channelId}/messages`,
        id,
        messageObj
      );
      if (res) {
        setMessages("");
        setSendingText(false);
      } else {
        alert("Somethign went wrong");
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <MessagingBubble
        channelId={channelId}
        length={messagesList.length - 1}
        item={item}
        index={index}
        sendingText={sendingText}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={constants.height * 0.15}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.textDisplayContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading your messages...</Text>
        ) : (
          <FlatList
            ref={listRef}
            style={styles.flatlist}
            ListEmptyComponent={() => {
              return (
                <Text style={styles.noItemText}>
                  Your conversation with {route.params.otherPersonName} starts
                  here
                </Text>
              );
            }}
            removeClippedSubviews={true}
            initialNumToRender={3}
            data={messagesList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onContentSizeChange={() =>
              listRef.current.scrollToEnd({ animated: true })
            }
            onLayout={() => listRef.current.scrollToEnd({ animated: true })}
          />
        )}
      </View>
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.messageInput}
          onChangeText={setMessages}
          value={messages}
          placeholder="Type in your message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
  },
  noItemText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.5,
  },
  textDisplayContainer: {
    flex: 1,
  },
  loadingText: {
    textAlign: "center",
  },
  messageContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  messageInput: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    backgroundColor: "white",
  },
  sendButton: {
    flex: 0.2,
    backgroundColor: "#4286f4",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sendButtonText: {
    fontSize: 20,
    color: "white",
  },
});

export default PrivateMessagingScreen;
