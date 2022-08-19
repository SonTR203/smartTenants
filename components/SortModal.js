import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SortModal() {
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.6,
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "column",
      paddingTop: 24,
      paddingHorizontal: 24,
    },
  });
  return (
    <View style={styles.modalContainer}>
      <Text>Sort Modal</Text>
    </View>
  );
}

export default SortModal;
