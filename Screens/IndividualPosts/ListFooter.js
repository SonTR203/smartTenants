import React, { useState, memo } from "react";
import { useAppContext } from "../../Context/AppContext";
import { moderateText } from "../../utils/moderation.services";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import ArrowUpSVG from "../../components/Icons/ArrowUpSVG.js";
import X from "../../components/Icons/X.js";
import { db } from "../../firebase-config";
import { updateDoc, doc, setDoc } from "@firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import uuid from "react-native-uuid";
import { useTheme } from "../../ThemeContext";

function ListFooter({
  getComments,
  commentCount,
  setCommentCount,
  userCommentName,
  setUserCommentName,
  setUserCommentId,
  userCommentId,
  setRepliesVisible,
  commentBoxPlaceholder,
  setCommentBoxPlaceholder,
}) {
  const [textInputValue, setTextInputValue] = useState("");
  const { setPost, post, currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();

  const dynamicWidth =
    Dimensions.get("window").width - Dimensions.get("window").width * 0.18;

  // Post Comments
  const postComment = async () => {
    if (textInputValue != "") {
      const isNsfw = await moderateText(textInputValue);

      if (isNsfw) {
        Alert.alert(
          "We've detected potential profane or offensive content in your message."
        );
        return;
      }
      const id = uuid.v4();

      if (userCommentName != "") {
        replyToComment(id);
      } else {
        try {
          setDoc(doc(db, `Newsfeed/${post.id}/peopleWhoCommented`, id), {
            id: id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            userProfileImage: currentUser.userProfileImage,
            commentContent: textInputValue,
            peopleWhoLiked: [],
            userID: currentUser.userID,
            authorID: post.userID,
            colors: currentUser.colors,
            timestamp: Timestamp.fromDate(new Date()),
            postID: post.id,
            replied: false,
          }).then(() => {
            setTextInputValue("");
            getComments();
            addCommentCount();
          });
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      alert("No Comment to Post");
    }
  };

  const replyToComment = async (id) => {
    try {
      setDoc(
        doc(
          db,
          `Newsfeed/${post.id}/peopleWhoCommented/${userCommentId}/peopleWhoReplied`,
          id
        ),
        {
          id: id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          userProfileImage: currentUser.userProfileImage,
          commentContent: textInputValue,
          userID: currentUser.userID,
          colors: currentUser.colors,
          authorID: post.userID,
          timestamp: Timestamp.fromDate(new Date()),
          commentID: userCommentId,
          postID: post.id,
        }
      ).then(() => {
        setTextInputValue("");
        getComments();
        setUserCommentId("");
        setUserCommentName("");
        setRepliedTrue(post.id, userCommentId);
        setRepliesVisible(true);
      });
    } catch (err) {
      console.log(err);
    }
  };

  // sets comment replied to true
  const setRepliedTrue = async () => {
    const commentRef = doc(
      db,
      "Newsfeed",
      post.id,
      "peopleWhoCommented",
      userCommentId
    );

    try {
      await updateDoc(commentRef, {
        replied: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // This function will retrieve the post in the database and add 1 to the commentCount property
  const addCommentCount = () => {
    let newCommentCount = parseInt(commentCount) + 1;
    setCommentCount(newCommentCount);
    setPost({
      ...post,
      commentCount: newCommentCount,
      updated: true,
    });
    const postRef = doc(db, "Newsfeed", post.id);
    updateDoc(postRef, {
      commentCount: newCommentCount,
    });
  };

  // This function will make the postButton active when the user has typed something in the textInput.
  const handlePostButton = (event) => {
    setTextInputValue(event.target.value);
  };

  const styles = StyleSheet.create({
    inputAreaContainer: {
      marginTop: 16,
      maxHeight: 160,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    inputArea: {
      width: dynamicWidth,
    },
    replyView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      width:
        Dimensions.get("window").width - Dimensions.get("window").width * 0.09,
    },
    cancelButton: {
      fontSize: 25,
      textAlign: "center",
      marginTop: -7,
      color: "#9D9D9D",
    },
    replyName: { color: styleVariables.colors.primary },
    cancelReply: {
      color: styleVariables.colors.primary,
      justifyContent: "flex-end",
      width: 16,
      height: 16,
    },
  });

  if (post.isNSFW == true) return;
  return (
    <View style={theme.replyContainer}>
      {userCommentName != "" && (
        <View style={[styles.replyView]}>
          <Text style={styleVariables.fontSizes.callout}>
            Replying to{" "}
            <Text
              style={[styles.replyName, styleVariables.fontSizes.calloutBold]}
            >
              {userCommentName}
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.cancelReply}
            onPress={() => {
              setUserCommentName("");
              setUserCommentId("");
              setCommentBoxPlaceholder("Post a comment");
            }}
          >
            <X></X>
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.inputAreaContainer]}>
        <TextInput
          placeholderTextColor={styleVariables.colors.placeholderText}
          onChange={handlePostButton}
          onChangeText={(text) => {
            setTextInputValue(text);
          }}
          value={textInputValue}
          placeholder={commentBoxPlaceholder}
          maxLength={280}
          multiline
          style={[
            theme.individualPostsTextInput,
            styleVariables.fontSizes.body,
            styles.inputArea,
          ]}
        />
        {/* disable button class if no text input for comments */}
        <TouchableOpacity
          onPress={postComment}
          style={[
            theme.postButton,
            { backgroundColor: !textInputValue ? "#748E94" : "#395E66" },
          ]}
          disabled={!textInputValue}
        >
          <ArrowUpSVG></ArrowUpSVG>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(ListFooter);
