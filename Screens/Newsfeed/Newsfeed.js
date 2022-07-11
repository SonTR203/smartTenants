import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import { constants } from "../../utils/constants";
import Post from "./Post";
import ListFooter from "./ListFooter";
import { wait } from "../../utils/wait";
import { getPosts } from "../../utils/Newsfeed/newsfeed.services";
import Fab from "../../components/Fab";

const Newsfeed = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      fetchNotifications();
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
    return (
      <View
        style={{
          flex: 1,
          marginTop: 50,
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.5,
        }}
      >
        <Text>Your newsfeed is empty. Try creating a post now.</Text>
      </View>
    );
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
          ListFooterComponent={renderListFooter}
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
