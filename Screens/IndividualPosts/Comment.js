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
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import CommentReply from "./CommentReply";
import CustomBottomModal from "../../components/CustomBottomModal/index";
import ModalActionConfirm from "../../components/CustomBottomModal/ModalActionConfirm/index.js";

// Import Icons
import ReplyArrowSVG from "../../components/Icons/ReplyArrowSVG";
import HeartSVG from "../../components/Icons/HeartSVG";
import HeartFilledSVG from "../../components/Icons/HeartFilledSVG";
import HorizontalDotsSVG from "../../components/Icons/HorizontalDotsSVG";

function Comment({
  item,
  theme,
  styleVariables,
  setUserCommentName,
  setUserCommentId,
  getCommentReplies,
  comments,
  setNumberOfComments,
  numberOfComments,
}) {
  const [timeSincePost, setTimeSincePost] = useState("");
  const [replies, setReplies] = useState([]);
  const [userLikedComment, setUserLikedComment] = useState(false);
  const [numberOfCommentLikes, setNumberOfCommentLikes] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
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
      item={item}
      theme={theme}
      styleVariables={styleVariables}
      styles={styles}
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
    if (updatedPost == true) {
      setPost({
        ...updatedPost,
        peopleWhoCommented: [...updatedPost.peopleWhoCommented],
        updated: true,
      });
    }
  };

  const handleDeleteComment = async () => {
    const updatedComment = await deleteComment(
      post,
      item,
      setModalVisible,
      numberOfComments,
      setNumberOfComments
    );

    if (updatedComment == true) {
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
                <Text style={styles.likeCommentCount}>
                  {numberOfCommentLikes}
                </Text>
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
