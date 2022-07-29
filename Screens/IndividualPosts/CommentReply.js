import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import { setTime } from "../../utils/setTime";

function CommentReply({ item, theme, styleVariables, styles }) {
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(async () => {
    let time = setTime(item.timestamp.seconds * 1000);
    setTimeSincePost(time);
  }, []);

  return (
    <View style={styles.replyContainer}>
      <View id="replyLine" style={styles.replyLine}></View>
      <View
        id="userReply"
        style={[theme.cardContainer, styles.container, styles.reply]}
      >
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
      </View>
    </View>
  );
}

export default CommentReply;
