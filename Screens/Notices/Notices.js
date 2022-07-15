import React, { useEffect, useState, useCallback, useRef } from "react";
import { FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import NoticeItem from "./NoticeItem";
import { wait } from "../../utils/wait";
import ListFooter from "./ListFooter";
import { StatusBar } from "expo-status-bar";

function Notices({ navigation, route }) {
  const [notices, setNotices] = useState([]);
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAppContext();
  const listRef = useRef();

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

  useEffect(() => {
    let timeout;
    // if there are comments, scroll to the the correct comment
    if (route.params.noticeId && notices.length > 0) {
      const index = notices
        .map((announcement) => announcement.id)
        .indexOf(route.params.noticeId);

      timeout = setTimeout(() => {
        listRef.current?.scrollToIndex({ animated: true, index: index });
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [route.params, notices]);

  async function getNotices() {
    const colReference = collection(db, "Notices");
    const q = query(
      colReference,
      where("recipients", "array-contains", currentUser.userID)
    );

    const data = await getDocs(q);

    const formattedData = data.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    setNotices(formattedData);
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
      <StatusBar style="dark" />
      <FlatList
        ref={listRef}
        data={notices}
        renderItem={({ item }) => {
          return (
            <NoticeItem
              content={item.content}
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
