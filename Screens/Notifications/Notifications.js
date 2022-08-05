import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";
import { useTheme } from "../../ThemeContext";
import NotificationItem from "./NotificationItem";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import {
  getNoticeCount,
  getAnnouncementCount,
} from "../../utils/Notifications/notifications.services";
import { wait } from "../../utils/wait";
import _ from "lodash";

const Notifications = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const { currentUser, notificationBadges, setNotices, setAnnouncements } =
    useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [wasSeenVar, setWasSeenVar] = useState();
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(async () => {
      fetchNoticeCount();
      fetchAnnouncementCount();
      setRefreshing(false);
    });
  }, []);

  useEffect(async () => {
    if (currentUser) {
      await fetchNoticeCount();
      await fetchAnnouncementCount();
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    // console.log("notifications screen list: ", notificationBadges.list.length);
    if (notificationBadges.list.length > 0) {
      const sortedListOfNotifications = _.sortBy(
        notificationBadges.list,
        "timestamp"
      ).reverse();
      setNotifications(sortedListOfNotifications);
    }
  }, [notificationBadges.list]);

  async function fetchNoticeCount() {
    const count = await getNoticeCount(currentUser);
    setNotices(count);
  }
  async function fetchAnnouncementCount() {
    const count = await getAnnouncementCount(currentUser);
    setAnnouncements(count);
  }

  const callBackRender = useCallback(
    ({ item, index }) => renderNotificationItem({ item, index }),
    [[notifications]]
  );

  const renderNotificationItem = ({ item }) => {
    return (
      <NotificationItem
        notifications={item}
        navigation={navigation}
        theme={theme}
        styleVariables={styleVariables}
        wasSeenVar={wasSeenVar}
        setWasSeenVar={setWasSeenVar}
      />
    );
  };

  const renderAnnouncementsAndNotices = () => {
    return (
      <ListHeader
        styleVariables={styleVariables}
        theme={theme}
        navigation={navigation}
      />
    );
  };

  const renderListEnd = () => {
    return <ListFooter styleVariables={styleVariables} theme={theme} />;
  };

  return (
    <SafeAreaView style={styles.safeareaview(styleVariables)} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={renderAnnouncementsAndNotices}
          style={styles.flatlist}
          contentContainerStyle={styles.flatListContainer}
          data={notifications}
          renderItem={callBackRender}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              style={styles.refreshControl}
              tintColor={styleVariables.colors.primary}
            />
          }
          keyExtractor={(item, index) => item.id + index}
          ListFooterComponent={renderListEnd}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaview: (styleVariables) => ({
    flex: 1,
    backgroundColor: styleVariables.colors.primary,
  }),
  container: {
    flex: 1,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    overflow: "hidden",
    backgroundColor: "white",
  },
  flatlist: { flex: 1 },
  flatListContainer: {
    backgroundColor: "white",
  },
  refreshControl: { backgroundColor: "white" },
});

export default Notifications;
