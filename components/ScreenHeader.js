import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../ThemeContext";
import { useAppContext } from "../Context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

function ScreenHeader({ title }) {
  const navigation = useNavigation();
  const { theme, styleVariables } = useTheme();
  const { currentUser } = useAppContext();
  const styles = StyleSheet.create({
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
    buildingAddress: {
      color: styleVariables.colors.white,
    },
  });

  return (
    <SafeAreaView id="header" style={theme.header}>
      {/* headerPageTitle */}
      <Text
        id="headerPageTitle"
        style={[styleVariables.fontSizes.header, styles.headerPageTitle]}
      >
        {title}
      </Text>

      <Pressable
        id="buildingInfo"
        onPress={() => {
          navigation.navigate("BuildingInfo");
        }}
        style={styles.buildingInfo}
      >
        <Text style={[styleVariables.fontSizes.body, styles.buildingAddress]}>
          {currentUser.buildingAddress}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.white}
        />
      </Pressable>
    </SafeAreaView>
  );
}

export default ScreenHeader;
