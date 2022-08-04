import { React, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { setTime } from "../../utils/setTime";
import { useAppContext } from "../../Context/AppContext";
import { updateItemInFirestore } from "../../utils/firebase.services";
import ChevronRightSVG from "../../components/Icons/ChevronRightSVG";

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
  const { currentUser } = useAppContext();

  useEffect(() => {
    const time = setTime(timestamp);
    setTimeSinceNotice(time);
    if (wasSeen.includes(currentUser.userID)) {
      setViewed(true);
    }
  }, []);

  const setWasSeenToTrue = async () => {
    if (!wasSeen.includes(currentUser.userID)) {
      wasSeen.push(currentUser.userID);
      updateItemInFirestore("Notices", id, { wasSeen: wasSeen });
      setViewed(true);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setWasSeenToTrue();
        navigation.navigate("IndividualNotice", {
          attachment: attachment,
          subject: subject,
          content: content,
          timestamp: timeSinceNotice,
          theme: theme,
          styleVariables: styleVariables,
          styles: styles,
        });
      }}
      id="post"
      style={theme.cardContainer}
    >
      {/* Notice Info */}
      <View id="noticeInfo" style={styles.noticeInfo}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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

export default NoticeItem;
