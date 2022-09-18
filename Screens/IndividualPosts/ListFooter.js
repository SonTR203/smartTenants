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
import { db } from "../../firebase-config";
import { updateDoc, doc, setDoc } from "@firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import uuid from "react-native-uuid";
import { useTheme } from "../../ThemeContext";
import { connectStorageEmulator } from "firebase/storage";

function ListFooter({
  getComments,
  commentCount,
  setCommentCount,
  userCommentName,
  setUserCommentName,
  setUserCommentId,
  userCommentId,
}) {
  const [textInputValue, setTextInputValue] = useState("");
  const { setPost, post, currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [height, setHeight] = useState(0);

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
          postID: post.id,
        }
      ).then(() => {
        setTextInputValue("");
        getComments();
        setUserCommentId("");
        setUserCommentName("");
        setRepliedTrue(post.id, userCommentId);
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

  const styles = StyleSheet.create({
    container: { paddingTop: 0 },
    inputAreaContainer: {
      marginTop: 16,
      marginBottom: 34,
      marginBottom: 0,
      height: height + 53,
    },
    inputArea: {
      maxWidth: Dimensions.get("window").width - 100,
      alignSelf: "flex-start",
    },
    replyView: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 20,
      marginHorizontal: 160,
    },
    replyName: { color: styleVariables.colors.primary },
    cancelReply: {
      color: styleVariables.colors.primary,
      padding: 10,
    },
  });

  return (
    <View style={[theme.globalMargins, styles.container, height]}>
      {userCommentName != "" && (
        <View style={styles.replyView}>
          <Text style={styleVariables.fontSizes.callout}>
            Replying to{" "}
            <Text
              style={[styles.replyName, styleVariables.fontSizes.calloutBold]}
            >
              {userCommentName}
              {"        "}
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.cancelReply}
            onPress={() => {
              setUserCommentName("");
              setUserCommentId("");
            }}
          >
            <Text style={[styleVariables.fontSizes.header]}>x</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={theme.replyContainer}>
        <View style={[styles.inputAreaContainer]}>
          <TextInput
            placeholderTextColor={styleVariables.colors.placeholderText}
            onChangeText={(text) => {
              setTextInputValue(text);
            }}
            onContentSizeChange={(event) => {
              setHeight(event.nativeEvent.contentSize.height);
            }}
            value={textInputValue}
            placeholder="Post a comment"
            maxLength={280}
            multiline
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              styles.inputArea,
              height,
            ]}
          />
        </View>

        {/* disable button class if no text input for comments */}
        <TouchableOpacity onPress={postComment} style={theme.postButton}>
          <ArrowUpSVG></ArrowUpSVG>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(ListFooter);
