import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";
import { useTheme } from "../../ThemeContext";
import NotificationItem from "./NotificationItem";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import { getNotifications } from "../../utils/Notifications/notifications.services";
import { wait } from "../../utils/wait";

const Notifications = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const { currentUser } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [wasSeenVar, setWasSeenVar] = useState();
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(async () => {
      const list = await getNotifications(currentUser);
      setNotifications(list);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      (async function fetchNotifications() {
        const list = await getNotifications(currentUser);
        setNotifications(list);
        setRefreshing(false);
      })();
    }
  }, [currentUser]);

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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
      edges={["top"]}
    >
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
          overflow: "hidden",
          backgroundColor: styleVariables.colors.white,
        }}
      >
        <FlatList
          ListHeaderComponent={
            <ListHeader
              styleVariables={styleVariables}
              theme={theme}
              navigation={navigation}
            />
          }
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
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <ListFooter styleVariables={styleVariables} theme={theme} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatlist: { flex: 1 },
  flatListContainer: {
    backgroundColor: "white",
  },
  refreshControl: { backgroundColor: "white" },
});

export default Notifications;
