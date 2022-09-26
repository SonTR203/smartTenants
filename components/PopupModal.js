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
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: primaryColor,
      width: "90%",
      borderRadius: 8,
      flex: 0.05,
      marginTop: "auto",
      marginBottom: 100,
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      shadowRadius: "16, 16, 0, 0",
    },
    subContainer: {
      width: "99%",
      backgroundColor: "#fff",
      borderRadius: 8,
    },
  });
  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        {mainIcon}
        <Text>{message}</Text>
      </View>
    </View>
  );
};

export default PopupModal;
