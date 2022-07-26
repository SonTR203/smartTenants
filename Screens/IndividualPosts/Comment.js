import React, { useState, useEffect, memo } from "react";
import { setTime } from "../../utils/setTime";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";

function Comment({ item, theme, styleVariables }) {
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(() => {
    let time = setTime(item.timestamp.seconds * 1000);
    setTimeSincePost(time);
  }, []);

  const styles = StyleSheet.create({
    container: {
      shadowColor: styleVariables.colors.primary,
      marginTop: 12,
    },
    ownerInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 12,
    },
    ownerImageAndName: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    fullName: { color: styleVariables.colors.black, marginLeft: 8 },
    timestamp: { color: styleVariables.colors.black, opacity: 0.66 },
    content: { color: styleVariables.colors.black, marginBottom: 17 },
    replyBtn: {
      width: "100%",
      display: "flex",
      alignItems: "flex-end",
    },
    replyText: { color: styleVariables.colors.primary },
  });

  return (
    <View id="userComment" style={[theme.cardContainer, styles.container]}>
      <View className="commentOwnerInfo" style={styles.ownerInfo}>
        <View
          className="commentOwnerImageAndName"
          style={styles.ownerImageAndName}
        >
          <DynamicProfilePicture user={item} size={43} borderRadius={12} />
          <Text style={[styleVariables.fontSizes.bodyBold, styles.fullName]}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
        </View>
        <Text
          id="timeCommentPosted"
          style={[styleVariables.fontSizes.callout, styles.timestamp]}
        >
          {timeSincePost}
        </Text>
      </View>

      <View className="commentContent">
        <Text style={[styleVariables.fontSizes.body, styles.content]}>
          {item.commentContent}
        </Text>
      </View>
      <View className="replyIcon" style={styles.replyBtn}>
        <TouchableOpacity>
          <Text style={[styleVariables.fontSizes.bodyBold, styles.replyText]}>
            Reply →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(Comment);
