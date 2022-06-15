import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import Post from "./Post";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import { wait } from "../../utils/wait";
import { getPosts } from "../../utils/Newsfeed/newsfeed.services";
import Fab from "../../components/Fab";

const Newsfeed = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      getPosts();
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

  useEffect(() => {
    (async function fetchNotifications() {
      const list = await getPosts();

      setPosts(list);
      setRefreshing(false);
    })();
  }, []);

  const callBackRender = useCallback(
    ({ item, index }) => renderPostItem({ item, index }),
    [[posts]]
  );

  const renderPostItem = ({ item }) => (
    <Post post={item} windowWidth={windowWidth} />
  );

  return (
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.flatListContainer}>
        <FlatList
          removeClippedSubviews={true}
          initialNumToRender={3}
          style={styles.flatlist}
          ListHeaderComponent={
            <ListHeader styleVariables={styleVariables} theme={theme} />
          }
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={callBackRender}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              style={{
                backgroundColor: styleVariables.colors.white,
              }}
              tintColor={styleVariables.colors.primary}
            />
          }
          ListFooterComponent={
            <ListFooter styleVariables={styleVariables} theme={theme} />
          }
        />
      </View>

      {/* FAB */}
      <Fab
        navigation={navigation}
        theme={theme}
        styleVariables={styleVariables}
      />
    </SafeAreaView>
  );
};

export default Newsfeed;
