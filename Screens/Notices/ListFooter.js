import React from "react";
import { StyleSheet, View, Text } from "react-native";

function ListFooter({ styleVariables }) {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    callOut: {
      color: styleVariables.colors.listFooterText,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styleVariables.fontSizes.callout, styles.callOut]}>
        There are no more notices :)
      </Text>
    </View>
  );
}

export default ListFooter;
