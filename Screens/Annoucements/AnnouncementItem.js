import React, { memo, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { setTime } from "../../utils/setTime";
import { useAppContext } from "../../Context/AppContext";
import { updateItemInFirestore } from "../../utils/firebase.services";
import { StatusBar } from "expo-status-bar";

function AnnouncementItem({
  content,
  attachment,
  timestamp,
  wasSeen,
  theme,
  id,
  navigation,
  styleVariables,
}) {
  const [timeSinceAnnouncement, setTimeSinceAnnouncement] = useState("");
  const [viewed, setViewed] = useState(false);
  const { currentUser, announcements, setAnnouncements } = useAppContext();

  const styles = StyleSheet.create({
    announcementInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",

      marginBottom: 16,
    },
    imageAndName: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    profileIcon: {
      height: 48,
      width: 48,
      borderRadius: 8,
    },
    profileName: {
      color: "#4D4D4D",
    },
    announcementContent: {
      color: "#4D4D4D",
    },
    announcementIndice: {
      height: 8,
      width: 8,
      backgroundColor: styleVariables.colors.notificationBadge,
      borderRadius: 99,
      marginLeft: 8,
    },
    announcementImage: {
      height: 204,
      borderRadius: 16,
      marginTop: 16,

      backgroundColor: styleVariables.colors.imageLoading,
    },
    header: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",

      marginLeft: 16,
    },
    nameContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      width: "100%",
    },
    individualNameContainer: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",

      marginLeft: 16,
    },
    name: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  useEffect(() => {
    const time = setTime(timestamp.seconds * 1000);
    setTimeSinceAnnouncement(time);
    if (wasSeen.includes(currentUser.userID)) {
      setViewed(true);
    }
  }, []);

  const setWasSeenToTrue = async () => {
    if (!wasSeen.includes(currentUser.userID)) {
      wasSeen.push(currentUser.userID);
      updateItemInFirestore("Announcements", id, { wasSeen: wasSeen });
      setViewed(true);
      // update the announcements count in the app context
      const newAnnouncementCount = announcements.count - 1;
      setAnnouncements({
        ...announcements,
        count: newAnnouncementCount,
      });
    }
  };

  const handlePressEvent = () => {
    navigation.navigate("IndividualAnnouncement", {
      content: content,
      timestamp: timeSinceAnnouncement,
      attachment: attachment,
      theme: theme,
      styleVariables: styleVariables,
      styles: styles,
    });
    setWasSeenToTrue();
  };

  return (
    <TouchableOpacity
      onPress={handlePressEvent}
      style={theme.cardContainer}
      activeOpacity={1}
    >
      {/* ownerInfo */}
      <StatusBar style="light" />
      <View style={styles.announcementInfo}>
        {/* Smart Living Properties Profile Picture */}
        <Image
          source={require("../../assets/icon.png")}
          style={styles.profileIcon}
        />
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              Smart Living Properties
            </Text>
            {viewed == false && (
              <View id="notificationIndice" style={styles.announcementIndice} />
            )}
          </View>
          <Text id="timePosted" style={[styleVariables.fontSizes.callout]}>
            {timeSinceAnnouncement}
          </Text>
        </View>
      </View>

      {/* announcement content */}
      <View style={styles.contentContainer}>
        <View className="announcementTextContent">
          <Text
            numberOfLines={4}
            ellipsizeMode="tail"
            style={[styleVariables.fontSizes.body, styles.announcementContent]}
          >
            {content.trim()}
          </Text>
        </View>
        {attachment != "" && (
          <Image
            source={{
              uri: `${attachment}`,
            }}
            style={styles.announcementImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default memo(AnnouncementItem);
