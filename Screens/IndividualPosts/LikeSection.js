import React, { useState, useEffect, memo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../../Context/AppContext";
import { likePost } from "../../utils/Newsfeed/newsfeed.services";
import { useTheme } from "../../ThemeContext";

function LikeSection() {
  const [peoplePerson, setPeoplePerson] = useState("people");
  const [userLiked, setUserLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);

  const { post, setPost, currentUser } = useAppContext();
  const { styleVariables } = useTheme();

  // execute function
  useEffect(() => {
    if (post && post.peopleWhoLiked.length > 0) {
      setPeoplePerson(post.peopleWhoLiked.length == 1 ? "person" : "people");
      setHeartsToGreen();
      setNumberOfLikes(post.peopleWhoLiked.length);
    }
  }, [post]);

  const setHeartsToGreen = () => {
    post.peopleWhoLiked.map((item) => {
      if (item == currentUser.userID) {
        setUserLiked(true);
      }
    });
  };

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
        updated: true,
      });
    }
  };

  const handleShowPeopleWhoLiked = () => {
    alert("Show people who liked list");
  };

  const styles = StyleSheet.create({
    likeCountContainer: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 5,
    },
    likeButton: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
    },
    likeIcon: { marginRight: 8 },
    likedBy: {
      color: styleVariables.colors.black,
    },
  });

  return (
    <View id="likeCount" style={styles.likeCountContainer}>
      <TouchableOpacity
        id="like"
        onPress={handleShowPeopleWhoLiked}
        style={styles.likeButton}
      >
        {userLiked && (
          <TouchableOpacity onPress={handleLikePost}>
            <MaterialCommunityIcons
              name="heart"
              size={24}
              color="#0AA74C"
              style={styles.likeIcon}
            />
          </TouchableOpacity>
        )}
        {!userLiked && (
          <TouchableOpacity onPress={handleLikePost}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={24}
              color={styleVariables.colors.black}
              style={styles.likeIcon}
            />
          </TouchableOpacity>
        )}
        <Text style={[styleVariables.fontSizes.callout, styles.likedBy]}>
          Liked by
          <Text style={[styleVariables.fontSizes.calloutBold, styles.likedBy]}>
            {` ${numberOfLikes} ${peoplePerson}`}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(LikeSection);
