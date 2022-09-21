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
  Image,
} from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { db } from "../../firebase-config";
import uuid from "react-native-uuid";
import {
  createItemInFirestore,
  updateItemInFirestore,
} from "../../utils/firebase.services";
import { constants } from "../../utils/constants";
import Modal from "react-native-modal";

import MessagingBubble from "./MessagingBubble";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import ArrowRightSVG from "../../components/ArrowRightSVG";
import CircleCheckSVG from "../../components/CircleCheckSVG";
import UploadImageSVG from "../../components/UploadImageSVG";
import SendMessageSVG from "../../components/SendMessageSVG";
import MarkAsSoldModal from "../../components/Modals/MarkAsSoldModal";

function PrivateMessagingScreen({ route }) {
  const { styleVariables } = useTheme();
  const [channelId, setChannelId] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [messages, setMessages] = useState("");
  const listRef = useRef();
  const [sendingText, setSendingText] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAppContext();
  const [inputHeight, setInputHeight] = useState(36);
  const [isSold, setIsSold] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (route.params && route.params.channelId) {
      setChannelId(route.params.channelId);
      setIsSold(route.params.isSold);
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

  const handleSendMessage = async (content) => {
    setSendingText(true);
    if (content.length > 0) {
      const id = uuid.v4();
      const messageObj = {
        id,
        content: content,
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

  const handleMarkSold = () => {
    updateItemInFirestore("MessagingList", channelId, {
      isSold: true,
    });
    setIsSold(true);
  };

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
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      paddingTop: 16,
      paddingBottom: 34,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
    },
    messageInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#EBEFF0",
      borderRadius: 18,
      height: inputHeight,
      minHeight: 36,
      maxHeight: 76,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginRight: 10,
      fontSize: 15,
      backgroundColor: "white",
      color: styleVariables.colors.black,
    },
    itemImage: {
      width: 52,
      height: 40,
      borderRadius: 8,
      borderWidth: 1,
    },
    messageHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#EBEFF0",
    },
    imageAndTitle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    itemTitle: {
      color: styleVariables.colors.black,
      marginLeft: 8,
    },
    priceText: {
      color: styleVariables.colors.primary,
      marginLeft: 8,
    },
    arrowAndMarkSold: {
      display: "flex",
      flexDirection: "row",
    },
    sendMessageBtn: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      width: 32,
      height: 32,
      backgroundColor: styleVariables.colors.primary,
    },
    modal: {
      display: "flex",
      justifyContent: "flex-end",
      margin: 0,
    },
  });

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={constants.height * 0.15}
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <Modal
        isVisible={modalVisible}
        backdropOpacity={0.5}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <MarkAsSoldModal
          handleMarkSold={handleMarkSold}
          setModalVisible={setModalVisible}
        />
      </Modal>
      <View style={styles.messageHeader}>
        <View style={styles.imageAndTitle}>
          <Image
            style={styles.itemImage}
            source={{ uri: route.params.messageImage }}
          />
          <View>
            <Text style={[styles.itemTitle, styleVariables.fontSizes.bodyBold]}>
              {route.params.itemTitle}
            </Text>
            <Text style={[styles.priceText, styleVariables.fontSizes.body]}>
              {route.params.price}
            </Text>
          </View>
        </View>
        <View style={styles.arrowAndMarkSold}>
          {route.params.isSeller && !isSold ? (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <CircleCheckSVG />
            </TouchableOpacity>
          ) : null}
          <ArrowRightSVG />
        </View>
      </View>
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
        <UploadImageSVG />
        <TextInput
          placeholderTextColor={styleVariables.colors.placeholderText}
          style={styles.messageInput}
          onChangeText={setMessages}
          value={messages}
          placeholder="Type in your message"
          multiline
          onContentSizeChange={(event) => {
            setInputHeight(event.nativeEvent.contentSize.height);
          }}
        />
        <TouchableOpacity onPress={() => handleSendMessage(messages)}>
          <View style={styles.sendMessageBtn}>
            <SendMessageSVG />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PrivateMessagingScreen;
