import { React, useState, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";

import { useTheme } from "../../ThemeContext";

import NotificationItem from "./NotificationItem";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import { getNotifications } from "../../utils/Notifications/notifications.services";

const Notifications = ({ navigation }) => {
  const [theme, styleVariables] = useTheme();
  const { currentUser } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [wasSeenVar, setWasSeenVar] = useState();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (currentUser) {
      (async function fetchNotifications() {
        const list = await getNotifications(currentUser);

        setNotifications(list);
        setRefreshing(false);
      })();
    }
  }, [currentUser]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
      edges={["top"]}
    >
      <StatusBar style="light" />
      <View style={[theme.pageContainer, styles.container]}>
        <ListHeader
          navigation={navigation}
          styleVariables={styleVariables}
          theme={theme}
        />
        {notifications.length === 0 ? null : (
          <FlatList
            style={styles.flatlist}
            data={notifications}
            renderItem={({ item }) => {
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
            }}
            refreshControl={
              <RefreshControl
                onRefresh={async () => {
                  const list = await getNotifications(currentUser);
                  setNotifications(list);
                }}
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
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: { flex: 1 },
  refreshControl: { backgroundColor: "white" },
});

export default Notifications;
