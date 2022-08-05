import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import ProgressCircleSnail from "react-native-progress/CircleSnail";
import { useTheme } from "../ThemeContext";

function FlatListRefreshControl({ refreshing }) {
  const { styleVariables } = useTheme();
  const styles = StyleSheet.create({
    loaderContainer: {
      display: refreshing ? "flex" : "none",
      width: "100%",
      height: 64,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      position: "absolute",
      top: 4,
      left: 0,
      right: 0,
    },
  });

  return (
    <View style={styles.loaderContainer}>
      <ProgressCircleSnail
        hidesWhenStopped={true}
        animating={true}
        strokeCap="square"
        thickness={4}
        size={34}
        color={styleVariables.colors.primary}
      />
    </View>
  );
}

export default memo(FlatListRefreshControl);
