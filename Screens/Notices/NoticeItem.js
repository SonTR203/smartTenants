import { React, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { setTime } from "../../utils/setTime";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useAppContext } from "../../Context/AppContext";

function NoticeItem({
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
    wasSeen.push(currentUser.userID);
    const colRef = doc(db, "Notices", `${id}`);
    await updateDoc(colRef, {
      wasSeen: wasSeen,
    }).then(() => {
      setViewed(true);
    });
  };

  return (
    <View id="post" style={theme.cardContainer}>
      {/* Notice Info */}
      <View id="noticeInfo" style={styles.noticeInfo}>
        <View className="imageAndName" style={styles.imageAndName}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.profileIcon}
          />
          <Text style={[styleVariables.fontSizes.bodyBold, styles.profileName]}>
            {"Smart Living Properties"}
          </Text>
        </View>
        <Text style={[styleVariables.fontSizes.callout, styles.timestampText]}>
          {timeSinceNotice}
        </Text>
        {viewed == false && (
          <View id="notificationIndice" style={styles.noticeIndice} />
        )}
      </View>

      {/* Notice content */}
      <TouchableOpacity
        id="noticeContent"
        onPress={() => {
          setWasSeenToTrue();
          navigation.navigate("IndividualNotice", {
            content: content,
            timestamp: timeSinceNotice,
            theme: theme,
            styleVariables: styleVariables,
            styles: styles,
          });
        }}
      >
        <View className="noticeTextContent">
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {content}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NoticeItem;
