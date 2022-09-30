import React, { useState, useEffect, memo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import { db } from "../../firebase-config";
import { doc, getDoc } from "@firebase/firestore";
import { useAppContext } from "../../Context/AppContext";
import { likePost } from "../../utils/Newsfeed/newsfeed.services";
import { useTheme } from "../../ThemeContext";
import CommentIcon from "../../components/Icons/CommentIconSVG";
import HeartOutline from "../../components/Icons/HeartSVG";
import HeartFilledSVG from "../../components/Icons/HeartFilledSVG";
import UsersWhoLikedHeartSVG from "../../components/Icons/UsersWhoLikedHeartSVG";

function LikeSection({ setLikesModalVisible, setPeopleWhoLiked }) {
  const [userLiked, setUserLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [peopleArray, setPeopleArray] = useState([]);

  const { post, setPost, currentUser } = useAppContext();
  const { styleVariables } = useTheme();

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

  const handleShowPeopleWhoLiked = async () => {
    let arr = [];
    for (let personID of post.peopleWhoLiked) {
      const colRef = doc(db, `Tenants`, personID);
      const docSnap = await getDoc(colRef);
      if (!docSnap.exists()) return;
      arr.push(docSnap.data());
    }
    setPeopleArray(arr);
    setPeopleWhoLiked(arr);
  };

  // execute function
  useEffect(() => {
    if (post && post.peopleWhoLiked.length > 0) {
      handleShowPeopleWhoLiked();
      setHeartsToGreen();
      setNumberOfLikes(post.peopleWhoLiked.length);
    }
  }, [post]);

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 5,
      width: "100%",
      justifyContent: "space-between",
    },
    likeCountContainer: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
    },
    commentCountContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      marginLeft: 19,
    },
    likeButton: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
    },
    likeIcon: { marginRight: 8 },
    likedBy: {
      color: styleVariables.colors.black,
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 22,
    },
    likedByUsers: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    dynamicProfilePictures: {
      marginRight: -6,
      borderWidth: 2,
      borderColor: "#FFFFFF",
      borderRadius: 10,
    },
    dynamicProfilePicturesContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginRight: 6,
    },
  });
  if (post.isNSFW == true) return;
  return (
    <View style={[styles.container]}>
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <View id="likeCount" style={styles.likeCountContainer}>
          {userLiked && (
            <TouchableOpacity activeOpacity={1} onPress={handleLikePost}>
              <HeartFilledSVG style={styles.likeIcon}></HeartFilledSVG>
            </TouchableOpacity>
          )}
          {!userLiked && (
            <TouchableOpacity activeOpacity={1} onPress={handleLikePost}>
              <HeartOutline style={styles.likeIcon}></HeartOutline>
            </TouchableOpacity>
          )}
          <Text style={[styleVariables.fontSizes.callout, styles.likedBy]}>
            <Text style={styles.likedBy}>{`${numberOfLikes}`}</Text>
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.commentCountContainer}
            activeOpacity={1}
          >
            <CommentIcon></CommentIcon>
            <Text
              style={[
                styleVariables.fontSizes.callout,
                styles.likedBy,
                { marginLeft: 8 },
              ]}
            >
              {post.commentCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {peopleArray.length > 0 ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dynamicProfilePicturesContainer}
            onPress={() => {
              setLikesModalVisible(true);
            }}
          >
            <UsersWhoLikedHeartSVG
              style={{ marginRight: -6, zIndex: 9999 }}
            ></UsersWhoLikedHeartSVG>

            {peopleArray.map((person, index) => {
              if (index < 3) {
                let idx = peopleArray.length - index;
                return (
                  <DynamicProfilePicture
                    key={person.userID}
                    user={{
                      userProfileImage: person.userProfileImage,
                      firstName: person.firstName,
                      lastName: person.lastName,
                      colors: person.colors,
                    }}
                    size={24}
                    borderRadius={8}
                    defaultTextSize={11.25}
                    style={[styles.dynamicProfilePictures, { zIndex: idx }]}
                  ></DynamicProfilePicture>
                );
              } else {
                return null;
              }
            })}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default memo(LikeSection);
