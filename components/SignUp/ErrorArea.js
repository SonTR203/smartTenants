import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

function ErrorArea({ errorText }) {
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
    backgroundColor: "rgba(255, 66, 66, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 8,

    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 10,
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 19,
    color: "#FF4242",
  },
});

export default ErrorArea;
