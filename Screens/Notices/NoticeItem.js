import React, { useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { setTime } from "../../utils/setTime";
import { useAppContext } from "../../Context/AppContext";
import { updateItemInFirestore } from "../../utils/firebase.services";
import ChevronRightSVG from "../../components/Icons/ChevronRightSVG";
import { Timestamp } from "@firebase/firestore";

function NoticeItem({
  attachment,
  subject,
  content,
  theme,
  styleVariables,
  styles,
  navigation,
  timestamp,
  wasSeen,
  id,
}) {
  const [timeSinceNotice, setTimeSinceNotice] = useState("");
  const [viewed, setViewed] = useState(false);
  const { currentUser, notices, setNotices } = useAppContext();
  const userSeen =
    wasSeen.filter((user) => user.userID === currentUser.userID).length > 0;

  useEffect(() => {
    const time = setTime(timestamp.seconds * 1000);
    setTimeSinceNotice(time);
    if (userSeen) {
      setViewed(true);
    }
  }, []);

  const setWasSeenToTrue = async () => {
    if (!userSeen) {
      const updatedWasSeenArray = [
        ...wasSeen,
        {
          userID: currentUser.userID,
          timestamp: Timestamp.fromDate(new Date()),
        },
      ];

      updateItemInFirestore("Notices", id, { wasSeen: updatedWasSeenArray });
      setViewed(true);
      // update notices in context
      const newNoticeCount = notices - 1;
      setNotices(newNoticeCount);
    }
  };

  const handlePressEvent = () => {
    navigation.navigate("IndividualNotice", {
      attachment: attachment[0] ? attachment[0] : null,
      subject: subject,
      content: content,
      timestamp: timeSinceNotice,
      theme: theme,
      styleVariables: styleVariables,
      styles: styles,
    });
    setWasSeenToTrue();
  };

  return (
    <TouchableOpacity
      onPress={handlePressEvent}
      id="post"
      style={theme.cardContainer}
    >
      {/* Notice Info */}
      <View id="noticeInfo" style={styles.noticeInfo}>
        <View>
          <View style={styles.subjectContainer}>
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.profileName]}
            >
              {subject}
            </Text>
            {viewed == false && (
              <View id="notificationIndice" style={styles.noticeIndice} />
            )}
          </View>
          <Text id="timePosted" style={[styleVariables.fontSizes.callout]}>
            {timeSinceNotice}
          </Text>
        </View>
        <ChevronRightSVG stroke="#D2D2D2" />
      </View>
    </TouchableOpacity>
  );
}

export default memo(NoticeItem);
