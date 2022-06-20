import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function IndividualNotice({ route }) {
  const { content, theme, timestamp, styleVariables, styles } = route.params;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <View style={theme.cardContainer}>
        <View id="noticeInfo" style={styles.noticeInfo}>
          <View className="imageAndName" style={styles.imageAndName}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.profileIcon}
            />
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              {"Smart Living Properties"}
            </Text>
          </View>
          <Text
            style={[styleVariables.fontSizes.callout, styles.timestampText]}
          >
            {timestamp}
          </Text>
        </View>
        <View className="noticeTextContent">
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {content}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default IndividualNotice;
