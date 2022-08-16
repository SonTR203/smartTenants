import React from "react";
import { View, Text, StyleSheet } from "react-native";

function FilterModal() {
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.6,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 24,
      paddingBottom: 34,
      backgroundColor: "#fff",
    },
  });

  return (
    <View style={styles.modalContainer}>
      <Text>Filter modal</Text>
    </View>
  );
}

export default FilterModal;
