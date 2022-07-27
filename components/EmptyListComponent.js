import React from "react";
import { View, Text, StyleSheet } from "react-native";

function EmptyListComponent({ screenName }) {
  return (
    <View style={styles.container}>
      <Text>Your {screenName} is empty. Try creating a post now.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
});

export default EmptyListComponent;
