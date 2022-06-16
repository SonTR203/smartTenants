import { React, useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import AnnouncementItem from "./AnnouncementItem";
import { useTheme } from "../../ThemeContext";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const { theme, styleVariables } = useTheme();

  useEffect(() => {
    getAnnouncements();
  });

  async function getAnnouncements() {
    const colReference = collection(db, "Announcements");

    getDocs(colReference).then((snapshot) => {
      let announcementList = [];
      snapshot.docs.forEach((doc) => {
        announcementList.push({ ...doc.data(), id: doc.id });
      });
      console.log(announcementList);
      setAnnouncements(announcementList);
    });
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <FlatList
        data={announcements}
        renderItem={({ item }) => {
          return (
            <AnnouncementItem
              announcementContent={item.announcementContent}
              image={item.image[0]}
              timestamp={item.timestamp}
              wasSeen={item.wasSeen}
              theme={theme}
              styleVariables={styleVariables}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

export default Announcements;
