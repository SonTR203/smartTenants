import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Modal,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import { constants, refreshDelay } from "../../utils/constants";
import Post from "./Post";
import ListFooter from "./ListFooter";
import { wait } from "../../utils/wait";
import {
  getPosts,
  listenForNewPost,
} from "../../utils/Newsfeed/newsfeed.services";
import Fab from "../../components/Fab";
import EmptyListComponent from "../../components/EmptyListComponent";
import FlatListRefreshControl from "../../components/FlatListRefreshControl";
import PopupModal from "../../components/PopupModal";

const Newsfeed = ({ navigation, route }) => {
  const { theme, styleVariables } = useTheme();
  const [posts, setPosts] = useState([]);
  const [newPostsLength, setNewPostsLength] = useState(0);
  const [refreshing, setRefreshing] = useState(true);
  const slideDown = useRef(new Animated.Value(-100)).current;
  let flatListRef;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetAnimation();
    wait(refreshDelay).then(async () => {
      await fetchNotifications();
      setRefreshing(false);
    });
  }, []);

  const styles = StyleSheet.create({
    newsfeedContainer: {
      flex: 1,
      backgroundColor: styleVariables.colors.primary,
    },
    flatlist: {
      flex: 1,
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      backgroundColor: "transparent",
    },
    flatListContainer: {
      flex: 1,
      overflow: "hidden",
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      backgroundColor: "white",
    },
    newPostsButtonContainer: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "7.5%",
      zIndex: 2,
    },
    newPostsButton: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: 36,
      backgroundColor: "#29AA6B",
      paddingVertical: 8,
      paddingHorizontal: 24,
      gap: 8,
      borderRadius: 16,
    },
  });

  async function fetchNotifications() {
    const list = await getPosts();
    setPosts(list);
    setRefreshing(false);
  }

  const startAnimation = () => {
    Animated.spring(slideDown, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const resetAnimation = () => {
    Animated.spring(slideDown, {
      toValue: -100,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (route.params && route.params.reload) {
      setRefreshing(true);
      fetchNotifications();
    }
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = listenForNewPost(setNewPostsLength);
    return () => {
      unsubscribe();
    };
  }, []);

  // new posts button animation handler
  useEffect(() => {
    if (refreshing) return;
    if (newPostsLength > posts.length) {
      startAnimation();
    }
  }, [newPostsLength, posts]);
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
      <Modal
        animationType="slide"
        transparent={true}
        // statusBarTranslucent={true}
        visible={route.params?.saveModal === true ? true : false}
        onRequestClose={() => {
          navigation.setParams({
            saveModal: false,
            reload: null,
          });
        }}
        onShow={() => {
          setTimeout(() => {
            navigation.setParams({
              saveModal: false,
              reload: null,
            });
          }, 2000);
        }}>
        <PopupModal
          modalType={route.params?.modalType}
          message={route.params?.message}
          hideModal={() => {
            navigation.setParams({
              saveModal: false,
              reload: null,
            });
          }}
        />
      </Modal>
      <View style={styles.flatListContainer}>
        <FlatListRefreshControl refreshing={refreshing} />
        <Animated.View
          style={[
            styles.newPostsButtonContainer,
            {
              transform: [{ translateY: slideDown }],
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              resetAnimation();
              flatListRef.scrollToOffset({ offset: 0, animated: true });
              setRefreshing(true);
              fetchNotifications();
            }}
            activeOpacity={1}
            style={styles.newPostsButton}>
            <Text
              style={[{ color: "#fff" }, styleVariables.fontSizes.calloutBold]}>
              New posts
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
          ref={(ref) => (flatListRef = ref)}
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
