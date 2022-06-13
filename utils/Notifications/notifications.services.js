import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import _ from "lodash";

export const getNotifications = async (currentUser) => {
  const colReference = collection(
    db,
    "Users",
    `${currentUser.userDocId}`,
    "Notifications"
  );
  const data = await getDocs(colReference);

  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });

  const sortedListOfNotifications = _.sortBy(
    formattedData,
    "timestamp"
  ).reverse();
  return sortedListOfNotifications;
};
