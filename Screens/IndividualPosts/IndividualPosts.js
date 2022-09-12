import {
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
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

const IndividualPosts = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const { currentUser, post } = useAppContext();

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const [userCommentName, setUserCommentName] = useState("");
  const [userCommentId, setUserCommentId] = useState("");

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

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-185}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      behavior="position"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "black",
      }}
    >
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={theme.pageContainer}
      >
        <KeyboardAwareFlatList
          getItemLayout={getItemLayout}
          ref={commentListRef}
          removeClippedSubviews={true}
          ListHeaderComponent={callBackRenderListHeader}
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={callBackRenderItem}
        />
        <KeyboardAwareFlatList
          scrollEnabled={false}
          style={theme.listFooterStyle}
          ListFooterComponent={renderListFooter}
        ></KeyboardAwareFlatList>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

export default IndividualPosts;
