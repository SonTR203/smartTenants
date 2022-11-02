import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { constants } from "../../utils/constants";
import { createItemInFirestore } from "../../utils/firebase.services";
import { setTime } from "../../utils/setTime";
import { useAppContext } from "../../Context/AppContext";
import { doc, getDoc, Timestamp } from "@firebase/firestore";
import { db } from "../../firebase-config";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import { useTheme } from "../../ThemeContext";

function MarketplaceItemInfoScreen({ navigation }) {
  const [item, setItem] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [hoursAgo, setHoursAgo] = useState(null);
  const { currentUser, currentMarketplacePost } = useAppContext();
  const { styleVariables } = useTheme();

  // check for item passed from previous screen & display info
  useEffect(() => {
    if (currentMarketplacePost) {
      // use timestamp format from Firebase instead of just storing the timestamp in the database
      const time = setTime(currentMarketplacePost.timestamp.seconds * 1000);
      setHoursAgo(time);
      if (currentMarketplacePost.images.length > 0) {
        setImageList(currentMarketplacePost.images);
      }
      setItem(currentMarketplacePost);
    }
  }, [currentMarketplacePost]);

  const handleSendMessage = async () => {
    const id = `${currentUser.userID}-${item.id}`;
    const docRef = doc(db, `MessagingList`, id);
    const docSnap = await getDoc(docRef);
    let res = null;

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      // navigate to private messaging screen and update newMessages to "false", because we're already in the messaging screen
      res = true;
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
      res = await createItemInFirestore(`MessagingList`, id, {
        id: id,
        title: item.postTitle,
        sellerId: item.userID,
        sellerName: item.userFirstName + " " + item.userLastName,
        buyerId: currentUser.userID,
        buyerName: currentUser.firstName + " " + currentUser.lastName,
        messageImage: item.images[0],
        timestamp: Timestamp.fromDate(new Date()),
        hasPeople: [currentUser.userID, item.userID],
        price: item.price,
        isNew: true,
        marketplacePostId: currentMarketplacePost.id,
        unseenCount: 0,
      });
    }

    if (res) {
      navigation.navigate("PrivateMessagingScreen", {
        otherPersonName: item.userFirstName + " " + item.userLastName,
        otherPersonId: item.userID,
        channelId: id,
        messageImage: item.images[0],
        itemTitle: item.postTitle,
        isSeller: false,
        price: item.price,
        marketplacePostId: currentMarketplacePost.id,
      });
    }
  };

  if (item === null) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    scrollView: {
      backgroundColor: "white",
      marginTop: 20,
      marginLeft: 17,
      marginRight: 17,
    },
    flatList: {
      backgroundColor: "white",
      marginBottom: 17,
    },
    imagesContainer: (index) => ({
      backgroundColor: "#4d4d4d",
      marginLeft: index === 0 ? 0 : 17,
      height: constants.height * 0.3,
      borderRadius: 24,
      width:
        imageList.length < 2 ? constants.width * 0.9 : constants.width * 0.7,
    }),
    headerContainer: {
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    title: {
      maxWidth: constants.width * 0.74,
      fontSize: 28,
      fontWeight: "600",
      lineHeight: 34,
      color: styleVariables.colors.black,
    },
    price: {
      marginTop: 5,
      marginLeft: 11,
      color: "#395E66",
      fontSize: 22,
      fontWeight: "500",
      lineHeight: 28,
    },
    content: {
      color: styleVariables.colors.black,
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 20,
    },
    profileContainer: {
      marginTop: 24,
      marginBottom: 50,
      flexDirection: "row",
    },
    profileImage: {
      backgroundColor: "#4d4d4d",
      width: 43,
      height: 43,
      borderRadius: 12,
    },
    userNameContainer: {
      flex: 1,
      marginLeft: 8,
      flexDirection: "column",
    },
    userName: {
      fontWeight: "600",
      fontSize: 17,
      lineHeight: 24,
      color: styleVariables.colors.black,
    },
    hoursAgo: {
      fontWeight: "400",
      fontSize: 15,
      lineHeight: 22,
      color: styleVariables.colors.black,
    },
    messageButton: {
      // position: "absolute",
      marginLeft: 17,
      marginRight: 17,
      backgroundColor: "#395E66",
      borderRadius: 18,
      marginBottom: 25,
      height: 60,
      // width: constants.width - 34,
      alignItems: "center",
      justifyContent: "center",
      bottom: 1,
    },
    messageText: {
      fontWeight: "400",
      fontSize: 17,
      lineHeight: 22,
      color: "white",
      backgroundColor: "#395E66",
    },
    primaryClr: {
      color: styleVariables.colors.primary,
    },
    conditionContainer: {
      marginVertical: 16,
    },
    soldContainer: {
      marginRight: "auto",
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginTop: 12,
      borderRadius: 16,
      backgroundColor: styleVariables.colors.inputBackground,
    },
  });

  return (
    // CONTAINER
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* BODY SECTION  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {/* IMAGE LIST  */}
        <FlatList
          contentContainerStyle={styles.flatList}
          data={imageList}
          scrollEnabled={imageList.length > 1 ? true : false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <Image
                style={styles.imagesContainer(index)}
                source={{ uri: item }}
              />
            );
          }}
        />
        {/* ITEM HEADER INFO  */}
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode={"tail"}>
            {item.postTitle}
          </Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        {item.distance
          ? item.distance !== 0 && (
              <Text
                style={[styleVariables.fontSizes.callout, { fontSize: 20 }]}>
                {item.distance.toFixed(1) < 1
                  ? item.distance.toFixed(1) * 1000
                  : item.distance.toFixed(1)}
                {item.distance.toFixed(1) < 1 ? "m" : "km"}
              </Text>
            )
          : null}
        {/* ITEM SOLD STATUS */}
        {item.isSold ? (
          <View style={styles.soldContainer}>
            <Text style={[styleVariables.fontSizes.callout, styles.primaryClr]}>
              Sold on{" "}
              {new Date(item.soldDate.seconds * 1000).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}
            </Text>
          </View>
        ) : null}
        {/* ITEM CONDITION */}
        <View style={styles.conditionContainer}>
          <Text style={[styleVariables.fontSizes.body, styles.primaryClr]}>
            Condition: {item.condition}
          </Text>
        </View>
        {/* ITEM CONTENT  */}
        <View>
          <Text style={styles.content}>{item.postContent}</Text>
        </View>
        {/* PROFILE SECTION */}
        <View style={styles.profileContainer}>
          <DynamicProfilePicture
            user={{
              firstName: item.userFirstName,
              lastName: item.userLastName,
              userProfileImage: item.userProfileImage,
              colors: item.userColors,
            }}
            size={43}
            borderRadius={8}
          />
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>
              {`${item.userFirstName} ${item.userLastName}`}
            </Text>
            {hoursAgo ? (
              <Text style={styles.hoursAgo}>Posted {hoursAgo}</Text>
            ) : null}
          </View>
        </View>
        {/* SEND A MESSAGE BOX  */}
      </ScrollView>
      {item.userID === currentUser.userID ? null : (
        <TouchableOpacity
          onPress={handleSendMessage}
          style={styles.messageButton}>
          <Text style={styles.messageText}>Send a message</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default MarketplaceItemInfoScreen;
