import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  increment,
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
  getItemById,
} from "../../utils/firebase.services";
import { constants } from "../../utils/constants";
import Modal from "react-native-modal";

import MessagingBubble from "./MessagingBubble";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import ArrowRightSVG from "../../components/Icons/ArrowRightSVG";
import CircleCheckSVG from "../../components/Icons/CircleCheckSVG";
import ArrowUpSVG from "../../components/Icons/ArrowUpSVG";
import UploadImageSVG from "../../components/Icons/UploadImageSVG";
import MarkAsSoldModal from "../../components/Modals/MarkAsSoldModal";

function PrivateMessagingScreen({ route, navigation }) {
  const { setCurrentMarketplacePost } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [channelId, setChannelId] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [messages, setMessages] = useState("");
  const listRef = useRef();
  const [sendingText, setSendingText] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAppContext();
  const [itemSold, setItemSold] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {
    otherPersonName,
    otherPersonId,
    messageImage,
    itemTitle,
    isSeller,
    isSold,
    price,
    marketplacePostId,
  } = route.params;

  useEffect(() => {
    if (route.params && route.params.channelId) {
      setChannelId(route.params.channelId);
    }
  }, [route.params]);

  useEffect(() => {
    setItemSold(isSold);
  }, []);

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
        otherPersonId: otherPersonId,
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
        if (isSeller == false) {
          incrementUnseenCount();
        }
      } else {
        alert("Somethign went wrong");
      }
    }
  };

  const handleNavToPost = async () => {
    const post = await getItemById("Marketplace", marketplacePostId);

    setCurrentMarketplacePost(post);
    navigation.navigate("MarketplaceItemInfo", {
      title: isSeller
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : otherPersonName,
      itemUserId: isSeller ? currentUser.userID : otherPersonId,
      item: post,
    });
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
    updateItemInFirestore("Marketplace", marketplacePostId, {
      isSold: true,
    });
    setItemSold(true);
    navigation.navigate("MessagesListScreen", {
      marketplacePostId: marketplacePostId,
    });
  };

  const incrementUnseenCount = () => {
    updateItemInFirestore("MessagingList", channelId, {
      unseenCount: increment(1),
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: styleVariables.colors.white,
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
    itemImage: {
      width: 52,
      height: 40,
      borderRadius: 8,
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
    modal: {
      display: "flex",
      justifyContent: "flex-end",
      margin: 0,
    },
    soldFooter: {
      alignSelf: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 1,
      marginVertical: 20,
      width: "90%",
      backgroundColor: "#92A6AB",
    },
    soldFooterText: {
      position: "absolute",
      backgroundColor: styleVariables.colors.white,
      color: "#92A6AB",
      paddingHorizontal: 16,
    },
    inputAreaContainer: {
      backgroundColor: styleVariables.colors.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      maxHeight: 160,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      ...styleVariables.shadow,
    },
    inputArea: {
      flex: 1,
    },
    uploadButton: {
      marginRight: 8,
      marginBottom: 16,
      alignSelf: "flex-end",
    },
    arrowAndMarkSold: {
      display: "flex",
      flexDirection: "row",
    },
    markSoldIcon: {
      marginRight: 8,
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
        <TouchableOpacity
          onPress={() => {
            handleNavToPost();
          }}
        >
          <View style={styles.imageAndTitle}>
            <Image style={styles.itemImage} source={{ uri: messageImage }} />
            <View>
              <Text
                style={[styles.itemTitle, styleVariables.fontSizes.bodyBold]}
              >
                {itemTitle}
              </Text>
              <Text style={[styles.priceText, styleVariables.fontSizes.body]}>
                {price}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.arrowAndMarkSold}>
          {isSeller && !itemSold ? (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <CircleCheckSVG style={styles.markSoldIcon} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              handleNavToPost();
            }}
          >
            <ArrowRightSVG />
          </TouchableOpacity>
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
                  Your conversation with {otherPersonName} starts here
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
            ListFooterComponent={
              itemSold ? <ListFooter styles={styles} /> : null
            }
          />
        )}
      </View>
      <View style={[styles.inputAreaContainer]}>
        <UploadImageSVG style={styles.uploadButton} />
        <TextInput
          placeholderTextColor={styleVariables.colors.placeholderText}
          onChangeText={setMessages}
          value={messages}
          placeholder="Send a Message"
          maxLength={280}
          multiline
          style={[
            theme.individualPostsTextInput,
            styleVariables.fontSizes.body,
            styles.inputArea,
          ]}
        />
        {/* disable button class if no text input for comments */}
        <TouchableOpacity
          onPress={() => handleSendMessage(messages)}
          style={[
            theme.postButton,
            { backgroundColor: !messages ? "#748E94" : "#395E66" },
          ]}
          disabled={!messages}
        >
          <ArrowUpSVG />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function ListFooter({ styles }) {
  return (
    <View style={styles.soldFooter}>
      <Text style={styles.soldFooterText}>Item sold</Text>
    </View>
  );
}

export default PrivateMessagingScreen;
