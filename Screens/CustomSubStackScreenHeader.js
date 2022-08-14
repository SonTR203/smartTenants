import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";

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
import SaveIcon from "../components/SaveIcon/SaveIcon.js";
import CustomBottomModal from "../components/CustomBottomModal/index.js";

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

  const handleDeleteListing = async () => {
    const resDB = await deleteItemFromFirestore(
      props.collection,
      props.item.id
    );
    props.item.images.length > 0 && props.item.images.length < 2
      ? await deleteImageFromStorage(props.item.images[0])
      : await deleteMultipleImages(props.item.images);
    if (resDB) {
      alert("Post deleted.");
    } else {
      alert("Error deleting post. Please try again later.");
      return;
    }
    navigation.navigate(props.previousScreen, {
      reload: true,
    });
  };

  const handleSetSoldListing = () => {
    // handle set listing as sold here
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
      >
        <Pressable
          onPress={() => {
            // edit listing here
            alert("edit listing here");
          }}
          style={styles.optionContainer}
        >
          <SimpleLineIcons name="pencil" size={18} color="#4D4D4D" />
          <Text style={styles.modalOptionText}>Edit listing</Text>
        </Pressable>

        <Pressable onPress={handleDeleteListing} style={styles.optionContainer}>
          <Feather name="trash" size={18} color="#4D4D4D" />
          <Text style={styles.modalOptionText}>Delete listing</Text>
        </Pressable>
        <Pressable
          onPress={handleSetSoldListing}
          style={styles.optionContainer}
        >
          <MaterialCommunityIcons name="piggy-bank" size={18} color="#4D4D4D" />
          <Text style={styles.modalOptionText}>Mark listing as sold</Text>
        </Pressable>

        <Pressable
          onPress={() => setModalVisible(false)}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",

            borderWidth: 2,
            borderColor: styleVariables.colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              lineHeight: 22,
              color: styleVariables.colors.primary,
              fontFamily: "Roboto_500Medium",
            }}
          >
            Close
          </Text>
        </Pressable>
      </CustomBottomModal>
      <View style={[theme.stackHeader, { paddingHorizontal: 17 }]}>
        <Pressable
          onPress={() => {
            if (props.navigation) {
              props.navigation.goBack();
            }
          }}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={36}
            color={styleVariables.colors.black}
          />
        </Pressable>
        <Text style={styleVariables.fontSizes.title}>
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
            <SaveIcon
              isSaved={isSaved}
              size={36}
              onPress={handleSaveMarketplaceItem}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
