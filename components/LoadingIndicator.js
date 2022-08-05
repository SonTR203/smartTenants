import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import ProgressCircleSnail from "react-native-progress/CircleSnail";
import { useTheme } from "../ThemeContext";

function LoadingIndicator({ visible }) {
  const { styleVariables } = useTheme();
  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loaderContainer: {
      width: 64,
      height: 64,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      ...styleVariables.shadow,
    },
  });
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modal}>
        <View style={styles.loaderContainer}>
          <ProgressCircleSnail
            animating={true}
            strokeCap="square"
            thickness={4}
            size={34}
            color={"rgba(57, 94, 102, 1)"}
          />
        </View>
      </View>
    </Modal>
  );
}

export default LoadingIndicator;
