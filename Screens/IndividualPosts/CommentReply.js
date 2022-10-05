import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import { setTime } from "../../utils/setTime";
import HorizontalDotsSVG from "../../components/Icons/HorizontalDotsSVG";

function CommentReply({ item, theme, styleVariables, styles, currentUser }) {
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(() => {
    async function convertTime() {
      let time = setTime(item.timestamp.seconds * 1000);
      setTimeSincePost(time);
    }
    convertTime();
  }, []);

  return (
    <View style={styles.replyContainer}>
      <View id="replyLine" style={styles.replyLine}></View>
      <View
        id="userReply"
        style={[
          theme.individualPostCardContainer,
          styles.container,
          styles.reply,
          { marginTop: 8 },
        ]}
      >
        <View className="commentOwnerInfo" style={styles.ownerInfo}>
          <View
            className="commentOwnerImageAndName"
            style={styles.ownerImageAndName}
          >
            <DynamicProfilePicture user={item} size={43} borderRadius={12} />

            <View
              style={[{ flexDirection: "column" }, { marginHorizontal: 8 }]}
            >
              <Text
                style={[styleVariables.fontSizes.bodyBold, styles.fullName]}
              >
                {`${item.firstName} ${item.lastName}`}
              </Text>
              <Text
                id="timeCommentPosted"
                style={[styleVariables.fontSizes.callout, styles.timestamp]}
              >
                {timeSincePost}
              </Text>
            </View>
          </View>
          {currentUser.userID == item.userID ? (
            <View style={styles.HorizontalDots}>
              <TouchableOpacity
                onPress={() => {
                  // setModalVisible(true);
                }}
              >
                <HorizontalDotsSVG />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View className="commentContent">
          <Text style={[styleVariables.fontSizes.body]}>
            {item.commentContent}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default CommentReply;
