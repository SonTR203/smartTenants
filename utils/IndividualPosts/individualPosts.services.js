import { db } from "../../firebase-config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import _ from "lodash";
import uuid from "react-native-uuid";
import { createItemInFirestore } from "../firebase.services";
import { useState } from "react";

let commentID;

// export const getComments = async (post, item) => {
//   const colRef = collection(db, `Newsfeed/${post.id}/`);

//   const sortedColRef = query(colRef, where("isNSFW", "==", false));

//   const data = await getDocs(sortedColRef);
//   const formattedData = data.docs.map((doc) => {
//     return {
//       ...doc.data(),
//       id: doc.id,
//     };
//   });
//   const sortedListOfPosts = _.sortBy(formattedData, "timestamp").reverse();
//   return sortedListOfPosts;
// };

export const likeComment = async (
  item,
  post,
  currentUser,
  userLikedComment,
  setUserLikedComment,
  numberOfCommentLikes,
  setNumberOfCommentLikes
) => {
  // ================ checking if current user liked comment ====================
  if (userLikedComment) {
    const res = await removeLike(currentUser, post, item);
    if (res) {
      setUserLikedComment(false);
      setNumberOfCommentLikes(numberOfCommentLikes - 1);

      item = {
        ...item,
        peopleWhoLiked: item.peopleWhoLiked.filter(
          (item) => item !== currentUser.userID
        ),
      };
    }
  } else {
    const res = await addLike(currentUser, post, item);
    if (res) {
      setUserLikedComment(true);
      setNumberOfCommentLikes(numberOfCommentLikes + 1);

      item = {
        ...item,
        peopleWhoLiked: [...item.peopleWhoLiked, currentUser.userID],
      };
    }
  }
  return item;
};

export const addLike = async (currentUser, post, item) => {
  const peopleWhoLikedCommentId = uuid.v4();
  const peopleWhoLikedCommentDocRef = doc(
    db,
    `Newsfeed/${post.id}/peopleWhoCommented/`,
    item.id
  );

  // =============== adding user to peopleWhoLiked subcollection & update peopleWhoLiked array =============
  try {
    await createItemInFirestore(
      `Newsfeed/${post.id}/peopleWhoCommented/${item.id}/peopleWhoLiked`,
      peopleWhoLikedCommentId,
      {
        id: peopleWhoLikedCommentId,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        authorID: item.userID,
        userID: currentUser.userID,
      }
    );

    await updateDoc(peopleWhoLikedCommentDocRef, {
      peopleWhoLiked: [...item.peopleWhoLiked, currentUser.userID],
    });
  } catch (error) {
    console.log("error adding like to DB", error);
    alert("Error liking post. Please try again later.");
    return false;
  }
  return true;
};

export const removeLike = async (currentUser, post, item) => {
  // remove document in the peopleWhoLiked subcollection and update the likeCount

  try {
    let commentID = "";

    const peopleWhoLikedColRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${item.id}/peopleWhoLiked`
    );

    const q = query(
      peopleWhoLikedColRef,
      where("userID", "==", currentUser.userID)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      commentID = doc.data().id;
      console.log(commentID);
      console.log("doc to be deleted with unlike => ", doc.data());
      await deleteDoc(doc.ref);
    });

    const peopleWhoLikedDocRef = doc(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${item.id}/peopleWhoLiked`,
      commentID
    );

    await updateDoc(peopleWhoLikedDocRef, {
      peopleWhoLiked: item.peopleWhoLiked.filter(
        (item) => item != currentUser.userID
      ),
    });
  } catch (error) {
    console.log("error remove like: ", error);
    alert("Error removing like. Please try again later.");
    return false;
  }

  return true;
};
