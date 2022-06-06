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

  let notificationsList = data.docs.map((item) => ({
    ...item._document.data.value.mapValue.fields,
    id: item._key.path.segments[8],
  }));

  const sortedListOfNotifications = _.sortBy(
    notificationsList,
    "timestamp.integerValue"
  ).reverse();
  return sortedListOfNotifications;
};
