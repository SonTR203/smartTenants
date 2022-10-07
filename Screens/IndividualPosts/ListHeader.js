import React, { useState, useEffect, memo } from "react";
import { useAppContext } from "../../Context/AppContext";
import { useTheme } from "../../ThemeContext";
import { setTime } from "../../utils/setTime";
import { View, Text, Image, StyleSheet } from "react-native";
import { constants } from "../../utils/constants";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import LikeSection from "./LikeSection";

//* userPost */
function ListHeader({
  likesModalVisible,
  setLikesModalVisible,
  setPeopleWhoLiked,
  peopleWhoLiked,
  setNumberOfComments,
  numberOfComments,
}) {
  const [currentPost, setCurrentPost] = useState(null);
  const { styleVariables } = useTheme();
  const [timeSincePost, setTimeSincePost] = useState("");
  const { post } = useAppContext();

  useEffect(() => {
    const time = setTime(post.timestamp.seconds * 1000);
    setTimeSincePost(time);
    setCurrentPost(post);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 2,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      backgroundColor: styleVariables.colors.white,
      padding: 17,
      paddingTop: 7,
      marginTop: 0,
      borderRadius: 16,
    },
    postOwnerInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: constants.width - 68,
      marginBottom: 12,
    },
    ownerImageAndName: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    fullName: {
      color: styleVariables.colors.black,
    },
    nameAndTime: {
      marginHorizontal: 8,
    },
    timestamp: { color: styleVariables.colors.black, opacity: 0.66 },
    postContent: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
    postImage: {
      width: constants.width - constants.width * 0.08,
      height: constants.width - 68,
      borderRadius: 16,
      marginBottom: 17,
    },
  });

  if (!currentPost) {
    return null;
  }

  return (
    <View id="userPost" style={[styles.container]}>
      {/* postOwnerInfo */}
      <View className="postOwnerInfo" style={styles.postOwnerInfo}>
        <View className="ownerImageAndName" style={styles.ownerImageAndName}>
          <DynamicProfilePicture
            user={{
              userProfileImage: currentPost.userProfileImage,
              firstName: currentPost.userFirstName,
              lastName: currentPost.userLastName,
              colors: currentPost.userColors,
            }}
            size={43}
            borderRadius={12}
          />
          <View style={styles.nameAndTime}>
            <Text style={[styleVariables.fontSizes.bodyBold, styles.fullName]}>
              {post.userFirstName} {post.userLastName}
            </Text>
            <Text
              id="timePosted"
              style={[styleVariables.fontSizes.callout, styles.timestamp]}
            >
              {timeSincePost}
            </Text>
          </View>
        </View>
      </View>

      {/* postContent */}
      <View className="postContent">
        {/* postTextContent */}
        <Text style={[styleVariables.fontSizes.body, styles.postContent]}>
          {post.postContent}
        </Text>
        {/* postImageContent */}
        {currentPost.images[0] != "no image posted" ? (
          <Image
            source={{
              uri: `${currentPost.images[0]}`,
            }}
            style={styles.postImage}
          />
        ) : null}
      </View>
      <LikeSection
        setPeopleWhoLiked={setPeopleWhoLiked}
        likesModalVisible={likesModalVisible}
        setLikesModalVisible={setLikesModalVisible}
        peopleWhoLiked={peopleWhoLiked}
        setNumberOfComments={setNumberOfComments}
        numberOfComments={numberOfComments}
      />
    </View>
  );
}

export default memo(ListHeader);
