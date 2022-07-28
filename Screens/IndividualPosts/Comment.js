import React, { useState, useEffect, memo, useCallback } from "react";
import { setTime } from "../../utils/setTime";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import CommentReply from "./CommentReply";

function Comment({
  item,
  theme,
  styleVariables,
  setUserCommentName,
  setUserCommentId,
  getCommentReplies,
  comments,
}) {
  const [timeSincePost, setTimeSincePost] = useState("");
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    let time = setTime(item.timestamp.seconds * 1000);
    setTimeSincePost(time);
  }, []);

  useEffect(async () => {
    let replyList = await getCommentReplies(item.id);
    setReplies(replyList);
  }, [comments]);

  const callbackRenderItem = useCallback(
    ({ item }) => renderReplyItem({ item }),
    [replies]
  );

  const renderReplyItem = ({ item }) => (
    <CommentReply
      item={item}
      theme={theme}
      styleVariables={styleVariables}
      styles={styles}
    />
  );

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
    reply: {
      width: "87%",
      marginLeft: 0,
    },
    replyContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-start",
    },
    replyLine: {
      width: 10,
      height: "50%",
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderLeftColor: styleVariables.colors.primary14,
      borderBottomColor: styleVariables.colors.primary14,
      borderBottomLeftRadius: 5,
    },
  });

  return (
    <View>
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
          <TouchableOpacity
            onPress={() => {
              setUserCommentName(`${item.firstName} ${item.lastName}`);
              setUserCommentId(item.id);
            }}
          >
            <Text style={[styleVariables.fontSizes.bodyBold, styles.replyText]}>
              Reply →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.id}
        renderItem={callbackRenderItem}
      />
    </View>
  );
}

export default memo(Comment);
