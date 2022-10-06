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
import {
  likeComment,
  deleteComment,
} from "../../utils/IndividualPosts/individualPosts.services";
import _ from "lodash";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import CommentReply from "./CommentReply";
import CustomBottomModal from "../../components/CustomBottomModal/index";
import ModalActionConfirm from "../../components/CustomBottomModal/ModalActionConfirm/index.js";

// Import Icons
import ReplyArrowSVG from "../../components/Icons/ReplyArrowSVG";
import HeartSVG from "../../components/Icons/HeartSVG";
import HeartFilledSVG from "../../components/Icons/HeartFilledSVG";
import HorizontalDotsSVG from "../../components/Icons/HorizontalDotsSVG";
import ReplyArrowHorizontalSVG from "../../components/Icons/ReplyArrowHorizontalSVG";
import ReplyArrowVerticalSVG from "../../components/Icons/ReplyArrowVerticalSVG";

function Comment({
  item,
  theme,
  styleVariables,
  setUserCommentName,
  setUserCommentId,
  getCommentReplies,
  setComments,
  comments,
  setNumberOfComments,
}) {
  const [timeSincePost, setTimeSincePost] = useState("");
  const [replies, setReplies] = useState([]);
  const [userLikedComment, setUserLikedComment] = useState(false);
  const [numberOfCommentLikes, setNumberOfCommentLikes] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRepliesVisible, setRepliesVisible] = useState(false);
  const { post, setPost, currentUser } = useAppContext();

  useEffect(() => {
    let time = setTime(item.timestamp.seconds * 1000);
    setTimeSincePost(time);
  }, []);

  useEffect(() => {
    async function setCommentReplies() {
      if (item.replied == true) {
        let replyList = await getCommentReplies(item.id);

        let sortedReplyList = _.sortBy(replyList, "timestamp");

        setReplies(sortedReplyList);
      }
    }
    setCommentReplies();
  }, [comments]);

  const callbackRenderItem = useCallback(
    ({ item }) => renderReplyItem({ item }),
    [replies]
  );

  // execute function
  useEffect(() => {
    if (item && item.peopleWhoLiked.length > 0) {
      setHeartsToGreen();
      setNumberOfCommentLikes(item.peopleWhoLiked.length);
    }
  }, [item]);

  const setHeartsToGreen = () => {
    post.peopleWhoLiked.map((item) => {
      if (item == currentUser.userID) {
        setUserLikedComment(true);
      }
    });
  };

  const renderReplyItem = ({ item }) => (
    <CommentReply
      post={post}
      item={item}
      theme={theme}
      styleVariables={styleVariables}
      styles={styles}
      currentUser={currentUser}
      setComments={setComments}
    />
  );

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
        peopleWhoCommented: [...item.peopleWhoCommented],
        updated: true,
      });
    }
  };

  const handleDeleteComment = async () => {
    const updatedComment = await deleteComment(
      post,
      item,
      setModalVisible,
      setComments
    );

    if (updatedComment) {
      setPost({
        ...updatedComment,
        commentCount: updatedComment.commentCount - 1,
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
      color: styleVariables.colors.primary,
      marginBottom: 17,
    },
    HorizontalDots: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      alignSelf: "center",
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
      marginLeft: 4.67,
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 20,
    },

    likeCommentReplySection: {
      display: "flex",
      flexDirection: "row",
    },
    showHideReply: {
      display: "flex",
      flexDirection: "row",
      textAlign: "center",
      marginHorizontal: 36.5,
      marginTop: 8,
    },
    showHideReplyText: {
      fontSize: 13,
      fontWeight: "500",
      lineHeight: 18,
      color: "#395E66",
    },
  });

  const options = [
    {
      content: `Edit`,
      onPress: () => {},
      iconName: "pencil",
      iconColor: "#4D4D4D",
    },
    {
      content: `Delete`,
      onPress: () => {},
      iconName: "trash-can-outline",
      iconColor: "#4D4D4D",
      renderSubscreen: () => {
        return (
          <ModalActionConfirm
            destructive={true}
            title={`Delete your comment?`}
            subtitle={"You won't be able to restore it"}
            confirmText="Delete"
            onConfirm={() => {
              handleDeleteComment();
            }}
            onCancel={() => setModalVisible(false)}
          />
        );
      },
    },
    {
      content: "Turn off notifications",
      onPress: () => {},
      iconName: "bell-off-outline",
      iconColor: "#4D4D4D",
      renderSubscreen: () => {
        return (
          <ModalActionConfirm
            title={"Turn off notifications for this post?"}
            subtitle={"You will be able to undo this action"}
            confirmText="Confirm"
            // onConfirm={handleTurnOffNotifications}
            onCancel={() => setModalVisible(false)}
          />
        );
      },
    },
  ];

  return (
    <View>
      <View
        id="userComment"
        style={[theme.individualPostCardContainer, { marginTop: 16 }]}
      >
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
          {currentUser.userID == item.userID ? (
            <View style={styles.HorizontalDots}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <HorizontalDotsSVG />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View className="commentContent">
          <Text style={[styleVariables.fontSizes.body, styles.content]}>
            {item.commentContent}
          </Text>
        </View>
        <View style={[styles.likeCommentReplySection, styles.replyContainer]}>
          <View className="replyIcon" style={styles.replyLine}>
            <View style={styles.commentStatsContainer}>
              <View style={[styles.likeCommentContainer, { marginRight: 16 }]}>
                {userLikedComment && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.likeCommentContainer}
                    onPress={handleLikeComment}
                  >
                    <HeartFilledSVG />
                  </TouchableOpacity>
                )}
                {!userLikedComment && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.likeCommentContainer}
                    onPress={handleLikeComment}
                  >
                    <HeartSVG />
                  </TouchableOpacity>
                )}
                {numberOfCommentLikes > 0 ? (
                  <Text style={styles.likeCommentCount}>
                    {numberOfCommentLikes}
                  </Text>
                ) : null}
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
        <CustomBottomModal
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
          options={options}
        ></CustomBottomModal>
      </View>
      {item.replied == true && isRepliesVisible == true && (
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id}
          renderItem={callbackRenderItem}
        />
      )}
      {replies.length > 0 ? (
        <View style={styles.showHideReply}>
          <TouchableOpacity
            onPress={() => {
              setRepliesVisible(!isRepliesVisible);
            }}
          >
            {isRepliesVisible ? (
              <Text style={styles.showHideReplyText}>
                <ReplyArrowHorizontalSVG />
                Hide replies
              </Text>
            ) : !isRepliesVisible && replies.length === 1 ? (
              <Text style={styles.showHideReplyText}>
                <ReplyArrowVerticalSVG />
                {replies[0].firstName} replied.
              </Text>
            ) : !isRepliesVisible && replies.length === 2 ? (
              <Text style={styles.showHideReplyText}>
                <ReplyArrowVerticalSVG />
                {replies[0].firstName} and {replies.length - 1} other replied
              </Text>
            ) : !isRepliesVisible && replies.length > 2 ? (
              <Text style={styles.showHideReplyText}>
                <ReplyArrowVerticalSVG />
                {replies[0].firstName} and {replies.length - 1} others replied
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default memo(Comment);
