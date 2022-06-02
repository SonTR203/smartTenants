import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../ThemeContext";

function ProfileHeader({ navigation, currentUser }) {
  const [theme, styleVariables] = useTheme();
  return (
    <View id="header" style={theme.header}>
      {/* headerPageTitle */}
      <Text
        id="headerPageTitle"
        style={[
          styleVariables.fontSizes.header,
          styles(styleVariables).headerPageTitle,
        ]}
      >
        Profile
      </Text>
      {/* buildingInfo */}
      <Pressable
        id="buildingInfo"
        /* Navigates to the Building info screen */
        onPress={() => {
          navigation.navigate("BuildingInfo");
        }}
        style={styles(styleVariables).buildingInfo}
      >
        <Text
          style={[
            styleVariables.fontSizes.body,
            styles(styleVariables).textColor,
          ]}
        >
          {currentUser.buildingAddress}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.white}
        />
      </Pressable>
    </View>
  );
}

const styles = (styleVariables) =>
  StyleSheet.create({
    headerPageTitle: {
      color: styleVariables.colors.white,
      marginBottom: 4,
    },
    buildingInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      opacity: 0.66,
    },
    textColor: { color: styleVariables.colors.white },
  });

export default ProfileHeader;
