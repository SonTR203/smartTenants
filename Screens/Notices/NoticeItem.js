import { React, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { setTime } from "../../utils/setTime";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

function NoticeItem({
  noticeContent,
  theme,
  styleVariables,
  styles,
  navigation,
  timestamp,
  wasSeen,
  id,
}) {
  const [timeSinceNotice, setTimeSinceNotice] = useState("");
  const [viewed, setViewed] = useState(wasSeen);

  useEffect(() => {
    const time = setTime(timestamp);
    setTimeSinceNotice(time);
  }, []);

  const setWasSeenToTrue = async () => {
    const colRef = doc(db, "Notices", `${id}`);
    await updateDoc(colRef, {
      wasSeen: true,
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
            noticeContent: noticeContent,
            theme: theme,
            styleVariables: styleVariables,
            styles: styles,
          });
        }}
      >
        <View className="noticeTextContent">
          <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
            {noticeContent}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NoticeItem;
