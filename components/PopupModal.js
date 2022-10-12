import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import React from "react";
import SuccessIcon from "../components/Icons/SuccessIcon";
import WarningIcon from "../components/Icons/WarningIcon";
import ErrorIcon from "../components/Icons/ErrorIcon";

const PopupModal = ({ modalType, message, hideModal }) => {
  const { styleVariables } = useTheme();
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
      // height: message?.length > 40 ? "10%" : 56,
      height: 56,
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
      width: "98.7%",
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      display: "flex",
      flexDirection: "row",
      height: "100%",
      alignItems: "center",
    },
    message: {
      color: primaryColor,
      flex: 1,
      marginLeft: 8,
    },
  });
  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        style={{ width: "100%", height: "100%" }}
        onPress={() => hideModal()}></TouchableOpacity>
      <View style={[styleVariables.shadow, styles.mainContainer]}>
        <View style={styles.subContainer}>
          {mainIcon}
          <Text style={[styleVariables.fontSizes.callout, styles.message]}>
            {message}
          </Text>
        </View>
      </View>
    </>
  );
};

export default PopupModal;
