import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../ThemeContext";
import React from "react";

const PopupModal = ({ modalType, message }) => {
  const { theme, styleVariables } = useTheme();
  let primaryColor;
  let mainIcon;
  switch (modalType) {
    case "success":
      primaryColor = "#23CE6B";
      break;
    case "error":
      primaryColor = "#AB0728";
      break;
    case "warning":
      primaryColor = "#F26419";
      break;
  }
  return (
    <View>
      <Text>PopupModal</Text>
    </View>
  );
};

export default PopupModal;
