import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
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

  useEffect(() => {
    if (post) {
      if (post.peopleWhoLiked.length > 0) {
        setHeartsToGreen();
        setNumberOfLikes(post.peopleWhoLiked.length);
      }

      const time = setTime(post.timestamp);
      setTimeSincePost(time);
      setNumberOfComments(post.commentCount);
    }
  }, [post]);

  const setHeartsToGreen = () => {
    post.peopleWhoLiked.map((item) => {
      if (item == currentUser.userDocId) {
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
    const peopleWhoLikedDocRef = doc(db, "Newsfeed", post.id);

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
      console.log("error adding like to Notification", error);
      return false;
    }

    // =============== adding user to peopleWhoLiked subcollection & update peopleWhoLiked array =============
    try {
      await addDoc(peopleWhoLikedColRef, {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        postID: post.id,
        userID: currentUser.userDocId,
      }).then(() => {
        alert("Updated like in DB!");
      });

      await updateDoc(peopleWhoLikedDocRef, {
        peopleWhoLiked: [...post.peopleWhoLiked, currentUser.userDocId],
      });
    } catch (error) {
      console.log("error adding like to DB", error);
      return false;
    }

    return true;
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

      const peopleWhoLikedDocRef = doc(db, "Newsfeed", post.id);
      await updateDoc(peopleWhoLikedDocRef, {
        peopleWhoLiked: post.peopleWhoLiked.filter(
          (item) => item != currentUser.userDocId
        ),
      });
    } catch (error) {
      console.log("error remove like: ", error);
      return false;
    }

    // }
    // });

    //========= TODO:  delete notification from other user that there was a like =========

    // const notificationSingleDoc = doc(db, `Users/${posts.userID}/Notifications/${}`)
    // await deleteDoc(notificationSingleDoc);

    return true;
  };

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
            source={{ uri: `${post.userProfileImage}` }}
            style={{ height: 43, width: 43, borderRadius: 12 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 },
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
            {post.postContent}
          </Text>
        </View>

        {post.images[0] != "no image posted" && (
          <Image
            source={{
              uri: `${post.images[0]}`,
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
