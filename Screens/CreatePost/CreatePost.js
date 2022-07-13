// Modal: https://reactnative.dev/docs/modal

import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const CreatePost = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const [postContent, setPostContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsloading] = useState(false);
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
        userProfileImage: currentUser.userProfileImage,
        images: [imgUrl],
        isNSFW: isNsfw,
        timestamp: Timestamp.fromDate(new Date()),
        peopleWhoLiked: [],
        commentCount: 0,
      };

      const res = await createItemInFirestore("Newsfeed", id, propObj);
      if (res) {
        postSuccess();
      } else {
        throw new Error("Error creating newsfeed item", res);
      }
      if (isNsfw) {
        alert(
          "We've detected potential suggestive or profane content. Your post will be reviewed."
        );
      }
    } catch (error) {
      console.log(error);
      postFailure();
    }
  }

  function postSuccess() {
    setIsloading(false);
    setModalText("Post Successful!");
    setModalVisible(true);
  }

  function postFailure() {
    setIsloading(false);
    setModalText("Post Failed");
    setModalVisible(true);
  }

  // ============================= IMAGE UPLOAD =============================

  const pickImage = async () => {
    const permissionResult = await checkPermissionMediaLibrary();

    if (permissionResult !== false) {
      let result = await ImagePicker.launchImageLibraryAsync({
        presentationStyle: 0,
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
        alert("Error moderating text");
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

  return (
    <ScrollView style={theme.pageContainer}>
      <View style={theme.globalMargins}>
        <StatusBar style="auto" />

        <Modal
          animationType="slide"
          transparent={false}
          statusBarTranslucent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          onShow={() => {
            setTimeout(() => {
              setModalVisible(!modalVisible);
              navigation.navigate("Newsfeed", { reload: true });
            }, 2000);
          }}
        >
          <View style={theme.container}>
            <View style={theme.modalView}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "Roboto_400Regular",
                  color: "#191919",
                }}
              >
                {modalText}
              </Text>
            </View>
          </View>
        </Modal>

        <View id="statusInput">
          <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
            What's on your mind?
          </Text>
          <TextInput
            placeholderTextColor={styleVariables.colors.placeholderText}
            onChangeText={(text) => {
              setPostContent(text);
            }}
            placeholder="280 characters maximum"
            multiline={true}
            maxLength={280}
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              {
                minHeight: 68 + 44,
                paddingTop: 22,
                paddingBottom: Platform.OS === "android" ? 70 : 0,
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
          style={theme.secondaryButton}
        >
          <Text
            style={[theme.secondaryButtonText, styleVariables.fontSizes.body]}
          >
            Upload image{" "}
            <MaterialCommunityIcons
              name="image-plus"
              size={18}
              color={styleVariables.colors.primary}
            />
          </Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={styleVariables.colors.primary}
          />
        ) : (
          <TouchableOpacity
            id="submitPostButton"
            onPress={handleSelectedImage}
            style={[theme.primaryButton, { marginBottom: 130 }]}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginBottom: 20,
  },
});

export default CreatePost;
