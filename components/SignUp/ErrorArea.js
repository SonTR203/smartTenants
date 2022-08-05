import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

function ErrorArea({ errorText }) {
  if (errorText.length < 1) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={20} color="rgba(255, 66, 66, 1)" />
      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: "hsla(348, 92%, 35%, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 8,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 10,
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 19,
    color: "#AB0728",
  },
});

export default ErrorArea;
