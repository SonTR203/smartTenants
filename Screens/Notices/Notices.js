import { React, useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import NoticeItem from "./NoticeItem";
import { wait } from "../../utils/wait";
import ListFooter from "./ListFooter";

function Notices({ navigation }) {
  const [notices, setNotices] = useState([]);
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAppContext();

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
      const filteredNoticeList = noticeList.filter((notice) =>
        notice.recipients.includes(currentUser.userDocId)
      );
      setNotices(filteredNoticeList);
    });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(async () => {
      getNotices();
      setRefreshing(false);
    });
  }, []);

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
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            style={styles.refreshControl}
            tintColor={styleVariables.colors.primary}
          />
        }
        ListFooterComponent={
          <ListFooter styleVariables={styleVariables} theme={theme} />
        }
      />
    </SafeAreaView>
  );
}

export default Notices;
