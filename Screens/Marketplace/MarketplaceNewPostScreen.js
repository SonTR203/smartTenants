import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Timestamp } from "@firebase/firestore";
import { useAppContext } from "../../Context/AppContext";
import uuid from "react-native-uuid";
import {
  checkPermissionMediaLibrary,
  compressFileSize,
  getFileInfo,
} from "../../utils/Profile/profile.services";
import {
  createItemInFirestore,
  deleteImageFromStorage,
  uploadImageToStorage,
} from "../../utils/firebase.services";
import { moderateImage, moderateText } from "../../utils/moderation.services";

function MarketplaceNewPostScreen({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { currentUser } = useAppContext();

  // function to handle image picking
  const pickImage = async () => {
    const permissionResult = await checkPermissionMediaLibrary();

    if (permissionResult !== false) {
      let result = await ImagePicker.launchImageLibraryAsync({
        presentationStyle: 0,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setImageLoading(true);
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
        setImageLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    // if all info is filled out: create random id -> upload image -> create post
    if (title.length > 0 && content.length > 0 && price && image.length > 0) {
      setIsloading(true);
      const id = uuid.v4();
      const imagePath = `Images/Posts/Marketplace/${id}-${currentUser.userID}.jpeg`;
      const imageUrl = await uploadImageToStorage(imagePath, image);
      const isNsfw = await moderatePost(imageUrl);
      if (imageUrl) {
        createMarketplacePostFirestore(imageUrl, id, isNsfw);
      } else {
        return;
      }
    } else {
      alert("Please fill out all fields");
    }
  };

  const createMarketplacePostFirestore = async (imageUrl, id, isNsfw) => {
    try {
      const propObj = {
        buildingLocation: "",
        images: [imageUrl],
        isNSFW: isNsfw,
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
      if (isNsfw) {
        alert(
          "We've detected potential suggestive or profane content. Your post will be reviewed."
        );
        navigation.navigate("MarketplaceScreen", { reload: true });
      } else if (res) {
        alert("Marketplace item successfully created!");
        navigation.navigate("MarketplaceScreen", { reload: true });
      } else {
        await deleteImageFromStorage(imageUrl);
        throw new Error("Error creating marketplace item", res.error);
      }
    } catch (err) {
      await deleteImageFromStorage(imageUrl);
    }
  };

  // Moderation //
  async function moderatePost(imageUrl) {
    const imgNsfw = await moderateImage(imageUrl);
    const textNsfw = await moderateText(`${title} ${content}`);
    // if either image or text is nsfw, return true
    if (imgNsfw === true || textNsfw === true) {
      return true;
      // if both are safe, return false
    } else if (imgNsfw === false && textNsfw === false) {
      return false;
      // if something other happened, return undefined to show error
    } else {
      return undefined;
    }
  }

  // format price "0" -> "$0.00" after user finished entering
  // will be moved to utils folder if used in multiple places
  const format = (amount) => {
    return (
      "$" +
      parseFloat(amount)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    );
  };

  const handleEndEditing = (e) => {
    if (e.nativeEvent.text.length > 0) {
      setPrice(format(e.nativeEvent.text));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingLeft: 17,
      paddingRight: 17,
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* BODY CONTAINER  */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          height: "100%",
        }}
        behavior="height"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* TEXT INPUT SECTIONS  */}
          <View>
            {/* TITLE  */}
            <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
              Title
            </Text>
            <TextInput
              placeholderTextColor={styleVariables.colors.placeholderText}
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
              placeholderTextColor={styleVariables.colors.placeholderText}
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
            <TextInput
              keyboardType="numeric"
              value={price}
              placeholder="$0.00"
              onEndEditing={handleEndEditing}
              onChangeText={setPrice}
              style={[
                theme.textInput,
                styleVariables.fontSizes.body,
                styles.textInputTitleAndPrice,
              ]}
            />
            <View id="imageUploadPreview" style={theme.container}>
              {image !== "" ? (
                <Image
                  source={{ uri: image }}
                  style={theme.imageUploadPreview}
                />
              ) : null}
            </View>
            {/* UPLOAD IMAGE */}
            <TouchableOpacity
              id="uploadImageButton"
              onPress={pickImage}
              style={[theme.secondaryButton, styles.uploadButtonContainer]}
            >
              {imageLoading ? (
                <ActivityIndicator
                  style={styles.loader}
                  size="small"
                  color={styleVariables.colors.primary}
                />
              ) : (
                <>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={[
                      theme.secondaryButtonText,
                      styleVariables.fontSizes.body,
                      styles.uploadText,
                    ]}
                  >
                    {image.length > 0
                      ? image.split("/").pop()
                      : "Upload Image "}
                  </Text>
                  <MaterialCommunityIcons
                    name="image-plus"
                    size={18}
                    color={styleVariables.colors.primary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
            style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
          >
            Submit post
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default MarketplaceNewPostScreen;
