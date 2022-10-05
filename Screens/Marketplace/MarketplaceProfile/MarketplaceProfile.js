import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ChevronRightSVG from "../../../components/Icons/ChevronRightSVG";
import { useTheme } from "../../../ThemeContext";
import { useAppContext } from "../../../Context/AppContext";
import HeartSVG from "../../../components/Icons/HeartSVG";
import ListingSVG from "../../../components/Icons/ListingSVG";
import MessageSVG from "../../../components/Icons/MessageSVG";

function MarketplaceProfile({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const { currentUser, marketplaceBadges } = useAppContext();
  const handleNavigateMessages = () => {
    navigation.navigate("MessagesListScreen", {
      userId: currentUser.userID,
    });
  };
  const handleNavigateMyListings = () => {
    navigation.navigate("MyListings");
  };
  const handleViewSavedListings = () => {
    navigation.navigate("SavedListings");
  };
  const data = [
    {
      id: 1,
      title: "Messages",
      icon: () => {
        return <MessageSVG />;
      },
      onPress: handleNavigateMessages,
    },
    {
      id: 2,
      title: "My listings",
      icon: () => {
        return <ListingSVG />;
      },
      onPress: handleNavigateMyListings,
    },
    {
      id: 3,
      title: "Saved listings",
      icon: () => {
        return <HeartSVG width={24} height={25} stroke={1.5} />;
      },
      onPress: handleViewSavedListings,
    },
  ];
  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={item.onPress}
              style={[theme.cardButton, { marginTop: item.id === 1 ? 30 : 0 }]}
            >
              <View style={styles.buttonContainer}>
                {item.icon()}
                <Text
                  style={[
                    styleVariables.fontSizes.title,
                    { color: styleVariables.colors.primary, marginLeft: 10 },
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              <View id="counter" style={theme.counter}>
                {marketplaceBadges.unseen.length > 0 && item.id === 1 ? (
                  <View style={styles.badgeView}>
                    <Text style={styles.badgeNumber}>
                      {marketplaceBadges.unseen.length}
                    </Text>
                  </View>
                ) : null}
                <ChevronRightSVG stroke="#395E66" />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  badgeView: {
    height: 22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#395E66",
    borderRadius: 20,

    flexDirection: "column",
    alignItems: "flex-start",

    marginRight: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeNumber: {
    fontWeight: "400",
    color: "white",
    fontSize: 13,
    lineHeight: 18,
  },
});

export default MarketplaceProfile;
