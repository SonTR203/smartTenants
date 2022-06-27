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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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

const CreatePost = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const [postContent, setPostContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [image, setImage] = useState(null);
  const [isNsfw, setIsNsfw] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { currentUser } = useAppContext();
  const API_USER = "278265377";
  const API_KEY = "38GEu5SU32yy5SYjvzhe";

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  async function PostContent(imgUrl, id) {
    try {
      if (!imgUrl) {
        imgUrl = "no image posted";
      }

      const propObj = {
        id: id,
        postContent: postContent,
        userID: currentUser.userDocId,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userProfileImage: currentUser.userProfileImage,
        images: [imgUrl],
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
    setModalText("Post Failed");
    setModalVisible(true);
  }

  // ============================= IMAGE UPLOAD =============================

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  async function handleSelectedImage() {
    const id = uuid.v4();
    setIsloading(true);

    if (image == null) {
      PostContent(null, id);
    } else {
      try {
        if (!image.cancelled) {
          const imagePath = `Images/Posts/Newsfeed/${id}-${currentUser.userDocId}.jpg`;
          const imageUrl = await uploadImageToStorage(imagePath, image);
          PostContent(imageUrl, id);
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
      }
    }
  }

  // Moderation //
  async function moderateImage(imgUrl) {
    axios
      .get("https://api.sightengine.com/1.0/check.json", {
        params: {
          url: imgUrl,
          models: "nudity,wad,offensive,gore",
          api_user: API_USER,
          api_secret: API_KEY,
        },
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        if (error.response) console.log(error.response.data);
        else console.log(error.message);
      });
  }
  function checkResults(data) {
    let drugs = data.drugs > 0.5;
    let nudity = data.nudity.safe < 0.5;
    let offensive = data.offensive.prob > 0.5;
    let weapons = data.weapon > 0.5;
    let gore = data.gore.prob > 0.5;
    if (drugs || nudity || offensive || weapons || gore) {
      setIsNsfw(true);
    }
  }

  return (
    <ScrollView style={theme.pageContainer}>
      <View style={theme.globalMargins}>
        <StatusBar style="auto" />
        {isLoading && <ActivityIndicator size="large" />}

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

        <TouchableOpacity
          id="submitPostButton"
          onPress={handleSelectedImage}
          style={[theme.primaryButton, { marginBottom: 130 }]}
        >
          <Text
            style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
          >
            Submit post
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreatePost;
