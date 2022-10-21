// Modal: https://reactnative.dev/docs/modal

import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import { Timestamp } from "@firebase/firestore";
import uuid from "react-native-uuid";
import {
  createItemInFirestore,
  uploadImageToStorage,
} from "../../utils/firebase.services";
import {
  checkPermissionMediaLibrary,
  compressFileSize,
  getFileInfo,
} from "../../utils/Profile/profile.services";
import { moderateImage, moderateText } from "../../utils/moderation.services";
import PopupModal from "../../components/PopupModal";
import NewsfeedImageSVG from "../../components/Icons/NewsfeedImageSVG";

const CreatePost = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { currentUser } = useAppContext();

  async function PostContent(imgUrl, id, isNsfw) {
    try {
      if (!imgUrl) {
        imgUrl = "no image posted";
      }

      const propObj = {
        id: id,
        postContent: postContent,
        userID: currentUser.userID,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userColors: currentUser.colors,
        userProfileImage: currentUser.userProfileImage,
        images: [imgUrl],
        isNSFW: isNsfw,
        timestamp: Timestamp.fromDate(new Date()),
        peopleWhoLiked: [],
        commentCount: 0,
        userBuildingName: currentUser.buildingName,
      };

      const res = await createItemInFirestore("Newsfeed", id, propObj);
      if (isNsfw) {
        navigation.goBack();
        navigation.navigate("Newsfeed", {
          reload: true,
          saveModal: true,
          modalType: "warning",
          message:
            "We’ve detected potential inappropriate content. Your post will be reviewed.",
        });
        /* Going back to the previous screen. */
        // navigation.pop();
      } else if (res) {
        postSuccess();
      } else {
        throw new Error("Error creating newsfeed item", res);
      }
    } catch (error) {
      console.log(error);
      postFailure();
    }
  }

  function postSuccess() {
    setIsloading(false);
    navigation.goBack();
    navigation.navigate("Newsfeed", {
      reload: true,
      saveModal: true,
      modalType: "success",
      message: "Post submitted",
    });

    // navigation.pop();
  }

  function postFailure() {
    setIsloading(false);
    navigation.goBack();
    navigation.navigate("Newsfeed", {
      reload: true,
      saveModal: true,
      modalType: "error",
      message: "Something went wrong, please try again",
    });

    // navigation.pop();
  }

  // ============================= IMAGE UPLOAD =============================

  const pickImage = async () => {
    const permissionResult = await checkPermissionMediaLibrary();

    if (permissionResult !== false) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.cancelled) {
        const size = await getFileInfo(result.uri);
        if (size > 5) {
          Alert.alert(
            "ERROR",
            "File size is too large. Please select a file smaller than 5MB"
          );
          return;
        }
        const path = await compressFileSize(result.uri);
        setImage(path.uri);
      }
    }
  };

  async function handleSelectedImage() {
    const id = uuid.v4();
    setIsloading(true);

    if (image == null) {
      const isNsfw = await moderateText(postContent);
      if (isNsfw !== undefined) {
        PostContent(null, id, isNsfw);
      } else {
        navigation.setParams({
          reload: null,
          saveModal: true,
          modalType: "error",
          message: "Something went wrong, please try again",
        });
        setIsloading(false);
        return;
      }
    } else {
      try {
        if (!image.cancelled) {
          const imagePath = `Images/Posts/Newsfeed/${id}-${currentUser.userID}.jpeg`;
          const imageUrl = await uploadImageToStorage(imagePath, image);
          const isNsfw = await moderatePost(imageUrl);
          PostContent(imageUrl, id, isNsfw);
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
      }
    }
  }

  // Moderation //
  async function moderatePost(imageUrl) {
    const imgNsfw = await moderateImage(imageUrl);
    const textNsfw = await moderateText(postContent);
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

  useEffect(() => {
    if (!postContent && !image) return setButtonDisabled(true);
    setButtonDisabled(false);
  }, [postContent, image]);

  const styles = StyleSheet.create({
    loader: {
      marginBottom: 20,
    },
    buttonDisabled: {
      marginTop: "auto",
      backgroundColor: "#748E94",
    },
    container: {
      flex: 1,
    },
    submitButton: {
      marginTop: "auto",
    },
    uploadImageButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 16,
      marginTop: 12,
      marginBottom: 12,
      backgroundColor: styleVariables.colors.inputBackground,
    },
    uploadImageText: {
      color: styleVariables.colors.primary,
      marginRight: 8,
    },
    keyboardContainer: {
      flex: 1,
      height: "100%",
    },
    iOSMarginTop: {
      marginTop: "auto",
    },
    androidOSMarginTop: {
      marginTop: "none",
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={theme.pageContainer}
    >
      <View style={[theme.globalMargins, styles.container]}>
        <StatusBar style="auto" />
        <Modal
          animationType="slide"
          transparent={true}
          // statusBarTranslucent={true}
          visible={route.params?.saveModal === true ? true : false}
          onRequestClose={() => {
            navigation.setParams({
              saveModal: false,
              reload: null,
            });
          }}
          onShow={() => {
            setTimeout(() => {
              navigation.setParams({
                saveModal: false,
                reload: null,
              });
            }, 2000);
          }}
        >
          <PopupModal
            modalType={route.params?.modalType}
            message={route.params?.message}
          />
        </Modal>
        <View id="statusInput">
          <Text
            style={[theme.textInputLabel, styleVariables.fontSizes.calloutBold]}
          >
            What's on your mind?
          </Text>
          <TextInput
            placeholderTextColor={styleVariables.colors.placeholderText}
            onChangeText={(text) => {
              setPostContent(text);
            }}
            placeholder="Type your post here"
            multiline={true}
            maxLength={280}
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              {
                textAlignVertical: "top",
                height: 200,
                paddingTop: 16,
              },
            ]}
          ></TextInput>
        </View>

        <View id="imageUploadPreview" style={theme.container}>
          {image && (
            <Image source={{ uri: image }} style={theme.imageUploadPreview} />
          )}
        </View>

        <TouchableOpacity
          id="uploadImageButton"
          onPress={pickImage}
          style={styles.uploadImageButton}
        >
          <Text
            style={[styles.uploadImageText, styleVariables.fontSizes.bodyBold]}
          >
            Upload image
          </Text>
          <NewsfeedImageSVG />
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={styleVariables.colors.primary}
          />
        ) : (
          <KeyboardAvoidingView
            style={[
              styles.keyboardContainer,
              Platform.OS === "ios"
                ? styles.iOSMarginTop
                : styles.androidOSMarginTop,
            ]}
            behavior="height"
          >
            <TouchableOpacity
              id="submitPostButton"
              onPress={handleSelectedImage}
              disabled={buttonDisabled}
              style={[
                theme.primaryButton,
                buttonDisabled ? styles.buttonDisabled : styles.submitButton,
              ]}
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
          </KeyboardAvoidingView>
        )}
      </View>
    </ScrollView>
  );
};

export default CreatePost;
