import { React, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";
import NoticeItem from "./NoticeItem";

function Notices({ navigation }) {
  const [notices, setNotices] = useState([]);
  const { theme, styleVariables } = useTheme();

  const styles = StyleSheet.create({
    noticeInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 12,
    },
    imageAndName: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    profileIcon: {
      height: 43,
      width: 43,
      borderRadius: 12,
    },
    profileName: {
      color: styleVariables.colors.black,
      marginLeft: 8,
    },
    noticeContent: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
    timestampText: { opacity: 0.66 },
    noticeIndice: {
      height: 8,
      width: 8,
      backgroundColor: styleVariables.colors.primary,
      borderRadius: 99,
      marginLeft: 8,
    },
  });

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <FlatList
        data={notices}
        renderItem={({ item }) => {
          return (
            <NoticeItem
              noticeContent={item.noticeContent}
              timestamp={item.timestamp}
              wasSeen={item.wasSeen}
              id={item.id}
              theme={theme}
              styleVariables={styleVariables}
              styles={styles}
              navigation={navigation}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

export default Notices;
