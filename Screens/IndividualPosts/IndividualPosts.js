import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAppContext } from "../../Context/AppContext";
import { db } from "../../firebase-config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "@firebase/firestore";
import _ from "lodash";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { setTime } from "../../utils/setTime";
import { likePost } from "../../utils/Newsfeed/newsfeed.services";
import { Timestamp } from "@firebase/firestore";
import uuid from "react-native-uuid";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import { moderateText } from "../../utils/moderation.services";

const width = Dimensions.get("window").width;

const IndividualPosts = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const { currentUser, post } = useAppContext();
  const [peoplePerson, setPeoplePerson] = useState("people");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
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

  // execute function
  useEffect(() => {
    if (post) {
      getComments();
      if (post.peopleWhoLiked.length > 0) {
        setPeoplePerson(post.peopleWhoLiked.length == 1 ? "person" : "people");
        setHeartsToGreen();
        setNumberOfLikes(post.peopleWhoLiked.length);
      }
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

  const setHeartsToGreen = () => {
    post.peopleWhoLiked.map((item) => {
      if (item == currentUser.userID) {
        setUserLiked(true);
      }
    });
  };

  const Comment = ({ item, theme, styleVariables }) => {
    const [timeSincePost, setTimeSincePost] = useState("");

    useEffect(() => {
      let time = setTime(item.timestamp.seconds * 1000);
      setTimeSincePost(time);
    }, []);

    return (
      <View
        id="userComment"
        style={[
          theme.cardContainer,
          {
            shadowColor: styleVariables.colors.primary,
            marginTop: 12,
          },
        ]}
      >
        <StatusBar style="dark" />
        <View
          className="commentOwnerInfo"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 12,
          }}
        >
          <View
            className="commentOwnerImageAndName"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <DynamicProfilePicture user={item} size={43} borderRadius={12} />
            <Text
              style={[
                styleVariables.fontSizes.bodyBold,
                { color: styleVariables.colors.black, marginLeft: 8 },
              ]}
            >
              {`${item.firstName} ${item.lastName}`}
            </Text>
          </View>
          <Text
            id="timeCommentPosted"
            style={[
              styleVariables.fontSizes.callout,
              { color: styleVariables.colors.black, opacity: 0.66 },
            ]}
          >
            {timeSincePost}
          </Text>
        </View>

        <View className="commentContent">
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginBottom: 17 },
            ]}
          >
            {item.commentContent}
          </Text>
        </View>
      </View>
    );
  };

  const callBackRender = useCallback(
    ({ item, index }) => renderPostItem({ item, index }),
    [[comments]]
  );

  const renderPostItem = ({ item }) => (
    <Comment
      item={item}
      navigation={navigation}
      theme={theme}
      styleVariables={styleVariables}
      width={width}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="auto" />
      <View style={theme.pageContainer}>
        <FlatList
          ref={commentListRef}
          removeClippedSubviews={true}
          ListHeaderComponent={
            <ListHeader
              userLiked={userLiked}
              setUserLiked={setUserLiked}
              numberOfLikes={numberOfLikes}
              setNumberOfLikes={setNumberOfLikes}
              currentUser={currentUser}
              peoplePerson={peoplePerson}
            />
          }
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={callBackRender}
          ListFooterComponent={
            <ListFooter
              currentUser={currentUser}
              post={post}
              theme={theme}
              styleVariables={styleVariables}
              getComments={getComments}
              commentCount={commentCount}
              setCommentCount={setCommentCount}
            />
          }
        />
      </View>
    </View>
  );
};

//* userPost */
function ListHeader({
  peoplePerson,
  currentUser,
  numberOfLikes,
  userLiked,
  setUserLiked,
  setNumberOfLikes,
}) {
  const { post, setPost } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(() => {
    const time = setTime(post.timestamp.seconds * 1000);
    setTimeSincePost(time);
  }, []);

  const handleLikePost = async () => {
    const updatedPost = await likePost(
      userLiked,
      setUserLiked,
      setNumberOfLikes,
      numberOfLikes,
      currentUser,
      post
    );
    if (updatedPost) {
      setPost({
        ...updatedPost,
      });
    }
  };

  return (
    <View
      id="userPost"
      style={[theme.cardContainer, { marginTop: 27, flex: 2 }]}
    >
      {/* postOwnerInfo */}
      <View
        className="postOwnerInfo"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: width - 68,
          marginBottom: 12,
        }}
      >
        <View
          className="ownerImageAndName"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <DynamicProfilePicture
            user={{
              userProfileImage: post.userProfileImage,
              firstName: post.userFirstName,
              lastName: post.userLastName,
            }}
            size={43}
            borderRadius={12}
          />

          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              {
                color: styleVariables.colors.black,
                marginLeft: 8,
                marginRight: 8,
              },
            ]}
          >
            {post.userFirstName} {post.userLastName}
          </Text>
        </View>
        <Text
          id="timePosted"
          style={[
            styleVariables.fontSizes.callout,
            { color: styleVariables.colors.black, opacity: 0.66 },
          ]}
        >
          {timeSincePost}
        </Text>
      </View>

      {/* postContent */}
      <View className="postContent">
        {/* postTextContent */}
        <Text
          style={[
            styleVariables.fontSizes.body,
            {
              color: styleVariables.colors.black,
              marginBottom: 17,
            },
          ]}
        >
          {post.postContent}
        </Text>
        {/* postImageContent */}
        {post.images[0] != "no image posted" ? (
          <Image
            source={{
              uri: `${post.images[0]}`,
            }}
            style={{
              width: width - 68,
              height: width - 68,
              borderRadius: 16,
              marginBottom: 17,
            }}
          />
        ) : null}

        {/* likeCount */}
        <View
          id="likeCount"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            id="like"
            onPress={handleLikePost}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              flex: 1,
            }}
          >
            {userLiked && (
              <MaterialCommunityIcons
                name="heart"
                size={24}
                color="#0AA74C"
                style={{ marginRight: 8 }}
              />
            )}
            {!userLiked && (
              <MaterialCommunityIcons
                name="heart-outline"
                size={24}
                color={styleVariables.colors.black}
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              style={[
                styleVariables.fontSizes.callout,
                { color: styleVariables.colors.black },
              ]}
            >
              Liked by
            </Text>
            <Text
              style={[
                styleVariables.fontSizes.calloutBold,
                {
                  color: styleVariables.colors.black,
                },
              ]}
            >
              {` ${numberOfLikes} ${peoplePerson}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

//* addComment */
function ListFooter({
  theme,
  styleVariables,
  post,
  currentUser,
  getComments,
  commentCount,
  setCommentCount,
}) {
  const [textInputValue, setTextInputValue] = useState("");
  const { setPost, post: postContext } = useAppContext();

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
      ...postContext,
      commentCount: newCommentCount,
    });
    const postRef = doc(db, "Newsfeed", post.id);
    updateDoc(postRef, {
      commentCount: newCommentCount,
    });
  };

  return (
    <View style={[theme.globalMargins, { paddingTop: 34, paddingBottom: 136 }]}>
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
            { minHeight: 68 + 44, paddingTop: 22 },
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

export default IndividualPosts;
