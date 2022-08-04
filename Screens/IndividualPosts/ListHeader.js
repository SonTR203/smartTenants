import React, { useState, useEffect, memo } from "react";
import { useAppContext } from "../../Context/AppContext";
import { useTheme } from "../../ThemeContext";
import { setTime } from "../../utils/setTime";
import { View, Text, Image, StyleSheet } from "react-native";
import { constants } from "../../utils/constants";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import LikeSection from "./LikeSection";

//* userPost */
function ListHeader() {
  const { post } = useAppContext();
  const [currentPost, setCurrentPost] = useState(null);
  const { theme, styleVariables } = useTheme();
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(() => {
    const time = setTime(post.timestamp.seconds * 1000);
    setTimeSincePost(time);

    setCurrentPost(post);
  }, []);

  const styles = StyleSheet.create({
    container: { marginTop: 27, flex: 2 },
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
      marginLeft: 8,
      marginRight: 8,
    },
    timestamp: { color: styleVariables.colors.black, opacity: 0.66 },
    postContent: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
    postImage: {
      width: constants.width - 68,
      height: constants.width - 68,
      borderRadius: 16,
      marginBottom: 17,
    },
  });

  if (!currentPost) {
    return null;
  }

  return (
    <View id="userPost" style={[theme.cardContainer, styles.container]}>
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

          <Text style={[styleVariables.fontSizes.bodyBold, styles.fullName]}>
            {post.userFirstName} {post.userLastName}
          </Text>
        </View>
        <Text
          id="timePosted"
          style={[styleVariables.fontSizes.callout, styles.timestamp]}
        >
          {timeSincePost}
        </Text>
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
      <LikeSection />
    </View>
  );
}

export default memo(ListHeader);
