import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import ChevronRightSVG from "./Icons/ChevronRightSVG";

function FilterModal() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
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
    conditions: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 8,
    },
    condition: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: "#ebeff0",
    },
    conditionMargins: {
      marginHorizontal: 8,
    },
    conditionSelected: {
      color: styleVariables.colors.white,
      backgroundColor: styleVariables.colors.primary,
    },
    textWhite: {
      color: styleVariables.colors.white,
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
      {/* CATEGORY SELECTION */}
      <TouchableOpacity style={[styles.filterSection]}>
        <View>
          <Text style={[styleVariables.fontSizes.bodyBold]}>Category</Text>
          <Text style={[styleVariables.fontSizes.body, styles.primaryClr]}>
            {categoryFilter}
          </Text>
        </View>
        <ChevronRightSVG />
      </TouchableOpacity>
      {/* CONDITION SELECTION */}
      <Text style={styleVariables.fontSizes.bodyBold}>Condition</Text>
      <View style={[styles.conditions, conditionFilter]}>
        <TouchableOpacity
          onPress={() => {
            setConditionFilter("All");
          }}
          style={[
            styles.condition,
            conditionFilter == "All" && styles.conditionSelected,
          ]}
        >
          <Text
            style={[
              styleVariables.fontSizes.body,
              conditionFilter == "All" && styles.textWhite,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setConditionFilter("New");
          }}
          style={[
            styles.condition,
            styles.conditionMargins,
            conditionFilter == "New" && styles.conditionSelected,
          ]}
        >
          <Text
            style={[
              styleVariables.fontSizes.body,
              conditionFilter == "New" && styles.textWhite,
            ]}
          >
            New
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setConditionFilter("Used");
          }}
          style={[
            styles.condition,
            conditionFilter == "Used" && styles.conditionSelected,
          ]}
        >
          <Text
            style={[
              styleVariables.fontSizes.body,
              conditionFilter == "Used" && styles.textWhite,
            ]}
          >
            Used
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FilterModal;
