import { React, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

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
    <View>
      <Text>Annonucements</Text>
    </View>
  );
}

export default Announcements;
