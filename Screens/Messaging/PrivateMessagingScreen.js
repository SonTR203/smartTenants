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
  Keyboard,
} from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { db } from "../../firebase-config";
import uuid from "react-native-uuid";
import {
  createItemInFirestore,
  updateItemInFirestore,
} from "../../utils/firebase.services";
import { constants } from "../../utils/constants";
import { setTime } from "../../utils/setTime";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      console.log("channel id: ", route.params.channelId);
      if (newPrivateMessages.length > 0) {
        console.log("new private messages: ", newPrivateMessages);
        const updatedMessages = newPrivateMessages.filter(
          (message) => message.id !== route.params.channelId
        );
        console.log("updatedMessages: ", updatedMessages);
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

  const handleSetSeen = async (item, index) => {
    // if the other person seen the last text, update the last text seen
    if (
      index === messagesList.length - 1 &&
      item.senderId !== currentUser.userID
    ) {
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

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            margin: 10,
            marginLeft: item.senderId === currentUser.userID ? 50 : 10,
            marginRight: item.senderId === currentUser.userID ? 10 : 50,
            padding: 10,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: item.senderId === currentUser.userID ? "red" : "blue",
            }}
          >
            {item.senderName}{" "}
            {item.senderId === currentUser.userID ? "(You)" : ""}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text
              onLayout={() => {
                handleSetSeen(item, index);
              }}
              style={{
                fontSize: 15,
                maxWidth: "75%",
              }}
            >
              {item.content}
            </Text>
            <Text
              style={{
                fontSize: 13,
                opacity: 0.5,
              }}
            >
              {setTime(item.created.seconds * 1000)}
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginRight: 10,
          }}
        >
          {index === messagesList.length - 1 &&
          item.senderId === currentUser.userID ? (
            item.seen ? (
              <MaterialCommunityIcons
                name={"check-all"}
                size={18}
                color={"green"}
              />
            ) : (
              <Text
                style={{
                  fontSize: 13,
                  opacity: 0.5,
                }}
              >
                {sendingText ? "Sending..." : "Sent"}
              </Text>
            )
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={constants.height * 0.2}
      behavior={Platform.OS === "ios" ? "height" : "height"}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          // text display container
          flex: 1,
        }}
      >
        {loading ? (
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Loading your messages...
          </Text>
        ) : (
          <FlatList
            ref={listRef}
            style={{
              flex: 1,
            }}
            ListEmptyComponent={() => {
              return (
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: "center",
                    marginTop: 10,
                    opacity: 0.5,
                  }}
                >
                  You are now connected with {route.params.otherPersonName}
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
      <View
        style={{
          //  message container
          flex: 0.2,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{
            // message input
            flex: 0.8,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            fontSize: 20,
            backgroundColor: "white",
          }}
          onChangeText={setMessages}
          value={messages}
          placeholder="Type in your message"
        />
        <TouchableOpacity
          style={{
            // send button
            flex: 0.2,
            backgroundColor: "#4286f4",
            borderRadius: 5,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
          onPress={handleSendMessage}
        >
          <Text
            style={{
              // send button text
              fontSize: 20,
              color: "white",
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PrivateMessagingScreen;
