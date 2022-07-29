import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../ThemeContext.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  deleteImageFromStorage,
  deleteItemFromFirestore,
  deleteMultipleImages,
} from "../utils/firebase.services.js";
import { useNavigation } from "@react-navigation/native";

export default function CustomSubStackScreenHeader({ ...props }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { theme, styleVariables } = useTheme();
  const navigation = useNavigation();

  const handleOptions = async () => {
    showActionSheetWithOptions(
      {
        title: `Post settings.

Select an option to edit Marketplace post`,
        options: ["Cancel", "Turn off notifications", "Delete post"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          alert("Turn off notifications. To be implemented.");
        } else if (buttonIndex === 2) {
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
        }
      }
    );
  };

  const styles = StyleSheet.create({
    container: { backgroundColor: "white" },
    headerRight: { minWidth: 36 },
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
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
            <Pressable onPress={handleOptions}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={36}
                color={styleVariables.colors.black}
              />
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
