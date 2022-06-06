import React from "react";
import { StyleSheet, View, Text } from "react-native";

function ListFooter({ styleVariables }) {
  const styles = StyleSheet.create({
    container: {
      height: 102,
      paddingVertical: 17,
      paddingHorizontal: 34,
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    callOut: {
      color: styleVariables.colors.black,
      opacity: 0.66,
      paddingBottom: 17,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styleVariables.fontSizes.callout, styles.callOut]}>
        You&apos;ve reached the end
      </Text>
    </View>
  );
}

export default ListFooter;
