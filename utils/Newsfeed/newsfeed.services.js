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
import { createItemInFirestore, createListener } from "../firebase.services";

export const getPosts = async () => {
  const colRef = collection(db, "Newsfeed");

  const sortedColRef = query(colRef, where("isNSFW", "==", false));

  const data = await getDocs(sortedColRef);
  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
  const sortedListOfPosts = _.sortBy(formattedData, "timestamp").reverse();
  return sortedListOfPosts;
};

export const likePost = async (
  userLiked,
  setUserLiked,
  setNumberOfLikes,
  numberOfLikes,
  currentUser,
  post
) => {
  let updatedPost = post;
  // ================ checking if current user liked post ====================
  if (userLiked) {
    const res = await removeLike(currentUser, post);
    if (res) {
      setUserLiked(false);
      setNumberOfLikes(numberOfLikes - 1);

      updatedPost = {
        ...post,
        peopleWhoLiked: post.peopleWhoLiked.filter(
          (item) => item !== currentUser.userID
        ),
      };
    }
  } else {
    const res = await addLike(currentUser, post);
    if (res) {
      setUserLiked(true);
      setNumberOfLikes(numberOfLikes + 1);

      updatedPost = {
        ...post,
        peopleWhoLiked: [...post.peopleWhoLiked, currentUser.userID],
      };
    }
  }
  return updatedPost;
};

export const addLike = async (currentUser, post) => {
  const peopleWhoLikedId = uuid.v4();
  const peopleWhoLikedDocRef = doc(db, "Newsfeed", post.id);

  // =============== adding user to peopleWhoLiked subcollection & update peopleWhoLiked array =============
  try {
    await createItemInFirestore(
      `Newsfeed/${post.id}/peopleWhoLiked`,
      peopleWhoLikedId,
      {
        id: peopleWhoLikedId,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        postID: post.id,
        authorID: post.userID,
        userID: currentUser.userID,
      }
    );

    await updateDoc(peopleWhoLikedDocRef, {
      peopleWhoLiked: [...post.peopleWhoLiked, currentUser.userID],
    });
  } catch (error) {
    console.log("error adding like to DB", error);
    alert("Error liking post. Please try again later.");
    return false;
  }

  return true;
};

export const removeLike = async (currentUser, post) => {
  // remove document in the peopleWhoLiked subcollection and update the likeCount
  try {
    const peopleWhoLikedColRef = collection(
      db,
      `Newsfeed/${post.id}/peopleWhoLiked`
    );
    const peopleWhoLikedDocRef = doc(db, "Newsfeed", post.id);
    const q = query(
      peopleWhoLikedColRef,
      where("userID", "==", currentUser.userID)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("doc to be deleted with unlike => ", doc.data());
      await deleteDoc(doc.ref);
    });

    await updateDoc(peopleWhoLikedDocRef, {
      peopleWhoLiked: post.peopleWhoLiked.filter(
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

export const listenForNewPost = (setter) => {
  return createListener("Newsfeed", (snapshot) => {
    let approvedPosts = [];
    snapshot.docs.forEach((doc) => {
      if (doc.data().isNSFW === true) return;
      return approvedPosts.push(doc.data());
    });
    setTimeout(() => {
      setter(approvedPosts.length);
    }, 1000);
  });
};
