import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import _ from "lodash";

export const getNotifications = async (currentUser) => {
  const colReference = collection(
    db,
    "Tenants",
    `${currentUser.userID}`,
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

export async function getNoticeCount(currentUser) {
  let unseenNoticeCount = 0;
  const noticeCol = collection(db, "Notices");
  const newNoticeCol = query(
    noticeCol,
    where("recipients", "array-contains", currentUser.userID)
  );
  const data = await getDocs(newNoticeCol);
  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
  formattedData.forEach((notice) => {
    if (!notice.wasSeen.includes(currentUser.userID)) {
      unseenNoticeCount++;
    }
  });
  return unseenNoticeCount;
}

export async function getAnnouncementCount(currentUser) {
  let unseenAnnouncementCount = 0;
  const announcementCol = collection(db, "Announcements");
  const newAnnouncementCol = query(
    announcementCol,
    where("recipients", "array-contains", currentUser.userID)
  );
  const data = await getDocs(newAnnouncementCol);
  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
  formattedData.forEach((announcement) => {
    if (!announcement.wasSeen.includes(currentUser.userID)) {
      unseenAnnouncementCount++;
    }
  });
  return unseenAnnouncementCount;
}
