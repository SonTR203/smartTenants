import {
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAppContext } from "../../Context/AppContext";
import { db } from "../../firebase-config";
import { collection, getDocs } from "@firebase/firestore";
import _ from "lodash";
import { useTheme } from "../../ThemeContext";
import Comment from "./Comment";
import { constants } from "../../utils/constants";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import { tapGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler";
import { ScreenStackHeaderRightView } from "react-native-screens";

const IndividualPosts = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const { currentUser, post } = useAppContext();

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const [userCommentName, setUserCommentName] = useState("");
  const [userCommentId, setUserCommentId] = useState("");

  const [textInputHeight, setTextInputHeight] = useState(0);

  const commentListRef = useRef();

  // Get all Comments
  const getComments = () => {
    const colRef = collection(db, `/Newsfeed/${post.id}/peopleWhoCommented`);

    // Get collections data
    getDocs(colRef).then((snapshot) => {
      let commentsArray = [];
      snapshot.docs.forEach((doc) => {
        commentsArray.push({ ...doc.data(), id: doc.id });
      });

      let sortedComments = _.sortBy(commentsArray, "timestamp");
      setComments(sortedComments);
      setCommentCount(sortedComments.length);
    });
  };

  // Get comment replies
  const getCommentReplies = async (id) => {
    const colRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${id}/peopleWhoReplied`
    );

    const data = await getDocs(colRef);
    const formattedData = data.docs.map((doc) => {
      return {
        ...doc.data(),
      };
    });
    return formattedData;
  };

  // execute function
  useEffect(() => {
    if (post && post.updated === false) {
      getComments();
    }
  }, [post]);

  // execute function
  useEffect(() => {
    let timeout;
    // if there are comments, scroll to the the correct comment
    if (route.params.commentId && comments.length > 0) {
      const index = comments
        .map((comment) => comment.id)
        .indexOf(route.params.commentId);

      timeout = setTimeout(() => {
        commentListRef.current?.scrollToIndex({ animated: true, index: index });
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [route.params, comments]);

  const getItemLayout = (data, index) => ({
    length: 126 + 12, // item height + item margin top
    offset: (126 + 12) * index,
    index,
  });

  const callBackRenderItem = useCallback(
    ({ item, index }) => renderPostItem({ item, index }),
    [comments]
  );
  const callBackRenderListHeader = useCallback(
    () => renderListHeader(),
    [comments]
  );

  const renderPostItem = ({ item }) => (
    <Comment
      item={item}
      navigation={navigation}
      theme={theme}
      styleVariables={styleVariables}
      width={constants.width}
      setUserCommentName={setUserCommentName}
      setUserCommentId={setUserCommentId}
      getCommentReplies={getCommentReplies}
      comments={comments}
    />
  );

  const renderListHeader = () => {
    return <ListHeader />;
  };

  const renderListFooter = () => {
    return (
      <ListFooter
        currentUser={currentUser}
        post={post}
        theme={theme}
        styleVariables={styleVariables}
        getComments={getComments}
        commentCount={commentCount}
        setCommentCount={setCommentCount}
        userCommentName={userCommentName}
        setUserCommentName={setUserCommentName}
        userCommentId={userCommentId}
        setUserCommentId={setUserCommentId}
      />
    );
  };

  let NUM = 100;

  return (
    <View>
      <View>
        <FlatList
          scrollEnabled={true}
          style={[styles.itemWrapper]}
          getItemLayout={getItemLayout}
          ref={commentListRef}
          removeClippedSubviews={true}
          ListHeaderComponent={callBackRenderListHeader}
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={callBackRenderItem}
        ></FlatList>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Dimensions.get("window").height * 0.12}
        style={[styles.textInputWrapper]}
      >
        <FlatList
          scrollEnabled={false}
          ListFooterComponent={renderListFooter}
          style={[styles.textInputWrapper]}
          onLayout={(event) => {
            if (textInputHeight === 0) {
              setTextInputHeight(event.nativeEvent.layout.height);
            }
          }}
        ></FlatList>
      </KeyboardAvoidingView>
    </View>
  );
};

// Make this a constant for dynamic change in height.
// Make dynamic sizing for flatList when keyboard pops up

const styles = StyleSheet.create({
  // Styling for the posts/comments
  itemWrapper: {
    width: Dimensions.get("window").width,
    height:
      Dimensions.get("window").height - Dimensions.get("window").height * 0.12,
  },
  // styling for the text input
  textInputWrapper: {
    marginTop: "auto",
  },
  container: {
    justifyContent: "flex-end",
  },
});

export default IndividualPosts;
