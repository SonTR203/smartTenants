import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";

function FilterModal() {
  const { styleVariables, theme } = useTheme();

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.6,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 24,
      paddingBottom: 34,
      backgroundColor: "#fff",
    },
    filterSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    primaryClr: {
      color: styleVariables.colors.primary,
    },
  });

  return (
    <View style={styles.modalContainer}>
      <View style={styles.filterSection}>
        <Text style={[styleVariables.fontSizes.title]}>Filters</Text>
        <TouchableOpacity>
          <Text style={[styleVariables.fontSizes.bodyBold, styles.primaryClr]}>
            Reset all
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FilterModal;
