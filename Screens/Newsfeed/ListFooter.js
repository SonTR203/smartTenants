import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

function ListFooter({ styleVariables, isMarketplace }) {
  const styles = StyleSheet.create({
    footerContainer: {
      height: 204,
      paddingVertical: 17,
      paddingHorizontal: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    footerMessage: {
      color: styleVariables.colors.black,
      opacity: 0.66,
      paddingBottom: 8,
    },
  });

  return (
    <View style={styles.footerContainer}>
      <Text style={[styleVariables.fontSizes.callout, styles.footerMessage]}>
        Oh oh! Seems like you&apos;ve reached the end.
      </Text>
      <Text style={[styleVariables.fontSizes.callout, styles.footerMessage]}>
        Refresh at the top for new {isMarketplace ? "listings!" : "posts!"}
      </Text>
    </View>
  );
}

export default memo(ListFooter);
