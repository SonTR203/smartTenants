import React, { useState, useEffect, memo, useCallback } from "react";
import { setTime } from "../../utils/setTime";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useAppContext } from "../../Context/AppContext";
import { likeComment } from "../../utils/IndividualPosts/individualPosts.services";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import CommentReply from "./CommentReply";
import ReplyArrowSVG from "../../components/Icons/ReplyArrowSVG";
import HeartSVG from "../../components/Icons/HeartSVG";
import HeartFilledSVG from "../../components/Icons/HeartFilledSVG";
import CommentIcon from "../../components/Icons/CommentIconSVG";

function Comment({
  item,
  theme,
  styleVariables,
  setUserCommentName,
  setUserCommentId,
  userCommentId,
  getCommentReplies,
  comments,
  passedPost,
}) {
  const [timeSincePost, setTimeSincePost] = useState("");
  const [replies, setReplies] = useState([]);
  const [numberOfReplies, setNumberOfReplies] = useState(0);
  const [userLikedComment, setUserLikedComment] = useState(false);
  const [numberOfCommentLikes, setNumberOfCommentLikes] = useState(0);
  const { post, setPost, currentUser } = useAppContext();

  useEffect(() => {
    let time = setTime(item.timestamp.seconds * 1000);
    setTimeSincePost(time);
  }, []);

  useEffect(() => {
    async function setCommentReplies() {
      if (item.replied == true) {
        let replyList = await getCommentReplies(item.id);
        setReplies(replyList);
      }
    }
    setCommentReplies();
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

  // In progress: add like functionality to comments
  const handleLikeComment = async () => {
    const updatedPost = await likeComment(
      item,
      post,
      currentUser,
      userLikedComment,
      setUserLikedComment,
      numberOfCommentLikes,
      setNumberOfCommentLikes
    );

    if (updatedPost) {
      setPost({
        ...updatedPost,
        updated: true,
      });
    }
  };

  const styles = StyleSheet.create({
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
    fullName: { color: styleVariables.colors.black },
    timestamp: { color: styleVariables.colors.black, opacity: 0.66 },
    content: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
    replyText: {
      display: "flex",
      justifyContent: "space-between",
      gap: 2,
      color: styleVariables.colors.primary,
    },
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
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    commentStatsContainer: {
      display: "flex",
      flexDirection: "row",
    },

    likeCommentContainer: {
      display: "flex",
      flexDirection: "row",
    },
    likeCommentCount: {
      alignSelf: "center",
      marginLeft: 10,
    },
    likeCommentReplySection: {
      display: "flex",
      flexDirection: "row",
    },
  });

  return (
    <View>
      <View id="userComment" style={[theme.individualPostCardContainer]}>
        <View className="commentOwnerInfo" style={styles.ownerInfo}>
          <View
            className="commentOwnerImageAndName"
            style={styles.ownerImageAndName}
          >
            <DynamicProfilePicture user={item} size={43} borderRadius={12} />
            <View style={{ flexDirection: "column", margin: 8 }}>
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
        </View>

        <View className="commentContent">
          <Text style={[styleVariables.fontSizes.body, styles.content]}>
            {item.commentContent}
          </Text>
        </View>
        <View style={[styles.likeCommentReplySection, styles.replyContainer]}>
          <View className="replyIcon" style={styles.replyLine}>
            <View style={styles.commentStatsContainer}>
              <TouchableOpacity
                style={styles.likeCommentContainer}
                onPress={() => {
                  // handleLikeComment();
                  console.log(item);
                  console.log("------------------------------------");
                  console.log(post);
                }}
              >
                <HeartSVG></HeartSVG>
                <Text style={styles.likeCommentCount}>
                  {numberOfCommentLikes}
                </Text>
              </TouchableOpacity>
              <View style={styles.likeCommentContainer}>
                <CommentIcon></CommentIcon>
                <Text style={styles.likeCommentCount}>{}</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setUserCommentName(`${item.firstName} ${item.lastName}`);
                setUserCommentId(item.id);
              }}
            >
              <Text
                style={[styleVariables.fontSizes.bodyBold, styles.replyText]}
              >
                Reply <ReplyArrowSVG />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {item.replied == true && (
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id}
          renderItem={callbackRenderItem}
        />
      )}
    </View>
  );
}

export default memo(Comment);
