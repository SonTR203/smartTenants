import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import { setTime } from "../../utils/setTime";
import { likePost, deletePost } from "../../utils/Newsfeed/newsfeed.services";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import HeartSVG from "../../components/Icons/HeartSVG";
import HeartFilledSVG from "../../components/Icons/HeartFilledSVG";
import CommentIconSVG from "../../components/Icons/CommentIconSVG";
import HorizontalDotsSVG from "../../components/Icons/HorizontalDotsSVG";
import CustomBottomModal from "../../components/CustomBottomModal/index";
import ModalActionConfirm from "../../components/CustomBottomModal/ModalActionConfirm";

//============================== Individual Post Cards ==========================
function Post({ passedPost, windowWidth, isMyPost, setPosts, setRefreshing }) {
  const navigation = useNavigation();
  const { theme, styleVariables } = useTheme();
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const { currentUser, setPost, post } = useAppContext();
  const [currentPost, setCurrentPost] = useState(passedPost);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (currentPost) {
      if (currentPost.peopleWhoLiked?.length > 0) {
        setHeartsToGreen(currentPost.peopleWhoLiked);
        setNumberOfLikes(currentPost.peopleWhoLiked?.length);
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

  const handleDeletePost = async () => {
    setRefreshing(true);
    const updatedPost = await deletePost(currentPost, setModalVisible);

    if (updatedPost) {
      console.log("DELETING");
      setPosts(updatedPost);
      setRefreshing(false);
    }
  };

  if (!currentPost) {
    return null;
  }
  //prettier-ignore
  const styles = StyleSheet.create({
    postStatus:
      currentPost.isNSFW === true
        ? {
            paddingHorizontal: 16,
            paddingVertical: 4,
            backgroundColor: "#FEF0E8",
            color: "#F26419",
            marginLeft: 8,
            marginTop: 4,
            borderRadius: 8,
            overflow: "hidden",
            alignSelf: "flex-start",
          }
        : {
            paddingHorizontal: 16,
            paddingVertical: 4,
            backgroundColor: "#E9FAF0",
            color: "#23CE6B",
            marginLeft: 8,
            marginTop: 4,
            borderRadius: 8,
            overflow: "hidden",
            alignSelf: "flex-start",
          },
    timePosted: {
      color: styleVariables.colors.black,
      opacity: 0.66,
      marginHorizontal: 4,
      paddingHorizontal: 5,
    },
  });

  const options = [
    {
      content: `Edit`,
      onPress: () => {},
      iconName: "pencil",
      iconColor: "#4D4D4D",
    },
    {
      content: `Delete`,
      onPress: () => {},
      iconName: "trash-can-outline",
      iconColor: "#4D4D4D",
      renderSubscreen: () => {
        return (
          <ModalActionConfirm
            destructive={true}
            title={`Delete your post?`}
            subtitle={"You won't be able to restore it"}
            confirmText="Delete"
            onConfirm={() => {
              handleDeletePost();
            }}
            onCancel={() => setModalVisible(false)}
          />
        );
      },
    },
    {
      content: "Turn off notifications",
      onPress: () => {},
      iconName: "bell-off-outline",
      iconColor: "#4D4D4D",
      renderSubscreen: () => {
        return (
          <ModalActionConfirm
            title={"Turn off notifications for this post?"}
            subtitle={"You will be able to undo this action"}
            confirmText="Confirm"
            // onConfirm={handleTurnOffNotifications}
            onCancel={() => setModalVisible(false)}
          />
        );
      },
    },
  ];

  return (
    <TouchableOpacity
      id="post"
      style={theme.cardContainer}
      onPress={navigateToIndividualPostScreen}
      activeOpacity={1}
    >
      {/* ownerInfo */}
      <View
        id="ownerInfo"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: isMyPost === true ? "flex-start" : "center",
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
            size={48}
            borderRadius={12}
          />
          <View>
            <Text
              style={[
                styleVariables.fontSizes.cardUserName,
                {
                  color: styleVariables.colors.black,
                  marginLeft: 8,
                  marginBottom: 2,
                },
              ]}
            >
              {currentPost.userFirstName} {currentPost.userLastName}
            </Text>
            {isMyPost === true ? (
              <Text style={styles.postStatus}>
                {currentPost.isNSFW === false ? "Posted" : "Pending approval"}
              </Text>
            ) : (
              ""
            )}
            <Text
              id="timePosted"
              style={[styleVariables.fontSizes.callout, styles.timePosted]}
            >
              {timeSincePost}
            </Text>
          </View>
        </View>
        {currentUser.userID == currentPost.userID ? (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <HorizontalDotsSVG />
          </TouchableOpacity>
        ) : null}
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
              backgroundColor: styleVariables.colors.imageLoading,
            }}
          />
        )}
      </View>

      {/* likeAndComment */}
      <View
        className="likeAndComment"
        style={{
          display: isMyPost === true ? "none" : "flex",
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
            <View style={{ marginRight: 8 }}>
              <HeartFilledSVG width={24} height={24} color={"#0AA74C"} />
            </View>
          )}
          {!userLiked && (
            <View style={{ marginRight: 8 }}>
              <HeartSVG
                width={24}
                height={24}
                stroke={1.5}
                color={styleVariables.colors.black}
              />
            </View>
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
          <CommentIconSVG />
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginLeft: 8 },
            ]}
          >
            {numberOfComments}
          </Text>
        </View>
        <CustomBottomModal
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
          options={options}
        ></CustomBottomModal>
      </View>
    </TouchableOpacity>
  );
}

export default Post;
