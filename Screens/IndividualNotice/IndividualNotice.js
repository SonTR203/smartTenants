import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";

function IndividualNotice({ route }) {
  const {
    content,
    theme,
    timestamp,
    styleVariables,
    styles,
    subject,
    attachment,
  } = route.params;

  const _handleOpenPDFInWebBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync(attachment);
    } catch (error) {
      console.log("Open PDF Error: ", error);
      Alert.alert("Error", "There was an error opening the PDF");
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: styleVariables.colors.white,
      }}
    >
      <View
        style={[
          theme.cardContainer,
          {
            marginBottom: 16,
          },
        ]}
      >
        <View id="noticeInfo" style={styles.noticeInfo}>
          <View className="imageAndName" style={styles.imageAndName}>
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              {subject}
            </Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {content}
          </Text>
        </View>
        <Text style={[styleVariables.fontSizes.callout, styles.timestampText]}>
          {timestamp}
        </Text>
      </View>
      {attachment && (
        <TouchableOpacity
          onPress={_handleOpenPDFInWebBrowser}
          style={styles.attachmentButton}
        >
          <Text style={styles.attachmentText}>View attachment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

export default IndividualNotice;
