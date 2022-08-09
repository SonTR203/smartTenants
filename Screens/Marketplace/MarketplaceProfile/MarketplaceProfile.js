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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../../../Context/AppContext";

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
      icon: "email-outline",
      color: styleVariables.colors.primary,
      onPress: handleNavigateMessages,
    },
    {
      id: 2,
      title: "My listings",
      icon: "view-list-outline",
      color: styleVariables.colors.primary,
      onPress: handleNavigateMyListings,
    },
    {
      id: 3,
      title: "Saved listings",
      icon: "heart-outline",
      color: styleVariables.colors.primary,
      onPress: handleViewSavedListings,
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        marginTop: 30,
        backgroundColor: "white",
      }}
    >
      <FlatList
        scrollEnabled={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={item.onPress} style={theme.cardButton}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  style={{
                    marginRight: 20,
                  }}
                  name={item.icon}
                  size={25}
                  color={item.color}
                />
                <Text
                  style={[
                    styleVariables.fontSizes.title,
                    { color: styleVariables.colors.primary },
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

  badgeNumber: {
    fontWeight: "400",
    color: "white",
    fontSize: 13,
    lineHeight: 18,
  },
});

export default MarketplaceProfile;
