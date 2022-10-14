import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Timestamp } from "firebase/firestore";

import { useTheme } from "../ThemeContext.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  deleteImageFromStorage,
  deleteItemFromFirestore,
  deleteMultipleImages,
  updateItemInFirestore,
} from "../utils/firebase.services.js";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../Context/AppContext.js";
import CustomBottomModal from "../components/CustomBottomModal/index.js";
import ModalActionConfirm from "../components/CustomBottomModal/ModalActionConfirm/index.js";
import HeartSVG from "../components/Icons/HeartSVG";
import HeartFilledSVG from "../components/Icons/HeartFilledSVG";

export default function CustomSubStackScreenHeader({ ...props }) {
  const { theme, styleVariables } = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {
    setCurrentMarketplacePost,
    setUpdatedMarketplacePosts,
    updatedMarketplacePosts,
  } = useAppContext();

  useEffect(() => {
    if (props.item && props.item.isSavedBy && props.currentUserId) {
      setIsSaved(props.item.isSavedBy.includes(props.currentUserId));
    }
  }, []);

  // open the Modal by default
  useEffect(() => {
    if (props.openModal) {
      setModalVisible(true);
    }
  }, [props.openModal]);

  const handleDeleteListing = async () => {
    const resDB = await deleteItemFromFirestore(
      props.collection,
      props.item.id
    );
    props.item.images.length > 0 && props.item.images.length < 2
      ? await deleteImageFromStorage(props.item.images[0])
      : await deleteMultipleImages(props.item.images);
    let toastOption;
    if (resDB) {
      // alert("Post deleted.");
      toastOption = {
        saveModal: true,
        modalType: "success",
        message:
          props.collection === "Newsfeed" ? "Post deleted" : "Listing deleted",
      };
    } else {
      // alert("Error deleting post. Please try again later.");
      navigation.navigate(props.previousScreen, {
        reload: true,
        saveModal: true,
        modalType: "error",
        message: "Something went wrong, please try again",
      });
      return;
    }
    setModalVisible(false);
    navigation.navigate(props.previousScreen, {
      reload: true,
      ...toastOption,
    });
  };

  const handleSaveMarketplaceItem = async () => {
    console.log("handling save/unsave");
    const updatedSaveArray = !isSaved
      ? [...props.item.isSavedBy, props.currentUserId]
      : props.item.isSavedBy.filter((id) => id !== props.currentUserId);
    const res = await updateItemInFirestore("Marketplace", props.item.id, {
      isSavedBy: updatedSaveArray,
    });
    if (!res) {
      alert("Something went wrong. Please try again later.");
      return;
    }
    setIsSaved(!isSaved);
    setCurrentMarketplacePost({
      ...props.item,
      isSavedBy: updatedSaveArray,
      updated: true,
    });

    // add the updated item to the updatedMarketplacePosts array
    setUpdatedMarketplacePosts([
      ...updatedMarketplacePosts,
      {
        ...props.item,
        isSavedBy: updatedSaveArray,
      },
    ]);
  };

  const handleTurnOffNotifications = async () => {
    setModalVisible(false);
    alert("Notifications turned off. To be implemented.");
  };

  const handleSetListingAsSold = async () => {
    const res = await updateItemInFirestore("Marketplace", props.item.id, {
      isSold: props.item.isSold ? false : true,
      soldDate: props.item.isSold ? "" : Timestamp.fromDate(new Date()),
    });
    if (!res) {
      alert("Something went wrong. Please try again later.");
    }
    setModalVisible(false);
    navigation.navigate(props.previousScreen, {
      saveModal: true,
      reload: true,
      modalType: "success",
      message: props.item.isSold
        ? "Your item was listed"
        : "Item marked as sold",
    });
    // let msg = props.item.isSold ? "re-listed" : "sold";
    // alert(`Successfully ${msg} item.`);
  };

  const setModalOptions = () => {
    const markListingText =
      props.item && props.item.isSold ? "List again" : "Mark listing as sold";
    const markListingIconName =
      props.item && props.item.isSold ? "account-cash-outline" : "piggy-bank";
    const markListingContent =
      props.item && props.item.isSold
        ? "List item again?"
        : "Mark listing as sold?";
    const markListingSubtitle =
      props.item && props.item.isSold
        ? "Your listing will be available immediately"
        : "You will be able to restore it";

    const options = [
      {
        content: `Edit ${props.collection === "Newsfeed" ? "post" : "listing"}`,
        onPress: () => {},
        iconName: "pencil",
        iconColor: "#4D4D4D",
      },
      {
        content: `Delete ${
          props.collection === "Newsfeed" ? "post" : "listing"
        }`,
        onPress: () => {},
        iconName: "trash-can-outline",
        iconColor: "#4D4D4D",
        renderSubscreen: () => {
          return (
            <ModalActionConfirm
              destructive={true}
              title={`Delete your ${
                props.collection === "Newsfeed" ? "post" : "listing"
              }?`}
              subtitle={"You won't be able to restore it"}
              confirmText="Delete"
              onConfirm={handleDeleteListing}
              onCancel={() => setModalVisible(false)}
            />
          );
        },
      },
      {
        content:
          props.collection === "Newsfeed"
            ? "Turn off notifications"
            : markListingText,
        onPress: () => {},
        iconName:
          props.collection === "Newsfeed"
            ? "bell-off-outline"
            : markListingIconName,
        iconColor: "#4D4D4D",
        renderSubscreen: () => {
          return (
            <ModalActionConfirm
              title={
                props.collection === "Newsfeed"
                  ? "Turn off notifications for this post?"
                  : markListingContent
              }
              subtitle={
                props.collection === "Newsfeed"
                  ? "You will be able to undo this action"
                  : markListingSubtitle
              }
              confirmText="Confirm"
              onConfirm={
                props.collection === "Newsfeed"
                  ? handleTurnOffNotifications
                  : handleSetListingAsSold
              }
              onCancel={() => setModalVisible(false)}
            />
          );
        },
      },
    ];
    return options;
  };

  const styles = StyleSheet.create({
    container: { backgroundColor: "white" },
    headerRight: { minWidth: 36 },
    modalOptionText: {
      fontSize: 17,
      lineHeight: 22,
      color: "#4D4D4D",
      fontFamily: "Roboto_400Regular",

      marginBottom: 25,
      marginLeft: 20,
    },
    optionContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <CustomBottomModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        options={setModalOptions()}
      />
      <View style={[theme.stackHeader, { paddingHorizontal: 17 }]}>
        <Pressable
          onPress={() => {
            if (props.navigation) {
              props.navigation.goBack();
            }
          }}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={36}
            color={styleVariables.colors.black}
          />
        </Pressable>
        <Text
          style={[
            styleVariables.fontSizes.title,
            {
              color: styleVariables.colors.black,
            },
          ]}>
          {props.title && props.title}
        </Text>
        <View style={styles.headerRight}>
          {props.currentUserId && props.currentUserId === props.itemUserId ? (
            <Pressable onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={36}
                color={styleVariables.colors.black}
              />
            </Pressable>
          ) : props.item && props.item.isSavedBy ? (
            <TouchableOpacity onPress={handleSaveMarketplaceItem}>
              {isSaved ? (
                <HeartFilledSVG width={24} height={25} />
              ) : (
                <HeartSVG width={24} height={25} stroke={2} />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
