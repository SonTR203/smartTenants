import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  Keyboard,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CurrencyInput from "react-native-currency-input";

import { db } from "../../firebase-config";
import { setDoc, Timestamp, doc } from "@firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useAppContext } from "../../Context/AppContext";
import uuid from "react-native-uuid";
import {
  compressFileSize,
  getFileInfo,
} from "../../utils/Profile/profile.services";

function MarketplaceNewPostScreen({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState("");
  const { currentUser } = useAppContext();

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

  const handleSelectedImage = async () => {
    if (title.length > 0 && content.length > 0 && price && image.length > 0) {
      const id = uuid.v4();
      const imageUrl = await uploadImage(image, id);
      createMarketplacePostFirestore(imageUrl, id);
    } else {
      console.log(title, image, content, price);
      alert("Please fill out all fields");
    }
  };

  const createMarketplacePostFirestore = async (imageUrl, id) => {
    try {
      await setDoc(doc(db, "Marketplace", id), {
        buildingLocation: "",
        images: [imageUrl],
        isNSFW: false,
        marketPlacePostID: id,
        postContent: content,
        postTitle: title,
        price: price,
        userID: currentUser.userDocId,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userProfileImage: currentUser.userProfileImage,
        timestamp: Timestamp.fromDate(new Date()),
      })
        .then(() => {
          console.log("Marketplace new item Document successfully written!");
          alert("Marketplace item successfully created!");
          navigation.navigate("MarketplaceScreen", { reload: true });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (err) {
      console.log("ERROR Posting to DB: ", err);
      alert("Failed to post new item. Please try again later");
      deleteFailedPostImage(imageUrl);
    }
  };

  const deleteFailedPostImage = async (imageName) => {
    try {
      const imageRef = ref(getStorage(), imageName);
      await deleteObject(imageRef)
        .then(() => {
          // File deleted successfully
          console.log("image from failed post deleted!");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          throw new Error(error);
        });
    } catch (error) {
      console.log("ERROR deleting failed post Storage image: ", error);
    }
  };

  async function uploadImage(newImage, postId) {
    const imageName = `Images/Posts/Marketplace/${currentUser.userDocId}-${postId}.jpg`;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", newImage, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), imageName);
    await uploadBytes(fileRef, blob);

    const imgUrl = await getDownloadURL(fileRef);
    return imgUrl;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingLeft: 17,
        paddingRight: 17,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
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
              {
                height: 64,
                paddingTop: 22,
              },
            ]}
          />

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
              {
                minHeight: 68 + 44,
                paddingTop: 22,
                paddingBottom: Platform.OS === "android" ? 70 : 0,
              },
            ]}
          />

          <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
            Price
          </Text>
          <CurrencyInput
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              {
                height: 64,
                paddingTop: 22,
              },
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

          <TouchableOpacity
            id="uploadImageButton"
            onPress={pickImage}
            style={[
              theme.secondaryButton,
              {
                flexDirection: "row",
              },
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[
                theme.secondaryButtonText,
                styleVariables.fontSizes.body,
                {
                  maxWidth: "85%",
                },
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

        <TouchableOpacity
          id="submitPostButton"
          onPress={handleSelectedImage}
          style={[theme.primaryButton, {}]}
        >
          <Text
            style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
          >
            Submit post
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default MarketplaceNewPostScreen;
