import { View, Text, Image, FlatList, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../Context/AppContext";
import { db } from "../../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "@firebase/firestore";
import _ from "lodash";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { setTime } from "../../utils/setTime";
const width = Dimensions.get("window").width;

const IndividualPosts = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const { currentUser, post } = useAppContext();
  const [peoplePerson, setPeoplePerson] = useState("people");
  const [comments, setComments] = useState([]);

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
    });
  };

  // execute function
  useEffect(() => {
    getComments();
    if (post.peopleWhoLiked.length == 1) {
      setPeoplePerson("person");
    } else {
      setPeoplePerson("people");
    }
  }, [post]);

  const Comment = ({ item, theme, styleVariables }) => {
    const [timeSincePost, setTimeSincePost] = useState("");

    useEffect(() => {
      let time = setTime(item.timestamp);
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
            <Image
              source={{ uri: item.userProfileImage }}
              style={{ width: 43, height: 43, borderRadius: 12 }}
            />
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

  function addCommentNotifications(post) {
    const peopleWhoCommentedColRef = collection(
      db,
      `Users/${post.userID}/Notifications`
    );
    try {
      addDoc(peopleWhoCommentedColRef, {
        content: `${currentUser.firstName} ${currentUser.lastName} commented on your post.`,
        postID: post.id,
        userID: post.userID,
        wasSeen: false,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.log(error);
    }
  }

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
          removeClippedSubviews={true}
          ListHeaderComponent={<ListHeader peoplePerson={peoplePerson} />}
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
              addCommentNotifications={addCommentNotifications}
            />
          }
        />
      </View>
    </View>
  );
};

//* userPost */
function ListHeader({ peoplePerson }) {
  const { post } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(() => {
    const time = setTime(post.timestamp);
    setTimeSincePost(time);
  }, []);

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
          <Image
            source={{ uri: `${post.userProfileImage}` }}
            style={{ width: 43, height: 43, borderRadius: 12 }}
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
            onPress={() => {
              alert("like post function");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={24}
              color={styleVariables.colors.black}
              style={{ marginRight: 8 }}
            />
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
              {` ${post.peopleWhoLiked.length} ${peoplePerson}`}
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
  addCommentNotifications,
}) {
  const [textInputValue, setTextInputValue] = useState("");

  // Post Comments
  const postComment = () => {
    if (textInputValue != "") {
      const peopleWhoCommentedColRef = collection(
        db,
        `Newsfeed/${post.id}/peopleWhoCommented`
      );

      try {
        addDoc(peopleWhoCommentedColRef, {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          userProfileImage: currentUser.userProfileImage,
          commentContent: textInputValue,
          postUserID: post.userID,
          timestamp: Date.now(),
        }).then(() => {
          setTextInputValue("");
          getComments();
        });

        addCommentCount();
        addCommentNotifications(post);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("No Comment to Post");
    }
  };

  // This function will retrieve the post in the database and add 1 to the commentCount property
  const addCommentCount = () => {
    let newCommentCount = parseInt(post.commentCount) + 1;
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
