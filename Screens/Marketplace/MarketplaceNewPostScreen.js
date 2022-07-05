import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CurrencyInput from "react-native-currency-input";
import { Timestamp } from "@firebase/firestore";
import { useAppContext } from "../../Context/AppContext";
import uuid from "react-native-uuid";
import {
  compressFileSize,
  getFileInfo,
} from "../../utils/Profile/profile.services";
import {
  createItemInFirestore,
  deleteImageFromStorage,
  uploadImageToStorage,
} from "../../utils/firebase.services";

function MarketplaceNewPostScreen({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const { currentUser } = useAppContext();

  // function to handle image picking
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      const size = await getFileInfo(result.uri);
      if (size > 5) {
        alert(
          "ERROR",
          "File size is too large. Please select a file smaller than 5MB"
        );
        return;
      }
      const path = await compressFileSize(result.uri);
      setImage(path.uri);
    }
  };

  const handleSubmit = async () => {
    // if all info is filled out: create random id -> upload image -> create post
    if (title.length > 0 && content.length > 0 && price && image.length > 0) {
      setIsloading(true);
      const id = uuid.v4();
      const imagePath = `Images/Posts/Marketplace/${id}-${currentUser.userID}.jpg`;
      const imageUrl = await uploadImageToStorage(imagePath, image);
      if (imageUrl) {
        createMarketplacePostFirestore(imageUrl, id);
      } else {
        return;
      }
    } else {
      alert("Please fill out all fields");
    }
  };

  const createMarketplacePostFirestore = async (imageUrl, id) => {
    try {
      const propObj = {
        buildingLocation: "",
        images: [imageUrl],
        isNSFW: false,
        id: id,
        postContent: content,
        postTitle: title,
        price: price,
        userID: currentUser.userID,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userProfileImage: currentUser.userProfileImage,
        timestamp: Timestamp.fromDate(new Date()),
      };

      const res = await createItemInFirestore("Marketplace", id, propObj);
      setIsloading(false);
      if (res) {
        alert("Marketplace item successfully created!");
        navigation.navigate("MarketplaceScreen", { reload: true });
      } else {
        throw new Error("Error creating marketplace item", res.error);
      }
    } catch (err) {
      await deleteImageFromStorage(imageUrl);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingLeft: 17,
      paddingRight: 17,
    },
    bodyContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    textInputTitleAndPrice: {
      height: 64,
      paddingTop: 22,
    },
    textInputDescription: {
      minHeight: 68 + 44,
      paddingTop: 22,
      paddingBottom: Platform.OS === "android" ? 70 : 0,
    },
    uploadButtonContainer: {
      flexDirection: "row",
    },
    uploadText: {
      maxWidth: "85%",
    },
    loader: {
      marginBottom: 20,
    },
  });

  return (
    // CONTAINER
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={styles.container}
    >
      <StatusBar style="dark" />
      {/* BODY CONTAINER  */}
      <View style={styles.bodyContainer}>
        {/* TEXT INPUT SECTIONS  */}
        <View>
          {/* TITLE  */}
          <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
            Title
          </Text>
          <TextInput
            onChangeText={(text) => {
              setTitle(text);
            }}
            placeholder="What are you selling?"
            multiline={false}
            maxLength={60}
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              styles.textInputTitleAndPrice,
            ]}
          />

          {/* DESCRIPTION */}
          <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
            Description
          </Text>
          <TextInput
            onChangeText={(text) => {
              setContent(text);
            }}
            placeholder="280 characters maximum"
            multiline={true}
            maxLength={280}
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              styles.textInputDescription,
            ]}
          />

          {/* PRICE */}
          <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
            Price
          </Text>
          <CurrencyInput
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              styles.textInputTitleAndPrice,
            ]}
            multiline={false}
            maxLength={12}
            placeholder="$ 0.00"
            minValue={0}
            separator="."
            delimiter=","
            keyboardType="numeric"
            value={price}
            onChangeValue={setPrice}
            prefix="$"
          />

          {/* UPLOAD IMAGE */}
          <TouchableOpacity
            id="uploadImageButton"
            onPress={pickImage}
            style={[theme.secondaryButton, styles.uploadButtonContainer]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[
                theme.secondaryButtonText,
                styleVariables.fontSizes.body,
                styles.uploadText,
              ]}
            >
              {image.length > 0 ? image.split("/").pop() : "Upload Image "}
            </Text>
            <MaterialCommunityIcons
              name="image-plus"
              size={18}
              color={styleVariables.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* SUBMIT BUTTON  */}
        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={styleVariables.colors.primary}
          />
        ) : (
          <TouchableOpacity
            id="submitPostButton"
            onPress={handleSubmit}
            style={[theme.primaryButton, {}]}
          >
            <Text
              style={[
                theme.primaryButtonText,
                styleVariables.fontSizes.bodyBold,
              ]}
            >
              Submit post
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default MarketplaceNewPostScreen;
