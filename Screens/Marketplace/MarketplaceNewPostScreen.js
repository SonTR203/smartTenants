import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList,
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
import {
  format,
  updateImages,
  uploadMarketplaceImages,
} from "../../utils/Marketplace/marketplace.services";
import { maxImages } from "../../utils/constants";
import * as Progress from "react-native-progress";
import ImageSVG from "../../components/Icons/ImageSVG";
import ChevronDownSVG from "../../components/Icons/ChevronDownSVG";
import Modal from "react-native-modal";
import ModalConditionPicker from "../../components/ModalConditionPicker";
import ModalCategoryPicker from "../../components/ModalCategoryPicker";
import * as ImagePicker from "expo-image-picker";

function MarketplaceNewPostScreen({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(null);
  const [condition, setCondition] = useState(null);
  const [category, setCategory] = useState(null);
  const [conditionModalVisible, setConditionModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { currentUser, currentUserBuilding } = useAppContext();
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

  const handleSelectedImages = (response, index, isUsingExpo) => {
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
        uri: isUsingExpo ? response.uri : response.path,
      };
    }
    // artificially delay the image loading
    wait(500).then(() => {
      setImageLoading(false);
      setSelectedImages(newImages);
    });
  };

  useEffect(() => {
    if (category === "Free Goods") {
      setPrice("$0.00");
    }
  }, [category]);

  const openPicker = async (multiple, index) => {
    try {
      let options = {
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      };
      await ImagePicker.launchImageLibraryAsync(options)
        .then(async (image) => {
          if (!image.cancelled) {
            handleSelectedImages(image, index, true);
          }
        })
        .catch((error) => {
          console.log("error expo image picker: ", error);
        });
    } catch (err) {
      console.log("error: ", err);
      // Alert.alert(
      //   "This functionality is not available on Expo Go. Please use the standalone version."
      // );
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
      price.includes("$") ? null : setPrice(format(price)); // format price in case event listener didn't get triggered
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
        buildingId: currentUserBuilding.id,
        buildingCoord: currentUserBuilding.location,
        images: imageUrls,
        isNSFW: isNsfw,
        id: id,
        isSold: false,
        postContent: content,
        postTitle: title,
        isSavedBy: [],
        price: price,
        category: category,
        condition: condition,
        userID: currentUser.userID,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userProfileImage: currentUser.userProfileImage,
        userBuildingName: currentUser.buildingName,
        userColors: currentUser.colors,
        timestamp: Timestamp.fromDate(new Date()),
      };

      const res = await createItemInFirestore("Marketplace", id, propObj);
      setIsloading(false);
      if (isNsfw) {
        // alert(
        //   "We've detected potential suggestive or profane content. Your post will be reviewed."
        // );
        navigation.goBack();
        navigation.navigate("MarketplaceNavigator", {
          screen: "MarketplaceScreen",
          params: {
            reload: true,
            saveModal: true,
            modalType: "warning",
            message:
              "We’ve detected potential inappropriate content. Your post will be reviewed.",
          },
        });
      } else if (res) {
        // alert("Marketplace item successfully created!");
        navigation.goBack();
        navigation.navigate("MarketplaceNavigator", {
          screen: "MarketplaceScreen",
          params: {
            reload: true,
            saveModal: true,
            modalType: "success",
            message: "Listing created",
          },
        });
      } else {
        deleteMultipleImages(imageUrls);
        throw new Error("Error creating marketplace item", res.error);
      }
    } catch (err) {
      deleteMultipleImages(imageUrls);
      navigation.navigate("MarketplaceNavigator", {
        screen: "MarketplaceScreen",
        params: {
          reload: true,
          saveModal: true,
          modalType: "error",
          message: "Something went wrong, please try again",
        },
      });
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

  const handleEndEditing = (e) => {
    if (e.nativeEvent.text.length > 0) {
      const price = e.nativeEvent.text.replace(/[^0-9]/g, "");
      setPrice(format(price));
    }
  };

  const renderSelectedImages = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handlePickImage(item.uri, index);
        }}
        style={styles.imageContainer}
      >
        <>
          {imageLoading ? (
            <Progress.CircleSnail
              style={styles.loadingMargin}
              strokeCap="square"
              thickness={2.2}
              size={20}
              color={"rgba(57, 94, 102, 1)"}
            />
          ) : (
            <>
              {item.uri !== "" ? (
                <Image source={{ uri: item.uri }} style={styles.imageStyle} />
              ) : (
                <ImageSVG />
              )}
            </>
          )}
        </>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    horizontalMargin: {
      marginHorizontal: 16,
    },
    textInputDescription: {
      textAlignVertical: "top",
      height: 160,
      paddingTop: 16,
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
    keyboardContainer: {
      flex: 1,
      height: "100%",
    },
    imageSelectionContainer: {
      paddingLeft: 17,
      paddingRight: 9,
      marginTop: 12,
      marginBottom: 12,
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: "#EBEFF0",
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingMargin: {
      marginLeft: 17,
    },
    imageStyle: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    input: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modal: {
      display: "flex",
      justifyContent: "flex-end",
      margin: 0,
    },
    submitButton: {
      marginTop: 12,
    },
  });

  return (
    // CONTAINER
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* BODY CONTAINER  */}
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior="height">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* TEXT INPUT SECTIONS  */}
          <View style={styles.horizontalMargin}>
            {/* TITLE  */}
            <Text
              style={[
                theme.textInputLabel,
                styleVariables.fontSizes.calloutBold,
              ]}
            >
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
              style={[theme.textInput, styleVariables.fontSizes.body]}
            />
            {/* CATEGORY */}
            <Text
              style={[
                theme.textInputLabel,
                styleVariables.fontSizes.calloutBold,
              ]}
            >
              Category
            </Text>
            <TouchableOpacity
              onPress={() => {
                setCategoryModalVisible(true);
              }}
            >
              <View style={[theme.textInput, styles.input]}>
                <Text
                  style={[
                    styleVariables.fontSizes.body,
                    {
                      color: !category
                        ? styleVariables.colors.placeholderText
                        : styleVariables.colors.black,
                    },
                  ]}
                >
                  {category || "Choose category"}
                </Text>
                <ChevronDownSVG />
              </View>
            </TouchableOpacity>
            <Modal
              id="categorySelectionModal"
              isVisible={categoryModalVisible}
              backdropOpacity={0.5}
              onBackdropPress={() => setCategoryModalVisible(false)}
              style={styles.modal}
              statusBarTranslucent={true}
            >
              <ModalCategoryPicker
                theme={theme}
                styleVariables={styleVariables}
                setCategoryModalVisible={setCategoryModalVisible}
                setCategory={setCategory}
              />
            </Modal>
            {/* CONDITION */}
            <Text
              style={[
                theme.textInputLabel,
                styleVariables.fontSizes.calloutBold,
              ]}
            >
              Condition
            </Text>
            <TouchableOpacity
              onPress={() => {
                setConditionModalVisible(true);
              }}
            >
              <View style={[theme.textInput, styles.input]}>
                <Text
                  style={[
                    styleVariables.fontSizes.body,
                    {
                      color: !condition
                        ? styleVariables.colors.placeholderText
                        : styleVariables.colors.black,
                    },
                  ]}
                >
                  {condition || "Choose condition"}
                </Text>
                <ChevronDownSVG />
              </View>
            </TouchableOpacity>
            <Modal
              id="conditionSelectionModal"
              isVisible={conditionModalVisible}
              backdropOpacity={0.5}
              onBackdropPress={() => setConditionModalVisible(false)}
              style={styles.modal}
              statusBarTranslucent={true}
            >
              <ModalConditionPicker
                theme={theme}
                styleVariables={styleVariables}
                setConditionModalVisible={setConditionModalVisible}
                setCondition={setCondition}
                condition={condition}
              />
            </Modal>
            {/* DESCRIPTION */}
            <Text
              style={[
                theme.textInputLabel,
                styleVariables.fontSizes.calloutBold,
              ]}
            >
              Description
            </Text>
            <TextInput
              placeholderTextColor={styleVariables.colors.placeholderText}
              onChangeText={(text) => {
                setContent(text);
              }}
              placeholder="Type item description here"
              multiline={true}
              style={[
                theme.textInput,
                styleVariables.fontSizes.body,
                styles.textInputDescription,
              ]}
            />

            {/* PRICE */}
            <Text
              style={[
                theme.textInputLabel,
                styleVariables.fontSizes.calloutBold,
              ]}
            >
              Price
            </Text>
            <TextInput
              placeholderTextColor={styleVariables.colors.placeholderText}
              editable={category !== "Free Goods"}
              keyboardType="numeric"
              value={price}
              placeholder="$0.00"
              onEndEditing={handleEndEditing}
              onChangeText={setPrice}
              style={[
                category != "Free Goods"
                  ? theme.textInput
                  : theme.textInputDisabled,
                styleVariables.fontSizes.body,
              ]}
            />
          </View>
          {/* UPLOAD IMAGE */}
          <FlatList
            contentContainerStyle={styles.imageSelectionContainer}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            keyExtractor={(item, index) => item + index}
            data={selectedImages}
            renderItem={renderSelectedImages}
          />
          {isLoading ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={styleVariables.colors.primary}
            />
          ) : (
            <View style={[styles.horizontalMargin, styles.submitButton]}>
              {/* SUBMIT BUTTON  */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default MarketplaceNewPostScreen;
