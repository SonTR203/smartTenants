import React from "react";
import { View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

function IndividualAnnouncement({ route }) {
  const { content, timestamp, attatchment, theme, styleVariables, styles } =
    route.params;

  return (
    <View>
      <StatusBar style="dark" />

      <View id="announcement" style={[theme.cardContainer, theme.shadowStyle]}>
        {/* ownerInfo */}
        <View id="announcementInfo" style={styles.announcementInfo}>
          <View className="imageAndName" style={styles.imageAndName}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.profileIcon}
            />
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              Smart Living Properties
            </Text>
          </View>
          <Text
            id="timePosted"
            style={[styleVariables.fontSizes.callout, styles.timestampText]}
          >
            {timestamp}
          </Text>
        </View>

        {/* announcement content */}
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
    </View>
  );
}

export default IndividualAnnouncement;
