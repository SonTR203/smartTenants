import { React, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";

const NoticeItem = ({ noticeContent }) => (
  <View>
    <Text>{noticeContent}</Text>
  </View>
);

function Notices() {
  const [notices, setNotices] = useState([]);
  const { theme, styleVariables } = useTheme();

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
      <FlatList
        data={notices}
        renderItem={({ item }) => {
          return <NoticeItem noticeContent={item.noticeContent} />;
        }}
      />
    </SafeAreaView>
  );
}

export default Notices;
