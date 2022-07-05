import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import _ from "lodash";

export const getMyPosts = async (currentUser) => {
  const peopleWhoLikedColRef = collection(db, `Newsfeed`);
  const q = query(
    peopleWhoLikedColRef,
    where("userID", "==", currentUser.userID)
  );

  const data = await getDocs(q);

  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });

  const sortedListOfPosts = _.sortBy(formattedData, "timestamp").reverse();

  return sortedListOfPosts;
};

export const compressFileSize = async (uri) => {
  const compressedUri = await manipulateAsync(uri, [], {
    compress: 0.6,
    format: SaveFormat.PNG,
  });
  return compressedUri;
};

export const getFileInfo = async (fileURI) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  if (fileInfo.size) {
    return fileInfo.size / 1024 / 1024;
  }
  return fileInfo;
};
