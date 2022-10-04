import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../../firebase-config";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { setTime } from "../../utils/setTime";
import ChevronRightSVG from "../../components/Icons/ChevronRightSVG";

function NotificationItem({
  notifications,
  navigation,
  theme,
  styleVariables,
  wasSeenVar,
  setWasSeenVar,
}) {
  const [timeSincePost, setTimeSincePost] = useState("");

  const { currentUser, setPost, notificationBadges } = useAppContext();

  useEffect(() => {
    if (notifications) {
      (function calculateTime() {
        const time = setTime(notifications.timestamp.seconds * 1000);
        setTimeSincePost(time);
      })();
    }
  }, [notifications]);

  const setWasSeenToTrue = async (notifications) => {
    const colRef = doc(
      db,
      "Tenants",
      `${currentUser.userID}`,
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
    if (
      notifications.content.includes("declined") ||
      notifications.content.includes("deleted")
    ) {
      setWasSeenToTrue(notifications);
      return;
    }

    // send comment id to scroll to comment
    const commentId = notifications.content.includes("commented")
      ? notifications.id
      : null;

    const docRef = doc(db, "Newsfeed", `${notifications.postID}`);
    const docSnap = await getDoc(docRef);
    const postData = docSnap.data();
    const formattedPost = {
      ...postData,
      id: docSnap.id,
      updated: false,
    };

    if (docSnap.exists()) {
      setPost(formattedPost);
      navigation.navigate("IndividualPosts", {
        commentId: commentId,
      });
      setWasSeenToTrue(notifications);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  const handleViewNotifications = () => {
    viewNotificationPost(notifications);
  };

  return (
    <TouchableOpacity
      // navigate to post page on press
      disabled={notifications.postID == "" ? true : false}
      onPress={handleViewNotifications}
      style={[theme.cardButton, styles.container]}
      activeOpacity={1}
    >
      <View id="notificationContent">
        <View id="timeStamp-readState" style={styles.timestampContainer}>
          <Text style={[styleVariables.fontSizes.callout]}>
            {timeSincePost}
          </Text>
          {notificationBadges.unseen.includes(notifications.id) && (
            <View
              id="notificationIndice"
              style={styles.notificationIndice(styleVariables)}
            />
          )}
        </View>
        <Text style={styles.headerText}>
          {notifications.header ? (
            <Text style={styles.fontFamily}>{notifications.header} </Text>
          ) : null}
          {notifications.content}
        </Text>
      </View>

      {!notifications.postID == "" ? (
        <ChevronRightSVG stroke="#D2D2D2" />
      ) : null}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { marginTop: 0, marginBottom: 16 },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationIndice: (styleVariables) => ({
    height: 8,
    width: 8,
    backgroundColor: styleVariables.colors.notificationBadge,
    borderRadius: 99,
    marginLeft: 8,
  }),
  headerText: {
    fontSize: 17,
    lineHeight: 22,
    color: "#4D4D4D",
    fontFamily: "Roboto_400Regular",
    paddingRight: 21,
  },
  fontFamily: {
    fontFamily: "Roboto_500Medium",
  },
});

export default NotificationItem;
