import React from "react";
import { useAppContext } from "../Context/AppContext";
import { useTheme } from "../ThemeContext.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { deleteItemFromFirestore } from "../utils/firebase.services";

const DeletePost = () => {
  const { styleVariables } = useTheme();
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const { post } = useAppContext();

  const optionsAlert = async () => {
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
          const res = await deleteItemFromFirestore("Newsfeed", post.id);
          if (res) {
            alert("Post deleted.");
          } else {
            alert("Error deleting post. Please try again later.");
          }
          navigation.navigate("Newsfeed", {
            reload: true,
          });
        }
      }
    );
  };

  return (
    <TouchableOpacity onPress={optionsAlert}>
      <MaterialCommunityIcons
        name="dots-horizontal"
        size={36}
        color={styleVariables.colors.black}
      />
    </TouchableOpacity>
  );
};

export default DeletePost;
