import React, { useEffect, useState, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";
import NoticeItem from "./NoticeItem";
import ListFooter from "./ListFooter";
import { StatusBar } from "expo-status-bar";

function Notices({ navigation, route }) {
  const [list, setList] = useState(null);
  const { theme, styleVariables } = useTheme();
  const { notices } = useAppContext();
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
    if (notices.list && notices.list.length > 0) {
      setList(notices.list);
    }
  }, []);

  useEffect(() => {
    let timeout;
    // if there are comments, scroll to the the correct comment
    if (route.params.noticeId && list.length > 0) {
      const index = list
        .map((announcement) => announcement.id)
        .indexOf(route.params.noticeId);

      timeout = setTimeout(() => {
        listRef.current?.scrollToIndex({ animated: true, index: index });
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [route.params, list]);

  const renderItem = ({ item, index }) => {
    return (
      <NoticeItem
        key={index}
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
      <FlatList
        getItemLayout={(data, index) => ({
          length: data.length,
          offset: data.length * index,
          index,
        })}
        ref={listRef}
        data={list}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

export default Notices;
