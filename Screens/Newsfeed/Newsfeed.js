import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase-config";
import { useTheme } from "../../ThemeContext";
import { Dimensions } from "react-native";
import _ from "lodash";
const windowWidth = Dimensions.get("window").width;
import Post from "./Post";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import Fab from "./Fab";
import { wait } from "../../utils/wait";

const Newsfeed = ({ navigation }) => {
  const [theme, styleVariables] = useTheme();
  const [posts, setPosts] = useState([]);
  const colRef = collection(db, "Newsfeed");
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
    },
  });

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const data = await getDocs(colRef);
    let listOfPosts = data.docs.map((item) => ({
      ...item._document.data.value.mapValue.fields,
      id: item._key.path.segments[6],
    }));
    let sortedListOfPosts = _.sortBy(
      listOfPosts,
      "timestamp.integerValue"
    ).reverse();
    setPosts(sortedListOfPosts);

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.newsfeedContainer} edges={["top"]}>
      <StatusBar style="light" />

      <View
        style={{
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
          overflow: "hidden",
          backgroundColor: styleVariables.colors.white,
        }}
      >
        <FlatList
          style={{
            marginTop: 20,
          }}
          contentContainerStyle={{
            backgroundColor: styleVariables.colors.white,
          }}
          ListHeaderComponent={
            <ListHeader styleVariables={styleVariables} theme={theme} />
          }
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Post
              posts={item}
              navigation={navigation}
              theme={theme}
              styleVariables={styleVariables}
              windowWidth={windowWidth}
            />
          )}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              style={{
                backgroundColor: "white",
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
