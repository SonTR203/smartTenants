import React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "../ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

function ScreenHeader({ title }) {
  const { theme, styleVariables } = useTheme();
  const styles = StyleSheet.create({
    headerPageTitle: {
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
    </SafeAreaView>
  );
}

export default ScreenHeader;
