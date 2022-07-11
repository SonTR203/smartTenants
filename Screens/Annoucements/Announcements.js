import { React, useState, useEffect, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import AnnouncementItem from "./AnnouncementItem";
import { useTheme } from "../../ThemeContext";
import { wait } from "../../utils/wait";
import ListFooter from "./ListFooter";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";

function Announcements({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAppContext();

  useEffect(() => {
    getAnnouncements();
  }, []);

  const styles = StyleSheet.create({
    refreshControl: { backgroundColor: "white" },
  });

  async function getAnnouncements() {
    const colReference = collection(db, "Announcements");
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
    setAnnouncements(formattedData);
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
      <StatusBar style="dark" />

      <FlatList
        data={announcements}
        renderItem={({ item }) => {
          return (
            <AnnouncementItem
              content={item.content}
              attatchment={item.attatchment[0]}
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
        ListFooterComponent={
          <ListFooter styleVariables={styleVariables} theme={theme} />
        }
      />
    </SafeAreaView>
  );
}

export default Announcements;
