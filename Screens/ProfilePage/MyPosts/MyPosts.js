import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { React, useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { useTheme } from "../../../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  getMyPosts,
  getMyMarketplacePosts,
} from "../../../utils/Profile/profile.services";
import Post from "../../Newsfeed/Post";
import MarketplaceFirstItem from "../../Marketplace/MarketplaceItem/MarketplaceFirstItem";
import { constants } from "../../../utils/constants";
import { wait } from "../../../utils/wait";

const MyPosts = ({ navigation, route }) => {
  const { currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [userNewsfeedPosts, setUserNewsfeedPosts] = useState([]);
  const [userMarketplacePosts, setUserMarketplacePosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [postsType, setPostsType] = useState("Newsfeed");
  const [refreshing, setRefreshing] = useState(false);

  async function fetchMyPosts() {
    const newsfeedList = await getMyPosts(currentUser);
    const marketplaceList = await getMyMarketplacePosts(currentUser);
    setUserNewsfeedPosts(newsfeedList);
    setUserMarketplacePosts(marketplaceList);
    setRefreshing(false);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      fetchMyPosts();
    });
  }, []);

  const callBackRender = useCallback(
    ({ item, index }) => renderPostItem({ item, index }),
    [[displayedPosts]]
  );

  const renderPostItem = ({ item }) => {
    if (postsType === "Newsfeed")
      return (
        <Post passedPost={item} windowWidth={constants.width} isMyPost={true} />
      );
    if (postsType === "Marketplace")
      return (
        <MarketplaceFirstItem
          item={item}
          navigation={navigation}
          isMyPost={true}
        />
      );
  };

  const handleCreateNewPost = () => {
    if (postsType === "Newsfeed") return navigation.navigate("CreatePost");
    return navigation.navigate("CreateMarketplaceItem");
  };
  const styles = StyleSheet.create({
    postsOptions: {
      position: "absolute",
      width: "100%",
      top: -12,
      paddingHorizontal: 17,
      paddingBottom: 0,
      zIndex: 11111,
    },
    slider: {
      height: 4,
      marginTop: 7,
      backgroundColor: "#395E66",
      borderTopRightRadius: 2,
      borderTopLeftRadius: 2,
    },
    postOptionButton: {
      paddingHorizontal: 7,
      flex: 1,
    },
    postOptionButtonText: {
      color: styleVariables.colors.primary,
      textAlign: "center",
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 17,
      width: "100%",
      alignItems: "center",
    },
  });

  useEffect(() => {
    fetchMyPosts();
  }, []);
  useEffect(() => {
    if (route.params && route.params.reload) {
      setRefreshing(true);
      fetchMyPosts();
    }
  }, [route.params]);
  useEffect(() => {
    setDisplayedPosts(userNewsfeedPosts);
    if (postsType === "Marketplace")
      return setDisplayedPosts(userMarketplacePosts);
  }, [postsType, userNewsfeedPosts, userMarketplacePosts]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: styleVariables.colors.white,
      }}>
      <StatusBar style="auto" />
      <View style={[theme.stackHeader, styles.postsOptions]}>
        <TouchableOpacity
          style={[styles.postOptionButton]}
          onPress={() => setPostsType("Newsfeed")}>
          <Text
            style={[
              styleVariables.fontSizes.title,
              styles.postOptionButtonText,
              {
                fontFamily:
                  postsType === "Newsfeed"
                    ? "Roboto_500Medium"
                    : "Roboto_400Regular",
              },
            ]}>
            Newsfeed
          </Text>
          <View
            style={[
              styles.slider,
              { opacity: postsType === "Newsfeed" ? 1 : 0 },
            ]}></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.postOptionButton]}
          onPress={() => setPostsType("Marketplace")}>
          <Text
            style={[
              styleVariables.fontSizes.title,
              styles.postOptionButtonText,
              {
                fontFamily:
                  postsType === "Marketplace"
                    ? "Roboto_500Medium"
                    : "Roboto_400Regular",
              },
            ]}>
            Marketplace
          </Text>
          <View
            style={[
              styles.slider,
              { opacity: postsType === "Marketplace" ? 1 : 0 },
            ]}></View>
        </TouchableOpacity>
      </View>
      {displayedPosts.length > 0 ? (
        <FlatList
          style={{
            height:
              Dimensions.get("window").height -
              Dimensions.get("window").height * 0.12,
            marginBottom: -Dimensions.get("window").height * 0.12,
            marginTop: Platform.OS === "android" ? 24 : 0,
          }}
          data={displayedPosts}
          renderItem={callBackRender}
          keyExtractor={(item) => item.id}
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
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              style={{
                backgroundColor: styleVariables.colors.white,
              }}
              tintColor={styleVariables.colors.primary}
            />
          }>
          <Text
            style={[
              styleVariables.fontSizes.callout,
              { marginTop: Platform.OS === "android" ? 48 : 24 },
            ]}>
            You don’t have any {postsType === "Newsfeed" ? "posts" : "listings"}{" "}
            yet.
          </Text>
          <TouchableOpacity
            onPress={handleCreateNewPost}
            id="submitPostButton"
            style={[theme.primaryButton, { marginTop: 24 }]}>
            <Text
              style={[
                theme.primaryButtonText,
                styleVariables.fontSizes.bodyBold,
              ]}>
              Create {postsType === "Newsfeed" ? "posts" : "listings"}{" "}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

function ListFooter({ styleVariables }) {
  return (
    <View
      style={{
        height: 204,
        paddingVertical: 17,
        paddingHorizontal: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text
        style={[
          styleVariables.fontSizes.callout,
          {
            color: styleVariables.colors.black,
            opacity: 0.66,
            paddingBottom: 8,
          },
        ]}>
        Oh oh! Seems like you've reached the end.
      </Text>
      <Text
        style={[
          styleVariables.fontSizes.callout,
          {
            color: styleVariables.colors.black,
            opacity: 0.66,
            paddingBottom: 102,
          },
        ]}>
        Refresh at the top for new posts!
      </Text>
    </View>
  );
}

export default MyPosts;
