import { React, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    getNotices();
  }, []);

  async function getNotices() {
    const colReference = collection(db, "Notices");

    getDocs(colReference).then((snapshot) => {
      let noticeList = [];
      snapshot.docs.forEach((doc) => {
        noticeList.push({ ...doc.data(), id: doc.id });
      });
      console.log(noticeList);
      setNotices(noticeList);
    });
  }

  return (
    <SafeAreaView>
      <Text>Notices Screen</Text>
    </SafeAreaView>
  );
}

export default Notices;
