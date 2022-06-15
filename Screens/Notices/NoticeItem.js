import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

function NoticeItem({
  noticeContent,
  theme,
  styleVariables,
  styles,
  navigation,
}) {
  return (
    <View id="post" style={theme.cardContainer}>
      {/* Notice Info */}
      <View id="noticeInfo" style={styles.noticeInfo}>
        <View className="imageAndName" style={styles.imageAndName}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.profileIcon}
          />
          <Text style={[styleVariables.fontSizes.bodyBold, styles.profileName]}>
            {"Smart Living Properties"}
          </Text>
        </View>
      </View>

      {/* Notice content */}
      <TouchableOpacity
        id="noticeContent"
        onPress={() => {
          navigation.navigate("IndividualNotice", {
            noticeContent: noticeContent,
            theme: theme,
            styleVariables: styleVariables,
            styles: styles,
          });
        }}
      >
        <View className="noticeTextContent">
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {noticeContent}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NoticeItem;
