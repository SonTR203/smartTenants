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
  FlatList,
  Alert,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { Timestamp } from "@firebase/firestore";
import { useAppContext } from "../../Context/AppContext";
import { wait } from "../../utils/wait";
import uuid from "react-native-uuid";
import { checkPermissionMediaLibrary } from "../../utils/Profile/profile.services";
import {
  createItemInFirestore,
  deleteMultipleImages,
} from "../../utils/firebase.services";
import { moderateImage, moderateText } from "../../utils/moderation.services";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ImageSVG from "../../components/ImageSVG";
import {
  updateImages,
  uploadMarketplaceImages,
} from "../../utils/Marketplace/marketplace.services";
import { maxImages } from "../../utils/constants";
import * as Progress from "react-native-progress";

function MarketplaceNewPostScreen({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { currentUser } = useAppContext();
  const [selectedImages, setSelectedImages] = useState([
    {
      uri: "",
    },
    {
      uri: "",
    },
    {
      uri: "",
    },
    {
      uri: "",
    },
    {
      uri: "",
    },
  ]);

  const openPicker = (multiple, index) => {
    try {
      const ImagePicker = require("react-native-image-crop-picker").default;
      // call const ImagePicker here so the app won't crash, only the feature is disabled
      ImagePicker.openPicker({
        multiple: multiple,
        compressImageQuality: 0.6,
        sortOrder: "asc",
      })
        .then((response) => {
          setImageLoading(true);
          let newImages = [...selectedImages];
          if (response.length > 0) {
            const takeAmount = updateImages(response, selectedImages);

            for (let i = 0; i < takeAmount; i++) {
              newImages[index + i] = {
                uri: response[i].path,
              };
            }

            if (newImages.length > maxImages) {
              newImages = newImages.slice(0, maxImages);
            }
          } else {
            newImages[index] = {
              uri: response.path,
            };
          }

          // artificially delay the image loading
          wait(500).then(() => {
            setImageLoading(false);
            setSelectedImages(newImages);
          });
        })
        .catch((error) => {
          console.log("error openPicker: ", error);
        });
    } catch (err) {
      console.log("error: ", err);
      Alert.alert(
        "This functionality is not available on Expo Go. Please use the standalone version."
      );
    }
  };

  const deleteSelectedPhoto = (index) => {
    let newImages = [...selectedImages];
    newImages.splice(index, 1);
    newImages.push({
      uri: "",
    });
    setSelectedImages(newImages);
  };

  // function to handle image picking
  const handlePickImage = async (uri, index) => {
    const permissionResult = await checkPermissionMediaLibrary();

    if (permissionResult !== false) {
      if (uri) {
        showActionSheetWithOptions(
          {
            options: ["Cancel", "Replace photo", "Delete photo"],
            destructiveButtonIndex: 2,
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              openPicker(false, index);
            } else if (buttonIndex === 2) {
              deleteSelectedPhoto(index);
            }
          }
        );
        return;
      }
      openPicker(true, index);
    }
  };

  const handleSubmit = async () => {
    // if all info is filled out: create random id -> upload image -> create post
    const selected = selectedImages.filter((image) => image.uri !== "");
    if (
      title.length > 0 &&
      content.length > 0 &&
      price &&
      selected.length > 0
    ) {
      setIsloading(true);
      setPrice(format(price)); // format price in case event listener didn't get triggered
      const id = uuid.v4();
      const imageUrls = await uploadMarketplaceImages(selectedImages, id);
      console.log("imageUrls: ", imageUrls);
      if (imageUrls.length > 0) {
        const isNsfw = await moderatePost(imageUrls);
        createMarketplacePostFirestore(imageUrls, id, isNsfw);
      }
    } else {
      alert("Please fill out all fields");
    }
  };

  const createMarketplacePostFirestore = async (imageUrls, id, isNsfw) => {
    try {
      const propObj = {
        buildingLocation: "",
        images: imageUrls,
        isNSFW: isNsfw,
        id: id,
        postContent: content,
        postTitle: title,
        price: price,
        userID: currentUser.userID,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userProfileImage: currentUser.userProfileImage,
        userColors: currentUser.colors,
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
        deleteMultipleImages(imageUrls);
        throw new Error("Error creating marketplace item", res.error);
      }
    } catch (err) {
      deleteMultipleImages(imageUrls);
    }
  };

  // Moderation //
  async function moderatePost(imageUrls) {
    let imgNsfw = false;
    for await (const url of imageUrls) {
      const eachImgNsfw = await moderateImage(url);
      console.log("each image NSFW is: ", eachImgNsfw);
      if (eachImgNsfw) {
        imgNsfw = true;
      }
    }
    const textNsfw = await moderateText(`${title} ${content}`);
    console.log("text NSFW is: ", textNsfw);
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
      const price = e.nativeEvent.text.replace(/[^0-9]/g, "");
      setPrice(format(price));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    horizontalMargin: {
      marginHorizontal: 16,
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
          <View style={styles.horizontalMargin}>
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
              placeholder="Type your text here"
              multiline={true}
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
          </View>
          {/* UPLOAD IMAGE */}
          <FlatList
            contentContainerStyle={{
              paddingLeft: 17,
              paddingRight: 9,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            keyExtractor={(item, index) => item + index}
            data={selectedImages}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handlePickImage(item.uri, index);
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    backgroundColor: "#EBEFF0",
                    marginRight: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <>
                    {imageLoading ? (
                      <Progress.CircleSnail
                        style={{
                          marginLeft: 17,
                        }}
                        strokeCap="square"
                        thickness={2.2}
                        size={20}
                        color={"rgba(57, 94, 102, 1)"}
                      />
                    ) : (
                      <>
                        {item.uri !== "" ? (
                          <Image
                            source={{ uri: item.uri }}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <ImageSVG />
                        )}
                      </>
                    )}
                  </>
                </TouchableOpacity>
              );
            }}
          />
          {/* <TouchableOpacity
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
            </TouchableOpacity> */}
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
        <View style={styles.horizontalMargin}>
          <TouchableOpacity
            id="submitPostButton"
            onPress={handleSubmit}
            style={[theme.primaryButton]}
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
        </View>
      )}
    </View>
  );
}

export default MarketplaceNewPostScreen;
