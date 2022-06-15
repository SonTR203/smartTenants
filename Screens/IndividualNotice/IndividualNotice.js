import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function IndividualNotice({ route }) {
  const { noticeContent, theme, styleVariables, styles } = route.params;

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
        </View>
        <View className="noticeTextContent">
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {noticeContent}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default IndividualNotice;
