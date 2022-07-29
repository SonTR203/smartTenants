import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { setTime } from "../../utils/setTime";
import { likePost } from "../../utils/Newsfeed/newsfeed.services";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";

//============================== Individual Post Cards ==========================
function Post({ passedPost, windowWidth }) {
  const navigation = useNavigation();
  const { theme, styleVariables } = useTheme();
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const { currentUser, setPost, post } = useAppContext();
  const [currentPost, setCurrentPost] = useState(passedPost);

  useEffect(() => {
    if (currentPost) {
      if (currentPost.peopleWhoLiked.length > 0) {
        setHeartsToGreen(currentPost.peopleWhoLiked);
        setNumberOfLikes(currentPost.peopleWhoLiked.length);
      }

      const time = setTime(currentPost.timestamp.seconds * 1000);
      setTimeSincePost(time);
      setNumberOfComments(currentPost.commentCount);
    }
  }, [currentPost]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (post && post.id === currentPost.id && post.updated === true) {
        // set current post to post from context
        // in order to pass in navigation.navigate to IndividualPost
        setCurrentPost({
          ...post,
          peopleWhoLiked: [...post.peopleWhoLiked],
          commentCount: post.commentCount,
        });
        // set states to update UI of the Post
        setNumberOfLikes(post.peopleWhoLiked.length);
        setNumberOfComments(post.commentCount);
        setUserLiked(post.peopleWhoLiked.includes(currentUser.userID));
      }
    });

    return unsubscribe;
  }, [navigation, post]);

  useEffect(() => {
    if (passedPost) {
      setCurrentPost(passedPost);
    }
  }, [passedPost]);

  const setHeartsToGreen = (array) => {
    if (array.includes(currentUser.userID)) {
      setUserLiked(true);
    } else {
      setUserLiked(false);
    }
  };

  const navigateToIndividualPostScreen = async () => {
    const updatedPost = {
      ...currentPost,
      updated: false,
    };
    await setPost(updatedPost);
    navigation.navigate("IndividualPosts", {
      item: currentPost,
    });
  };

  const handleLikePost = async () => {
    const updatedPost = await likePost(
      userLiked,
      setUserLiked,
      setNumberOfLikes,
      numberOfLikes,
      currentUser,
      currentPost
    );
    if (updatedPost) {
      setCurrentPost({ ...updatedPost });
    }
  };

  if (!currentPost) {
    return null;
  }

  return (
    <TouchableOpacity
      id="post"
      style={theme.cardContainer}
      onPress={navigateToIndividualPostScreen}
    >
      {/* ownerInfo */}
      <View
        id="ownerInfo"
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
          className="ownerImageAndName"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <DynamicProfilePicture
            user={{
              firstName: currentPost.userFirstName,
              lastName: currentPost.userLastName,
              userProfileImage: currentPost.userProfileImage,
              colors: currentPost.userColors,
            }}
            size={43}
            borderRadius={12}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 },
            ]}
          >
            {currentPost.userFirstName} {currentPost.userLastName}
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
      <View id="postContent">
        <View className="postTextContent">
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginBottom: 17 },
            ]}
          >
            {currentPost.postContent}
          </Text>
        </View>

        {currentPost.images[0] != "no image posted" && (
          <Image
            source={{
              uri: `${currentPost.images[0]}`,
            }}
            style={{
              height: windowWidth - 68,
              width: windowWidth - 68,
              borderRadius: 16,
              marginBottom: 17,
            }}
          />
        )}
      </View>

      {/* likeAndComment */}
      <View
        className="likeAndComment"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 5,
        }}
      >
        {/* =========================== LIKE ============================= */}
        <TouchableOpacity
          id="like"
          onPress={handleLikePost}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
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
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black },
            ]}
          >
            {numberOfLikes}
          </Text>
        </TouchableOpacity>

        {/* =========================== COMMENT ============================= */}
        <View
          id="comment"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 17,
          }}
        >
          <MaterialCommunityIcons
            name="message-outline"
            size={24}
            color={styleVariables.colors.black}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black },
            ]}
          >
            {numberOfComments}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Post;
