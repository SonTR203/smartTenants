import React, { useState, useEffect, useCallback, useRef } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import AnnouncementItem from "./AnnouncementItem";
import { useTheme } from "../../ThemeContext";
import { wait } from "../../utils/wait";
import ListFooter from "./ListFooter";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";
import FlatListRefreshControl from "../../components/FlatListRefreshControl";

function Announcements({ navigation, route }) {
  const [announcements, setAnnouncements] = useState([]);
  const { theme, styleVariables } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAppContext();
  const listRef = useRef();

  useEffect(() => {
    getAnnouncements();
  }, []);

  // execute function
  useEffect(() => {
    let timeout;
    // if there are comments, scroll to the the correct comment
    if (route.params.announcementId && announcements.length > 0) {
      const index = announcements
        .map((announcement) => announcement.id)
        .indexOf(route.params.announcementId);

      timeout = setTimeout(() => {
        listRef.current?.scrollToIndex({ animated: true, index: index });
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [route.params, announcements]);

  async function getAnnouncements() {
    const colReference = collection(db, "Announcements");
    const q = query(
      colReference,
      where("recipients", "array-contains", currentUser.buildingName)
    );

    const data = await getDocs(q);

    const formattedData = data.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    console.log("formattedData: ", formattedData);
    setAnnouncements(formattedData);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(async () => {
      getAnnouncements();
      setRefreshing(false);
    });
  }, []);

  const renderItem = ({ item }) => {
    return (
      <AnnouncementItem
        content={item.content}
        attachment={item.attachment[0]}
        timestamp={item.timestamp}
        wasSeen={item.wasSeen}
        id={item.id}
        navigation={navigation}
        theme={theme}
        styleVariables={styleVariables}
      />
    );
  };

  const renderListFooter = () => {
    return <ListFooter styleVariables={styleVariables} theme={theme} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
      <StatusBar style="light" />
      <FlatListRefreshControl refreshing={refreshing} />
      <FlatList
        ref={listRef}
        data={announcements}
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
        ListFooterComponent={renderListFooter}
      />
    </View>
  );
}

export default Announcements;
