import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../ThemeContext";
import { db } from "../../firebase-config";
import { useAppContext } from "../../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { setTime } from "../../utils/setTime";

//============================== Individual Post Cards ==========================
function Post({ post, windowWidth }) {
  const navigation = useNavigation();
  const { theme, styleVariables } = useTheme();
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const { currentUser, setPost } = useAppContext();
  let peopleWhoLiked = [];
  let peopleWhoLikedDocIds = [];

  // posts = {
  //   comments: posts.comments.arrayValue,
  //   id: posts.id,
  //   image: posts.images.arrayValue.values[0].stringValue,
  //   peopleWhoLiked: posts.peopleWhoLiked.arrayValue,
  //   postContent: posts.postContent.stringValue,
  //   userID: posts.userID.stringValue,
  //   userProfileImage: posts.userProfileImage.stringValue,
  //   userFirstName: posts.userFirstName.stringValue,
  //   userLastName: posts.userLastName.stringValue,
  //   numberOfLikes: numberOfLikes,
  //   timestamp: posts.timestamp,
  // };

  useEffect(() => {
    if (post) {
      console.log("post", post);
      // if (post.peopleWhoLiked.arrayValue.values) {
      //   setHeartsToGreen();
      // }

      // const time = setTime(post.timestamp.integerValue);
      // setTimeSincePost(time);

      // console.log("post", post);

      setNumberOfComments(post.commentCount.integerValue);
      if (!isNaN(post.likeCount.integerValue)) {
        setNumberOfLikes(post.likeCount.integerValue);
      }
      // setNumberOfLikes(post.likeCount.integerValue);
    }
  }, [post]);

  const setHeartsToGreen = () => {
    post.peopleWhoLiked.arrayValue.values.map((item) => {
      if (item.stringValue == currentUser.userDocId) {
        setUserLiked(true);
      }
    });
  };

  const likePost = async () => {
    // ================ checking is current user liked post ====================
    if (userLiked) {
      const res = await removeLike();
      if (res) {
        setUserLiked(false);
        setNumberOfLikes(numberOfLikes - 1);
      }
    } else {
      const res = await addLike();
      if (res) {
        setUserLiked(true);
        setNumberOfLikes(numberOfLikes + 1);
      }
    }
  };

  const addLike = async () => {
    const notificationColRef = collection(
      db,
      `Users/${post.userID}/Notifications`
    );
    const peopleWhoLikedColRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoLiked`
    );

    //=========== adding like notification============
    try {
      await addDoc(notificationColRef, {
        content: `${currentUser.firstName} ${currentUser.lastName} liked your post.`,
        postID: post.id,
        userID: post.userID,
        wasSeen: false,
        timestamp: Date.now(),
      }).then(() => {
        alert("Created like notification!");
        // getLikes();
      });
    } catch (error) {
      console.log(error);
    }

    // =============== adding user to peopleWhoLiked subcollection =============
    try {
      await addDoc(peopleWhoLikedColRef, {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        postID: post.id,
        userID: currentUser.userDocId,
      }).then(() => {
        alert("Updated like in DB!");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeLike = async () => {
    //remove user from list of peopleWhoLiked
    // peopleWhoLikedDocIds.map(async (item) => {
    //   if ((item.userID = currentUser.userDocId)) {
    try {
      const singleDoc = doc(
        db,
        `Newsfeed/${post.id}/peopleWhoLiked/${currentUser.userDocId}`
      );
      await deleteDoc(singleDoc);
      return true;
    } catch (error) {
      console.log("error remove like: ", error);
      return false;
    }

    // }
    // });

    //========= TODO:  delete notification from other user that there was a like =========

    // const notificationSingleDoc = doc(db, `Users/${posts.userID}/Notifications/${}`)
    // await deleteDoc(notificationSingleDoc);
  };

  // return null;

  return (
    <View id="post" style={theme.cardContainer}>
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
          <Image
            source={{ uri: `${post.userProfileImage.stringValue}` }}
            style={{ height: 43, width: 43, borderRadius: 12 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 },
            ]}
          >
            {post.userFirstName.stringValue} {post.userLastName.stringValue}
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
      <TouchableOpacity
        id="postContent"
        onPress={() => {
          navigation.navigate("IndividualPosts");
          setPost(post);
        }}
      >
        <View className="postTextContent">
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginBottom: 17 },
            ]}
          >
            {post.postContent.stringValue}
          </Text>
        </View>

        {post.images.arrayValue.values[0].stringValue != "no image posted" && (
          <Image
            source={{
              uri: `${post.images.arrayValue.values[0].stringValue}`,
            }}
            style={{
              height: windowWidth - 68,
              width: windowWidth - 68,
              borderRadius: 16,
              marginBottom: 17,
            }}
          />
        )}
      </TouchableOpacity>

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
          onPress={likePost}
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
        <TouchableOpacity
          id="comment"
          onPress={() => {
            navigation.navigate("IndividualPosts");
            setPost(post);
          }}
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
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Post;
