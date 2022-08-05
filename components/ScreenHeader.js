import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useTheme } from "../ThemeContext";

function ScreenHeader({ title }) {
  const { theme, styleVariables } = useTheme();
  const styles = StyleSheet.create({
    headerPageTitle: {
      color: styleVariables.colors.white,
    },
  });

  return (
    <View id="header" style={theme.header}>
      {/* headerPageTitle */}
      <Text style={[styleVariables.fontSizes.header, styles.headerPageTitle]}>
        {title}
      </Text>
    </View>
  );
}

export default ScreenHeader;
