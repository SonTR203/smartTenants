import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import NotificationBadge from "./NotificationBadge";
import { useAppContext } from "../Context/AppContext";

function ScreenHeader({ title, navigation }) {
  const { currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const styles = StyleSheet.create({
    headerPageTitle: {
      color: styleVariables.colors.white,
    },
  });

  const handleNavigate = () => {
    navigation.navigate("MarketplaceProfile", {
      userId: currentUser.userID,
    });
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
            style={{
              position: "absolute",
              right: 16,
              top: 48,

              padding: 10,
              margin: -10,
            }}
            onPress={handleNavigate}
          >
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: "white",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                ...styleVariables.shadow,
              }}
            >
              <Ionicons name="person" size={20} color="#395E66" />
            </View>
          </TouchableOpacity>

          <View
            style={{
              position: "absolute",
              right: 74,
              top: 30,
            }}
          >
            <NotificationBadge screen={`${title}Navigator`} />
          </View>
        </>
      ) : null}
    </View>
  );
}

export default ScreenHeader;
