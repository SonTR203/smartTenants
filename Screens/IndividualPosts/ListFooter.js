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
} from "react-native";
import { db } from "../../firebase-config";
import { updateDoc, doc, setDoc } from "@firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import uuid from "react-native-uuid";
import { useTheme } from "../../ThemeContext";

function ListFooter({ getComments, commentCount, setCommentCount }) {
  const [textInputValue, setTextInputValue] = useState("");
  const { setPost, post, currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();

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

      try {
        setDoc(doc(db, `Newsfeed/${post.id}/peopleWhoCommented`, id), {
          id: id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          userProfileImage: currentUser.userProfileImage,
          commentContent: textInputValue,
          userID: currentUser.userID,
          authorID: post.userID,
          timestamp: Timestamp.fromDate(new Date()),
          postID: post.id,
        }).then(() => {
          setTextInputValue("");
          getComments();
          addCommentCount();
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("No Comment to Post");
    }
  };

  // This function will retrieve the post in the database and add 1 to the commentCount property
  const addCommentCount = () => {
    let newCommentCount = parseInt(commentCount) + 1;
    setCommentCount(newCommentCount);
    setPost({
      ...post,
      commentCount: newCommentCount,
    });
    const postRef = doc(db, "Newsfeed", post.id);
    updateDoc(postRef, {
      commentCount: newCommentCount,
    });
  };

  const styles = StyleSheet.create({
    container: { paddingTop: 34, paddingBottom: 136 },
    inputArea: { minHeight: 68 + 44, paddingTop: 22 },
  });

  return (
    <View style={[theme.globalMargins, styles.container]}>
      <View>
        <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
          Reply
        </Text>
        <TextInput
          placeholderTextColor={styleVariables.colors.placeholderText}
          onChangeText={(text) => setTextInputValue(text)}
          value={textInputValue}
          placeholder="280 characters maximum"
          multiline={true}
          maxLength={280}
          style={[
            theme.textInput,
            styleVariables.fontSizes.body,
            styles.inputArea,
          ]}
        />
      </View>

      {/* disable button class if no text input for comments */}
      <TouchableOpacity onPress={postComment} style={theme.primaryButton}>
        <Text
          style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
        >
          Send reply
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(ListFooter);
