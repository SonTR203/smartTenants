import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

function IndividualNotice({ route }) {
  const { content, theme, timestamp, styleVariables, styles, subject } =
    route.params;

  return (
    <View style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
      <View style={theme.cardContainer}>
        <View id="noticeInfo" style={styles.noticeInfo}>
          <View className="imageAndName" style={styles.imageAndName}>
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              {subject}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {content}
          </Text>
        </View>
        <Text style={[styleVariables.fontSizes.callout, styles.timestampText]}>
          {timestamp}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 22,
          backgroundColor: styleVariables.colors.primary,
          marginHorizontal: 16,
          padding: 16,
          borderRadius: 16,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: styleVariables.colors.white,
            fontSize: 17,
            fontWeight: "500",
            ...styleVariables.shadow,
          }}
        >
          View attachment
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default IndividualNotice;
