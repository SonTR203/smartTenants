import React, { useEffect, useState, useCallback, useRef } from "react";
import { FlatList, StyleSheet, RefreshControl, View } from "react-native";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import NoticeItem from "./NoticeItem";
import { wait } from "../../utils/wait";
import ListFooter from "./ListFooter";
import { StatusBar } from "expo-status-bar";
import FlatListRefreshControl from "../../components/FlatListRefreshControl";

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
      color: "#4D4D4D",
    },
    timestampText: { color: "#9D9D9D" },
    noticeIndice: {
      height: 8,
      width: 8,
      backgroundColor: styleVariables.colors.notificationBadge,
      borderRadius: 99,
      marginLeft: 8,
    },
    contentContainer: {
      marginTop: 8,
      marginBottom: 16,
    },
    attachmentButton: {
      marginTop: 22,
      backgroundColor: styleVariables.colors.primary,
      marginHorizontal: 16,
      padding: 16,
      borderRadius: 16,

      justifyContent: "center",
      alignItems: "center",
    },
    attachmentText: {
      color: styleVariables.colors.white,
      fontSize: 17,
      fontWeight: "500",
      ...styleVariables.shadow,
    },
    noticeContent: {
      color: "#4D4D4D",
    },
    subjectContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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

  const renderItem = ({ item }) => {
    return (
      <NoticeItem
        attachment={item.attachment}
        subject={item.subject}
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
  };

  const renderFooter = () => {
    return <ListFooter styleVariables={styleVariables} theme={theme} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
      <StatusBar style="light" />
      <FlatListRefreshControl refreshing={refreshing} />
      <FlatList
        getItemLayout={(data, index) => ({
          length: data.length,
          offset: data.length * index,
          index,
        })}
        ref={listRef}
        data={notices}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            progressBackgroundColor="white"
            colors={[styleVariables.colors.primary]}
            tintColor="transparent"
            style={{ backgroundColor: "transparent", color: "transparent" }}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        }
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

export default Notices;
