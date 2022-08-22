import React, { useState, useEffect, useRef } from "react";
import { FlatList, View } from "react-native";
import AnnouncementItem from "./AnnouncementItem";
import { useTheme } from "../../ThemeContext";
import ListFooter from "./ListFooter";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../Context/AppContext";
import _ from "lodash";

function Announcements({ navigation, route }) {
  const [list, setList] = useState([]);
  const { theme, styleVariables } = useTheme();
  const { announcements } = useAppContext();
  const listRef = useRef();

  useEffect(() => {
    if (announcements.list && announcements.list.length > 0) {
      const orderedList = _.sortBy(announcements.list, "timestamp").reverse();
      setList(orderedList);
    }
  }, [announcements]);

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

  const renderItem = ({ item, index }) => {
    return (
      <AnnouncementItem
        key={index}
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
      <FlatList
        ref={listRef}
        getItemLayout={(data, index) => ({
          length: data.length,
          offset: data.length * index,
          index,
        })}
        data={list}
        renderItem={renderItem}
        ListFooterComponent={renderListFooter}
      />
    </View>
  );
}

export default Announcements;
