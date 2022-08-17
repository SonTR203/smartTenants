import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTheme } from "../ThemeContext";
import ChevronRightSVG from "./Icons/ChevronRightSVG";
import { Slider } from "@miblanchard/react-native-slider";

function FilterModal() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [distance, setDistance] = useState("50");
  const [listingAmount, setListingAmount] = useState("0");
  const { styleVariables, theme } = useTheme();

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.7,
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
      marginBottom: 32,
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
    input: {
      flex: 1,
      textAlign: "center",
      borderWidth: 1,
      borderColor: styleVariables.colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      marginTop: 8,
      color: styleVariables.colors.primary,
    },
    min: {
      marginRight: 16,
    },
    max: {
      marginLeft: 16,
    },
    distanceTitle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    listingButton: {
      flex: 1,
      justifyContent: "flex-end",
      marginBottom: 34,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.filterSection}>
          <Text style={[styleVariables.fontSizes.title]}>Filters</Text>
          <TouchableOpacity>
            <Text
              style={[styleVariables.fontSizes.bodyBold, styles.primaryClr]}
            >
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
        <View style={[styles.conditions]}>
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
        <Text style={styleVariables.fontSizes.bodyBold}>Price</Text>
        <View style={styles.filterSection}>
          <TextInput
            onChangeText={setMinPrice}
            value={minPrice}
            keyboardType={"decimal-pad"}
            style={[styles.input, styles.min]}
            placeholder={"$0.00"}
            placeholderTextColor={styleVariables.colors.primary}
          />
          <TextInput
            onChangeText={setMaxPrice}
            value={maxPrice}
            keyboardType={"decimal-pad"}
            style={[styles.input, styles.max]}
            placeholder={"$0.00"}
            placeholderTextColor={styleVariables.colors.primary}
          />
        </View>
        <View style={styles.distanceTitle}>
          <Text style={styleVariables.fontSizes.bodyBold}>Distance</Text>
          <Text>{distance + "km"}</Text>
        </View>
        <Slider
          value={distance}
          onValueChange={(value) => {
            setDistance(Math.round(value));
          }}
          minimumValue={0}
          maximumValue={100}
          maximumTrackTintColor={styleVariables.colors.primary14}
          minimumTrackTintColor={styleVariables.colors.primary}
          thumbTintColor={styleVariables.colors.primary}
        />
        <View style={styles.listingButton}>
          <TouchableOpacity style={theme.primaryButton}>
            <Text
              style={[
                theme.primaryButtonText,
                styleVariables.fontSizes.bodyBold,
              ]}
            >
              See {listingAmount} listings
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default FilterModal;
