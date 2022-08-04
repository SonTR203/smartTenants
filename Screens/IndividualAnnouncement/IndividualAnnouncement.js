import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

function IndividualAnnouncement({ route }) {
  const { content, timestamp, attatchment, styleVariables, styles } =
    route.params;

  return (
    <ScrollView
      contentContainerStyle={{
        margin: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: styleVariables.colors.white,
        ...styleVariables.shadow,
      }}
    >
      <StatusBar style="light" />

      {/* ownerInfo */}
      <View style={styles.announcementInfo}>
        {/* Smart Living Properties Profile Picture */}
        <Image
          source={require("../../assets/icon.png")}
          style={styles.profileIcon}
        />
        {/*  */}
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
        {attatchment != "" && (
          <Image
            source={{
              uri: `${attatchment}`,
            }}
            style={styles.announcementImage}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default IndividualAnnouncement;
