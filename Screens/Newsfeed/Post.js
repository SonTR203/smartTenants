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
import { db } from "../../firebase-config";
import { useAppContext } from "../../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { setTime } from "../../utils/setTime";

//============================== Individual Post Cards ==========================
function Post({ posts, navigation, theme, styleVariables, windowWidth }) {
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const { currentUser, setPost } = useAppContext();
  let peopleWhoLiked = [];
  let peopleWhoLikedDocIds = [];

  posts = {
    comments: posts.comments.arrayValue,
    id: posts.id,
    image: posts.images.arrayValue.values[0].stringValue,
    peopleWhoLiked: posts.peopleWhoLiked.arrayValue,
    postContent: posts.postContent.stringValue,
    userID: posts.userID.stringValue,
    userProfileImage: posts.userProfileImage.stringValue,
    userFirstName: posts.userFirstName.stringValue,
    userLastName: posts.userLastName.stringValue,
    numberOfLikes: numberOfLikes,
    timestamp: posts.timestamp,
  };

  useEffect(() => {
    getLikes();
  }, []);

  const getLikes = async () => {
    const likesColReference = collection(
      db,
      "Newsfeed",
      `${posts.id}`,
      "peopleWhoLiked"
    );

    const data = await getDocs(likesColReference);
    setNumberOfLikes(data.docs.length);
    data.docs.map((item) => {
      peopleWhoLiked.push(item._document.data.value.mapValue.fields.userID);
    });

    //set new array of the docoument ids for all likes
    data.docs.map((item) => {
      peopleWhoLikedDocIds.push(item._document.key.path.segments[8]);
    });

    const time = setTime(posts);
    setTimeSincePost(time);

    getComments();
    setHeartsToGreen();
  };

  const setHeartsToGreen = () => {
    peopleWhoLiked.map((item) => {
      if (item.stringValue == currentUser.userDocId) {
        setUserLiked(true);
      }
    });
  };

  const getComments = async () => {
    const likesColReference = collection(
      db,
      "Newsfeed",
      `${posts.id}`,
      "peopleWhoCommented"
    );
    const data = await getDocs(likesColReference);
    setNumberOfComments(data.docs.length);
  };

  const likePost = async () => {
    // ================ checking is current user liked post ====================
    if (peopleWhoLiked != 0) {
      peopleWhoLiked.map((item) => {
        if (item.stringValue == currentUser.userDocId) {
          setUserLiked(false);

          removeLike();
        } else {
          createLikeInDB();
        }
      });
    } else {
      createLikeInDB();
    }
  };

  const createLikeInDB = async () => {
    const notificationColRef = collection(
      db,
      `Users/${posts.userID}/Notifications`
    );
    const peopleWhoLikedColRef = collection(
      db,
      `Newsfeed/${posts.id}/peopleWhoLiked`
    );

    //=========== adding like notification============
    try {
      await addDoc(notificationColRef, {
        content: `${currentUser.firstName} ${currentUser.lastName} liked your post.`,
        postID: posts.id,
        userID: posts.userID,
        wasSeen: false,
        timestamp: Date.now(),
      }).then(() => {
        getLikes();
      });
    } catch (error) {
      console.log(error);
    }

    // =============== adding user to peopleWhoLiked subcollection =============
    try {
      await addDoc(peopleWhoLikedColRef, {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        postID: posts.id,
        userID: currentUser.userDocId,
      }).then(() => {
        setUserLiked(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeLike = async () => {
    //remove user from list of peopleWhoLiked
    peopleWhoLikedDocIds.map(async (item) => {
      if ((item.userID = currentUser.userDocId)) {
        const singleDoc = doc(
          db,
          `Newsfeed/${posts.id}/peopleWhoLiked/${item}`
        );
        await deleteDoc(singleDoc);
      }
    });

    //========= TODO:  delete notification from other user that there was a like =========

    // const notificationSingleDoc = doc(db, `Users/${posts.userID}/Notifications/${}`)
    // await deleteDoc(notificationSingleDoc);
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
            source={{ uri: `${posts.userProfileImage}` }}
            style={{ height: 43, width: 43, borderRadius: 12 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 },
            ]}
          >
            {posts.userFirstName} {posts.userLastName}
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
          navigation.push("IndividualPosts");
          setPost(posts);
        }}
      >
        <View className="postTextContent">
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginBottom: 17 },
            ]}
          >
            {posts.postContent}
          </Text>
        </View>

        {posts.image != "no image posted" && (
          <Image
            source={{
              uri: `${posts.image}`,
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
            setPost(posts);
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
