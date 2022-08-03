import { React, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { setTime } from "../../utils/setTime";
import { Dimensions } from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { updateItemInFirestore } from "../../utils/firebase.services";
const windowWidth = Dimensions.get("window").width;

function AnnouncementItem({
  content,
  attatchment,
  timestamp,
  wasSeen,
  theme,
  id,
  navigation,
  styleVariables,
}) {
  const [timeSinceAnnouncement, setTimeSinceAnnouncement] = useState("");
  const [viewed, setViewed] = useState(false);
  const { currentUser } = useAppContext();

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
      height: windowWidth - 68,
      width: windowWidth - 68,
      borderRadius: 16,
      marginTop: 16,

      backgroundColor: "gray",
    },
  });

  useEffect(() => {
    const time = setTime(timestamp);
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
    }
  };

  const handlePressEvent = () => {
    navigation.navigate("IndividualAnnouncement", {
      content: content,
      timestamp: timeSinceAnnouncement,
      attatchment: attatchment,
      theme: theme,
      styleVariables: styleVariables,
      styles: styles,
    });
    setWasSeenToTrue();
  };

  return (
    <TouchableOpacity
      onPress={handlePressEvent}
      id="announcement"
      style={theme.cardContainer}
    >
      {/* ownerInfo */}
      <View id="announcementInfo" style={styles.announcementInfo}>
        {/* Smart Living Properties Profile Picture */}
        <Image
          source={require("../../assets/icon.png")}
          style={styles.profileIcon}
        />

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",

            marginLeft: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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
      <View>
        <View className="announcementTextContent">
          <Text
            style={[styleVariables.fontSizes.body, styles.announcementContent]}
          >
            {content}
          </Text>
        </View>
        {attatchment != "" && (
          <Image
            source={{
              uri: `${attatchment}`,
            }}
            style={styles.announcementImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default AnnouncementItem;
