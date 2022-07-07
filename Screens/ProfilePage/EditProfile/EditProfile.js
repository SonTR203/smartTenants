//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../../firebase-config";
import ModalPicker from "../../../components/ModalBuildingPicker";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../Context/AppContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import {
  compressFileSize,
  getFileInfo,
} from "../../../utils/Profile/profile.services";

const EditProfile = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [buildingAddress, setBuildingAddress] = useState(
    currentUser.buildingAddress
  );
  const [buildingID, setBuildingID] = useState(currentUser.buildingID);
  const [modalVisible, setModalVisible] = useState(false);
  const [unitNumber, setUnitNumber] = useState(currentUser.unitNumber);
  const [userProfileImage, setUserProfileImage] = useState(
    currentUser.userProfileImage
  );
  const [saveModal, setSaveModal] = useState(false);

  const changeModalVisibility = (bool) => {
    setModalVisible(bool);
  };

  const setData = (building) => {
    building = building.buildingAddress.stringValue;
    setBuildingAddress(building);
    setBuildingID(building.replace(/\s/g, ""));
  };

  const checkTextInputs = () => {
    try {
      if (
        firstName.length > 1 &&
        lastName.length > 1 &&
        email.length > 1 &&
        buildingAddress.length > 1 &&
        unitNumber
      ) {
        return true;
      } else {
        Alert.alert("ERROR", "Please fill out all fields");
        return false;
      }
    } catch (error) {
      console.log("ERROR Edit profile: ", error);
    }
  };

  async function saveProfileInfo() {
    const userDocRef = doc(db, "Tenants", currentUser.userID);
    if (checkTextInputs()) {
      try {
        await updateDoc(userDocRef, {
          firstName,
          lastName,
          buildingID,
          buildingAddress,
          email,
          unitNumber,
        });

        setCurrentUser({
          firstName,
          lastName,
          buildingID,
          buildingAddress,
          email,
          unitNumber,
          isAdmin: currentUser.isAdmin,
          myMarketplacePosts: currentUser.myMarketplacePosts,
          myPosts: currentUser.myPosts,
          tenantAuthorized: currentUser.tenantAuthorized,
          userID: currentUser.userID,
          visibleNotices: currentUser.visibleNotices,
          visibleAnnouncements: currentUser.visibleAnnouncements,
          userProfileImage: currentUser.userProfileImage,
        });

        setSaveModal(true);
      } catch (error) {
        console.log(error);
      }
    }
  }

  //=========================== Change profile picture ====================

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      presentationStyle: 0,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const size = await getFileInfo(result.uri);
      console.log("file size: ", size);
      if (size > 5) {
        Alert.alert(
          "ERROR",
          "File size is too large. Please select a file smaller than 5MB"
        );
        return;
      }
      const path = await compressFileSize(result.uri);
      uploadImage(path.uri);
    }
  };

  async function uploadImage(newImage) {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          // return the blob
          resolve(xhr.response);
        };

        xhr.onerror = function () {
          // something went wrong
          reject(new Error("uriToBlob failed"));
        };
        // this helps us get a blob
        xhr.responseType = "blob";
        xhr.open("GET", newImage, true);

        xhr.send(null);
      });

      const imageName = `userProfileImages/${currentUser.userID}/avatar.jpg`;
      const fileRef = ref(getStorage(), imageName);
      await uploadBytes(fileRef, blob);

      const imgUrl = await getDownloadURL(fileRef);
      setUserProfileImage(imgUrl);
      changeProfileImageInDatabase(imgUrl);
      Alert.alert("Success", "Profile image updated");
    } catch (err) {
      console.log("error uploading image: ", err);
    }
  }

  async function changeProfileImageInDatabase(imgUrl) {
    const userDocRef = doc(db, "Tenants", currentUser.userID);

    try {
      await updateDoc(userDocRef, {
        userProfileImage: imgUrl,
      });

      setCurrentUser({
        ...currentUser,
        userProfileImage: imgUrl,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView edges={["top"]}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView style={[theme.pageContainer, theme.globalMargins]}>
          <StatusBar style="dark" />

          <Modal
            animationType="slide"
            transparent={false}
            statusBarTranslucent={true}
            visible={saveModal}
            onRequestClose={() => {
              setSaveModal(!saveModal);
            }}
            onShow={() => {
              setTimeout(() => {
                setSaveModal(!saveModal);
                navigation.navigate("ProfileGeneral");
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
                  {"Changes Saved"}
                </Text>
              </View>
            </View>
          </Modal>
          {/* userHeader */}
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
              paddingVertical: 34,
            }}
          >
            <Image
              source={{ uri: userProfileImage }}
              style={{ height: 85, width: 85, borderRadius: 18 }}
            />
            <View style={{ paddingLeft: 17 }}>
              <Text
                style={[styleVariables.fontSizes.title, { marginBottom: 4 }]}
              >
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <TouchableOpacity
                onPress={() => pickImage()}
                style={{ flexDirection: "row" }}
              >
                <Text
                  style={[
                    styleVariables.fontSizes.body,
                    { color: styleVariables.colors.primary, opacity: 0.66 },
                  ]}
                >
                  Change profile picture
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={styleVariables.colors.primary}
                  style={{ opacity: 0.66 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* signupInputs */}
          <View id="signupInputs">
            <View id="firstNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                First Name
              </Text>
              <TextInput
                placeholder="John"
                defaultValue={currentUser.firstName}
                onChangeText={(text) => setFirstName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View id="lastNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Last name
              </Text>
              <TextInput
                placeholder="Doe"
                defaultValue={currentUser.lastName}
                onChangeText={(text) => setLastName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id="unitNumberInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Unit number
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="1234"
                defaultValue={`${
                  currentUser.unitNumber ? currentUser.unitNumber : ""
                }`}
                onChangeText={(text) => setUnitNumber(parseInt(text))}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id="buildingSelect">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  { zIndex: 2 },
                ]}
              >
                Building address
              </Text>
              <TouchableOpacity
                onPress={() => {
                  changeModalVisibility(true);
                }}
              >
                <Text
                  style={[
                    theme.textInput,
                    styleVariables.fontSizes.body,
                    { color: "#00000080" },
                  ]}
                >
                  {buildingAddress}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              nRequestClose={() => {
                changeModalVisibility(false);
              }}
            >
              <ModalPicker
                changeModalVisibility={changeModalVisibility}
                setData={setData}
              />
            </Modal>

            <View id="emailInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                {/* ================== will need to research to see if we can set this email to change the one in the authentication tab in firebase========== */}
                Email
              </Text>
              <TextInput
                placeholder="name@company.com"
                defaultValue={currentUser.email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id="passwordInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Password
              </Text>
              <TextInput
                placeholder="*******"
                secureTextEntry={true}
                //================================= will need to research how to do this SAFELY ==========================
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
          </View>

          {/* save button */}
          <TouchableOpacity id="save" onPress={saveProfileInfo}>
            <View style={[theme.primaryButton, { marginTop: 17 }]}>
              <Text
                style={[
                  theme.primaryButtonText,
                  styleVariables.fontSizes.bodyBold,
                ]}
              >
                Save
              </Text>
            </View>
          </TouchableOpacity>

          {/* cancel button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProfileGeneral");
            }}
          >
            <View style={[theme.secondaryButton, { marginBottom: 68 }]}>
              <Text
                style={[
                  theme.secondaryButtonText,
                  styleVariables.fontSizes.bodyBold,
                ]}
              >
                Cancel
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
