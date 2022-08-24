import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import NotificationBadge from "./NotificationBadge";

function ScreenHeader({ title, navigation }) {
  const { theme, styleVariables } = useTheme();
  const styles = StyleSheet.create({
    headerPageTitle: {
      color: styleVariables.colors.white,
    },
    marketplaceProfile: {
      position: "absolute",
      right: 16,
      top: 55,

      padding: 10,
      margin: -10,
    },
    profileContainer: {
      width: 32,
      height: 32,
      backgroundColor: "white",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      ...styleVariables.shadow,
    },
    badgeContainer: {
      position: "absolute",
      right: 74,
      top: 30,
    },
  });

  const handleNavigate = () => {
    navigation.navigate("MarketplaceProfile");
  };

  return (
    <View style={theme.header}>
      {/* headerPageTitle */}
      <Text style={[styleVariables.fontSizes.header, styles.headerPageTitle]}>
        {title}
      </Text>
      {title === "Marketplace" ? (
        <>
          <TouchableOpacity
            style={styles.marketplaceProfile}
            onPress={handleNavigate}
          >
            <View style={styles.profileContainer}>
              <Ionicons name="person" size={20} color="#395E66" />
            </View>
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            <NotificationBadge screen={`${title}Navigator`} />
          </View>
        </>
      ) : null}
    </View>
  );
}

export default ScreenHeader;
