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

// Get Post
export const getComments = async (post, setComments) => {
  const peopleWhoCommentedColRef = collection(
    db,
    `Newsfeed/${post.id}/peopleWhoCommented/`
  );

  const data = await getDocs(peopleWhoCommentedColRef);

  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });

  const sortedListOfPosts = _.sortBy(formattedData, "timestamp");

  setComments(sortedListOfPosts);
  return sortedListOfPosts;
};

// Delete Comment
export const deleteComment = async (
  post,
  item,
  setModalVisible,
  setComments
) => {
  try {
    const peopleWhoCommentedColRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/`
    );

    const peopleWhoCommentedDocRef = doc(db, `Newsfeed/${post.id}`);

    const q = query(peopleWhoCommentedColRef, where("id", "==", item.id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("doc to be deleted with deleteComment => ", doc.data());
      await deleteDoc(doc.ref);
    });

    await updateDoc(peopleWhoCommentedDocRef, {
      commentCount: post.commentCount - 1,
    });
  } catch (error) {
    console.log("error remove comment: ", error);
    alert("Error removing comment. Please try again later.");
    return;
  }

  setModalVisible(false);
  getComments(post, setComments);

  return post;
};

// Delete Reply
export const deleteReply = async (
  post,
  item,
  currentUser,
  setModalVisible,
  setComments
) => {
  try {
    const peopleWhoCommentedColRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${item.commentID}/peopleWhoReplied/`
    );

    const peopleRepliedDocRef = doc(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${item.commentID}`
    );

    const q = query(peopleWhoCommentedColRef, where("id", "==", item.id));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("doc to be deleted with deleteReply => ", doc.data());
      await deleteDoc(doc.ref);
    });
    await updateDoc(peopleRepliedDocRef, { updated: true });

    setModalVisible(false);
    getComments(post, setComments);
  } catch (error) {
    console.log("error remove comment: ", error);
    alert("Error removing comment. Please try again later.");
    return null;
  }

  return post;
};

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
  let commentID;

  try {
    const peopleWhoLikedColRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${item.id}/peopleWhoLiked`
    );

    const q = query(
      peopleWhoLikedColRef,
      where("userID", "==", currentUser.userID)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      commentID = doc.data().id;
    });

    const peopleWhoLikedCommentDocRef = doc(
      db,
      `Newsfeed/${post.id}/peopleWhoCommented/${item.id}`
    );

    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("doc to be deleted with unlike => ", doc.data());
      await deleteDoc(doc.ref);
    });

    await updateDoc(peopleWhoLikedCommentDocRef, {
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
