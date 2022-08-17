import React from "react";
import { StyleSheet, View, Text } from "react-native";

function ListFooter({ styleVariables }) {
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    callOut: {
      color: styleVariables.colors.listFooterText,
      opacity: 0.66,
      paddingBottom: 17,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styleVariables.fontSizes.callout, styles.callOut]}>
        There are no more notifications :)
      </Text>
    </View>
  );
}

export default ListFooter;
