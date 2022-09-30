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

export const getComments = async () => {
  const colRef = collection(db, `Newsfeed/${post.id}/peopleWhoCommented`);

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

export const likeComment = async (
  item,
  post,
  currentUser,
  userLikedComment,
  setUserLikedComment,
  numberOfCommentLikes,
  setNumberOfCommentLikes
) => {
  let updatedComment = item;

  // addLike(currentUser, post, item);
  // ================ checking if current user liked comment ====================
  if (userLikedComment) {
    const res = await removeLike(currentUser, item);
    if (res) {
      setUserLikedComment(false);
      setNumberOfCommentLikes(numberOfLikes - 1);

      updatedComment = {
        ...item,
        peopleWhoLiked: item.peopleWhoLiked.filter(
          (item) => item !== currentUser.userID
        ),
      };
    }
  } else {
  }
  const res = await addLike(currentUser, item);
  if (res) {
    setUserLiked(true);
    setNumberOfLikes(numberOfLikes + 1);

    likedComment = {
      ...item,
      peopleWhoLiked: [...post.peopleWhoLiked, currentUser.userID],
    };
  }
  return likedComment;
};

export const addLike = async (currentUser, post, item) => {
  const peopleWhoLikedCommentId = uuid.v4();
  const peopleWhoLikedCommentDocRef = doc(db, "Newsfeed", post.id);

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
      peopleWhoLikedComment: [...item.peopleWhoLiked, currentUser.userID],
    });
  } catch (error) {
    console.log("error adding like to DB", error);
    alert("Error liking post. Please try again later.");
    return false;
  }

  return true;
};

// export const removeLike = async (currentUser, post, item) => {
//   // remove document in the peopleWhoLiked subcollection and update the likeCount
//   try {
//     const peopleWhoLikedColRef = collection(
//       db,
//       `Newsfeed/${post.id}/peopleWhoLiked`
//     );
//     const peopleWhoLikedDocRef = doc(db, "Newsfeed", post.id);
//     const q = query(
//       peopleWhoLikedColRef,
//       where("userID", "==", currentUser.userID)
//     );

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach(async (doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       console.log("doc to be deleted with unlike => ", doc.data());
//       await deleteDoc(doc.ref);
//     });

//     await updateDoc(peopleWhoLikedDocRef, {
//       peopleWhoLiked: post.peopleWhoLiked.filter(
//         (item) => item != currentUser.userID
//       ),
//     });
//   } catch (error) {
//     console.log("error remove like: ", error);
//     alert("Error removing like. Please try again later.");
//     return false;
//   }

//   return true;
// };
