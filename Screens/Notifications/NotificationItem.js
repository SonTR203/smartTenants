import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../../Context/AppContext";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../../firebase-config";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { setTime } from "../../utils/setTime";

function NotificationItem({
  notifications,
  navigation,
  theme,
  styleVariables,
  wasSeenVar,
  setWasSeenVar,
}) {
  const [timeSincePost, setTimeSincePost] = useState("");

  const { currentUser, setPost } = useAppContext();

  useEffect(() => {
    if (notifications) {
      (function calculateTime() {
        const time = setTime(notifications.timestamp);
        setTimeSincePost(time);
      })();
    }
  }, [notifications]);

  const setWasSeenToTrue = async (notifications) => {
    const colRef = doc(
      db,
      "Tenants",
      `${currentUser.userDocId}`,
      "Notifications",
      notifications.id
    );
    await updateDoc(colRef, {
      wasSeen: true,
    }).then(() => {
      setWasSeenVar(!wasSeenVar);
    });
  };

  async function viewNotificationPost(notifications) {
    const docRef = doc(db, "Newsfeed", `${notifications.postID}`);
    const docSnap = await getDoc(docRef);
    const postData = docSnap.data();
    const formattedPost = {
      ...postData,
      id: docSnap.id,
    };

    // const likesColReference = collection(
    //   db,
    //   "Newsfeed",
    //   `${docSnap.id}`,
    //   "peopleWhoLiked"
    // );
    // const data = await getDocs(likesColReference);
    // let numberOfLikes = data.docs.length;

    // let post = {
    //   comments: postData.comments.arrayValue,
    //   id: docSnap.id,
    //   image: postData.images,
    //   peopleWhoLiked: postData.peopleWhoLiked,
    //   postContent: postData.postContent,
    //   userID: postData.userID,
    //   userProfileImage: postData.userProfileImage,
    //   userFirstName: postData.userFirstName,
    //   userLastName: postData.userLastName,
    //   numberOfLikes: numberOfLikes,
    //   timestamp: postData.timestamp,
    // };

    if (docSnap.exists()) {
      setPost(formattedPost);
      navigation.navigate("IndividualPosts");
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  if (notifications.postID == "") {
    return (
      <View
        id="post"
        style={[theme.cardButton, styles(styleVariables).container]}
      >
        <View id="notificationContent">
          <View
            id="timeStamp-readState"
            style={styles(styleVariables).timestampContainer}
          >
            <Text
              style={[
                styleVariables.fontSizes.callout,
                styles(styleVariables).timestampText,
              ]}
            >
              {timeSincePost}
            </Text>
            {notifications.wasSeen == false && (
              <View
                id="notificationIndice"
                style={styles(styleVariables).notificationIndice}
              />
            )}
          </View>
          <Text>{notifications.content}</Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
          style={styles(styleVariables).chevron}
        />
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        // navigate to post page on press
        id="post"
        onPress={() => {
          viewNotificationPost(notifications);
          setWasSeenToTrue(notifications);
        }}
        style={[theme.cardButton, styles(styleVariables).container]}
      >
        <View id="notificationContent">
          <View
            id="timeStamp-readState"
            style={styles(styleVariables).timestampContainer}
          >
            <Text
              style={[
                styleVariables.fontSizes.callout,
                styles(styleVariables).timestampText,
              ]}
            >
              {timeSincePost}
            </Text>
            {notifications.wasSeen == false && (
              <View
                id="notificationIndice"
                style={styles(styleVariables).notificationIndice}
              />
            )}
          </View>
          <Text>{notifications.content}</Text>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
          style={styles(styleVariables).chevron}
        />
      </TouchableOpacity>
    );
  }
}

const styles = (styleVariables) =>
  StyleSheet.create({
    container: { marginTop: 0, marginBottom: 17 },
    timestampContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    timestampText: { opacity: 0.66 },
    notificationIndice: {
      height: 8,
      width: 8,
      backgroundColor: styleVariables.colors.primary,
      borderRadius: 99,
      marginLeft: 8,
    },
    chevron: { opacity: 0.33 },
  });

export default NotificationItem;
