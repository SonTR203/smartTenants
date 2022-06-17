import { React, useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import AnnouncementItem from "./AnnouncementItem";
import { useTheme } from "../../ThemeContext";
import { wait } from "../../utils/wait";

function Announcements({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAnnouncements();
  }, []);

  const styles = StyleSheet.create({
    refreshControl: { backgroundColor: "white" },
  });

  async function getAnnouncements() {
    const colReference = collection(db, "Announcements");

    getDocs(colReference).then((snapshot) => {
      let announcementList = [];
      snapshot.docs.forEach((doc) => {
        announcementList.push({ ...doc.data(), id: doc.id });
      });
      console.log(announcementList);
      setAnnouncements(announcementList);
    });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(async () => {
      getAnnouncements();
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <FlatList
        data={announcements}
        renderItem={({ item }) => {
          return (
            <AnnouncementItem
              announcementContent={item.announcementContent}
              image={item.image[0]}
              timestamp={item.timestamp}
              wasSeen={item.wasSeen}
              id={item.id}
              navigation={navigation}
              theme={theme}
              styleVariables={styleVariables}
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
      />
    </SafeAreaView>
  );
}

export default Announcements;
