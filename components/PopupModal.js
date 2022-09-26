import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../ThemeContext";
import React from "react";
import SuccessIcon from "../components/Icons/SuccessIcon";
import WarningIcon from "../components/Icons/WarningIcon";
import ErrorIcon from "../components/Icons/ErrorIcon";

const PopupModal = ({ modalType, message }) => {
  const { theme, styleVariables } = useTheme();
  let primaryColor;
  let mainIcon;
  switch (modalType) {
    case "success":
      primaryColor = "#23CE6B";
      mainIcon = <SuccessIcon />;
      break;
    case "error":
      primaryColor = "#AB0728";
      mainIcon = <ErrorIcon />;
      break;
    case "warning":
      primaryColor = "#F26419";
      mainIcon = <WarningIcon />;
      break;
  }
  return (
    <View>
      {mainIcon}
      <Text>{message}</Text>
    </View>
  );
};

export default PopupModal;
