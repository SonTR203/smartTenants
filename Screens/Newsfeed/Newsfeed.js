import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import {
  constants,
  refreshDelay,
  refreshingHeight,
} from "../../utils/constants";
import Post from "./Post";
import ListFooter from "./ListFooter";
import { wait } from "../../utils/wait";
import { getPosts } from "../../utils/Newsfeed/newsfeed.services";
import Fab from "../../components/Fab";
import EmptyListComponent from "../../components/EmptyListComponent";
import LoadingIndicator from "../../components/LoadingIndicator";

const Newsfeed = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [offsetY, setOffsetY] = useState(0);

  function onScroll(event) {
    const { nativeEvent } = event;
    const { contentOffset } = nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);
  }

  function onRelease() {
    // offsetY must be less than the refreshing height
    // to trigger refresh
    if (offsetY <= -refreshingHeight && !refreshing) {
      onRefresh();
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(refreshDelay).then(async () => {
      await fetchNotifications();
      setRefreshing(false);
    });
  }, []);

  const styles = StyleSheet.create({
    newsfeedContainer: {
      flex: 1,
      backgroundColor: styleVariables.colors.primary,
      overflow: "hidden",
    },
    flatlist: {
      flex: 1,

      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      backgroundColor: styleVariables.colors.white,
    },
    flatListContainer: {
      flex: 1,
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      overflow: "hidden",
      backgroundColor: styleVariables.colors.primary,
    },
  });

  async function fetchNotifications() {
    const list = await getPosts();

    setPosts(list);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (route.params && route.params.reload) {
      setRefreshing(true);
      fetchNotifications();
    }
  }, [route.params]);

  const callBackRender = useCallback(
    ({ item, index }) => renderPostItem({ item, index }),
    [[posts]]
  );

  const renderPostItem = ({ item }) => (
    <Post passedPost={item} windowWidth={constants.width} />
  );

  const renderEmpty = () => {
    return <EmptyListComponent screenName={"newsfeed"} />;
  };

  const renderListFooter = () => {
    if (posts.length > 0) {
      return <ListFooter styleVariables={styleVariables} theme={theme} />;
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />
      <LoadingIndicator visible={refreshing} />
      <View style={styles.flatListContainer}>
        <FlatList
          removeClippedSubviews={true}
          initialNumToRender={3}
          style={styles.flatlist}
          data={posts}
          extraData={refreshing}
          keyExtractor={(item) => item.id}
          renderItem={callBackRender}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderListFooter}
          onScroll={onScroll}
          onResponderRelease={onRelease}
        />
      </View>

      {/* FAB */}
      <Fab
        route={"CreatePost"}
        navigation={navigation}
        theme={theme}
        styleVariables={styleVariables}
      />
    </SafeAreaView>
  );
};

export default Newsfeed;
