import { React, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { setTime } from "../../utils/setTime";
import { Dimensions } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
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
  const [viewed, setViewed] = useState(wasSeen);

  const styles = StyleSheet.create({
    announcementInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 12,
    },
    imageAndName: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    profileIcon: {
      height: 43,
      width: 43,
      borderRadius: 12,
    },
    profileName: {
      color: styleVariables.colors.black,
      marginLeft: 8,
    },
    announcementContent: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
    timestampText: { color: styleVariables.colors.black, opacity: 0.66 },
    announcementIndice: {
      height: 8,
      width: 8,
      backgroundColor: styleVariables.colors.primary,
      borderRadius: 99,
      marginLeft: 8,
    },
    announcementImage: {
      height: windowWidth - 68,
      width: windowWidth - 68,
      borderRadius: 16,
      marginBottom: 17,
    },
  });

  useEffect(() => {
    const time = setTime(timestamp);
    setTimeSinceAnnouncement(time);
  }, []);

  const setWasSeenToTrue = async () => {
    const colRef = doc(db, "Announcements", `${id}`);
    await updateDoc(colRef, {
      wasSeen: true,
    }).then(() => {
      setViewed(true);
    });
  };

  return (
    <View id="announcement" style={theme.cardContainer}>
      {/* ownerInfo */}
      <View id="announcementInfo" style={styles.announcementInfo}>
        <View className="imageAndName" style={styles.imageAndName}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.profileIcon}
          />
          <Text style={[styleVariables.fontSizes.bodyBold, styles.profileName]}>
            Smart Living Properties
          </Text>
        </View>
        <Text
          id="timePosted"
          style={[styleVariables.fontSizes.callout, styles.timestampText]}
        >
          {timeSinceAnnouncement}
        </Text>
        {viewed == false && (
          <View id="notificationIndice" style={styles.announcementIndice} />
        )}
      </View>

      {/* announcement content */}
      <TouchableOpacity
        id="announcementContent"
        onPress={() => {
          navigation.navigate("IndividualAnnouncement", {
            content: content,
            timestamp: timeSinceAnnouncement,
            attatchment: attatchment,
            theme: theme,
            styleVariables: styleVariables,
            styles: styles,
          });
          setWasSeenToTrue();
        }}
      >
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
      </TouchableOpacity>
    </View>
  );
}

export default AnnouncementItem;
