import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

function IndividualAnnouncement({ route }) {
  const { content, timestamp, attachment, styleVariables, styles } =
    route.params;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <StatusBar style="light" />

      {/* ownerInfo */}
      <View style={styles.announcementInfo}>
        {/* Smart Living Properties Profile Picture */}
        <Image
          source={require("../../assets/icon.png")}
          style={styles.profileIcon}
        />
        {/* name container */}
        <View style={styles.individualNameContainer}>
          <View style={styles.name}>
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              Smart Living Properties
            </Text>
          </View>
          <Text id="timePosted" style={[styleVariables.fontSizes.callout]}>
            {timestamp}
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
        {attachment != "" && (
          <Image
            source={{
              uri: `${attachment}`,
            }}
            style={styles.announcementImage}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default IndividualAnnouncement;
