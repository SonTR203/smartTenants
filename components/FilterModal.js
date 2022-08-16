import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import ChevronRightSVG from "./Icons/ChevronRightSVG";

function FilterModal() {
  const [categoryFilter, setCategoryFilter] = useState("All");
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
      alignItems: "center",
      marginBottom: 32,
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
      <TouchableOpacity style={[styles.filterSection]}>
        <View>
          <Text style={[styleVariables.fontSizes.bodyBold]}>Category</Text>
          <Text style={[styleVariables.fontSizes.body, styles.primaryClr]}>
            {categoryFilter}
          </Text>
        </View>
        <ChevronRightSVG />
      </TouchableOpacity>
    </View>
  );
}

export default FilterModal;
