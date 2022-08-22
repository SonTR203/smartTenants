import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

function IndividualAnnouncement({ route }) {
  const {
    content,
    timestamp,
    attachment,
    styleVariables,
    styles: previousScreenStyle,
  } = route.params;

  const styles = StyleSheet.create({
    scrollViewContainer: {
      marginTop: 16,
    },
    container: {
      marginHorizontal: 16,
      marginBottom: 50,
      padding: 16,
      borderRadius: 16,
      backgroundColor: styleVariables.colors.white,
      ...styleVariables.shadow,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* ownerInfo */}
        <View style={previousScreenStyle.announcementInfo}>
          {/* Smart Living Properties Profile Picture */}
          <Image
            source={require("../../assets/icon.png")}
            style={previousScreenStyle.profileIcon}
          />
          {/* name container */}
          <View style={previousScreenStyle.individualNameContainer}>
            <View style={previousScreenStyle.name}>
              <Text
                style={[
                  styleVariables.fontSizes.bodyBold,
                  previousScreenStyle.profileName,
                ]}
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
              style={[
                styleVariables.fontSizes.body,
                styles.announcementContent,
              ]}
            >
              {content.trim()}
            </Text>
          </View>
          {attachment != "" && (
            <Image
              source={{
                uri: `${attachment}`,
              }}
              style={previousScreenStyle.announcementImage}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default IndividualAnnouncement;
