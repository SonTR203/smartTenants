import { View, Text, FlatList } from "react-native";
import { React, useEffect, useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { useTheme } from "../../../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getMyPosts } from "../../../utils/Profile/profile.services";
import Post from "../../Newsfeed/Post";
import { constants } from "../../../utils/constants";

const MyPosts = () => {
  const { currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    (async function fetchMyPosts() {
      const list = await getMyPosts(currentUser);
      setUserPosts(list);
    })();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <StatusBar style="auto" />

      {userPosts.length > 0 && (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            // use the exact same Post component as in Newsfeed
            <Post post={item} windowWidth={constants.width} />
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <ListFooter styleVariables={styleVariables} theme={theme} />
          }
        />
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
      }}
    >
      <Text
        style={[
          styleVariables.fontSizes.callout,
          {
            color: styleVariables.colors.black,
            opacity: 0.66,
            paddingBottom: 8,
          },
        ]}
      >
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
        ]}
      >
        Refresh at the top for new posts!
      </Text>
    </View>
  );
}

export default MyPosts;
