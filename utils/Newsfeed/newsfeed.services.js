import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import _ from "lodash";

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
