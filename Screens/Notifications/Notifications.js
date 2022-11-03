import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";
import { useTheme } from "../../ThemeContext";
import NotificationItem from "./NotificationItem";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import _ from "lodash";

const Notifications = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const { notificationBadges, notificationScrollRef } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [wasSeenVar, setWasSeenVar] = useState();

  useEffect(() => {
    if (route.params && route.params.announcementId) {
      navigation.navigate("Announcements", {
        announcementId: route.params.announcementId,
      });
    }

    if (route.params && route.params.noticeId) {
      navigation.navigate("Notices", {
        noticeId: route.params.noticeId,
      });
    }
  }, [route.params]);

  useEffect(() => {
    if (notificationBadges.list.length > 0) {
      const sortedListOfNotifications = _.sortBy(
        notificationBadges.list,
        "timestamp"
      ).reverse();
      setNotifications(sortedListOfNotifications);
    }
  }, [notificationBadges.list]);

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
          keyExtractor={(item, index) => item.id + index}
          ListFooterComponent={renderListEnd}
          ref={(ref) => {
            notificationScrollRef.current = ref;
          }}
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
