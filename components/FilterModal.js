import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Platform,
} from "react-native";
import { useTheme } from "../ThemeContext";
import ChevronRightSVG from "./Icons/ChevronRightSVG";
import { Slider } from "@miblanchard/react-native-slider";
import { constants } from "../utils/constants";
import ModalCategoryPicker from "./ModalCategoryPicker";
import {
  format,
  getFilteredList,
} from "../utils/Marketplace/marketplace.services";

function FilterModal({
  marketplaceData,
  setFilteredItemList,
  setFilterModalVisible,
  categoryFilter,
  setCategoryFilter,
  conditionFilter,
  setConditionFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  distance,
  setDistance,
  listingAmount,
  setListingAmount,
  setFilterActive,
}) {
  const [inputFocus, setInputFocus] = useState({
    min: false,
    max: false,
  });
  const { styleVariables, theme } = useTheme();
  const slideInOut = useRef(new Animated.Value(constants.width)).current;

  useEffect(() => {
    if (
      categoryFilter != "All" ||
      conditionFilter != "All" ||
      minPrice != "" ||
      maxPrice != "" ||
      distance != "100"
    ) {
      const filteredList = getFilteredList(
        marketplaceData,
        categoryFilter,
        conditionFilter,
        minPrice,
        maxPrice,
        distance
      );
      setListingAmount(filteredList.length);
    } else {
      setListingAmount("all");
    }
  }, [categoryFilter, conditionFilter, minPrice, maxPrice, distance]);

  const slideIn = () => {
    Animated.timing(slideInOut, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const slideOut = () => {
    Animated.timing(slideInOut, {
      toValue: constants.width,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const resetFilters = () => {
    setCategoryFilter("All");
    setConditionFilter("All");
    setMaxPrice("");
    setMinPrice("");
    setDistance("100");
    setFilteredItemList(marketplaceData);
    setFilterActive(false);
  };

  const applyFilters = () => {
    if (
      categoryFilter != "All" ||
      conditionFilter != "All" ||
      maxPrice != "" ||
      minPrice != ""
      // || distance != 100
    ) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
    const filteredList = getFilteredList(
      marketplaceData,
      categoryFilter,
      conditionFilter,
      minPrice,
      maxPrice,
      distance
    );
    setFilteredItemList(filteredList);
    setFilterModalVisible(false);
  };

  const styles = StyleSheet.create({
    modalContainer: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 24,
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
      borderWidth: 1.5,
      borderColor: "#CDD7D9",
      borderRadius: 8,
      paddingVertical: 12,
      marginTop: 8,
      color: styleVariables.colors.primary,
    },
    marginRight: {
      marginRight: 16,
    },
    marginLeft: {
      marginLeft: 16,
    },
    sectionTitle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    listingButton: {
      paddingTop: 40,
      justifyContent: "flex-end",
    },
    categoryList: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: [{ translateX: slideInOut }],
      backgroundColor: "#fff",
    },
    focusedInput: {
      borderColor: styleVariables.colors.primary,
    },
    distanceText: {
      color: "#395E66",
      fontSize: 15,
      lineHeight: 20,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? -100 : -300}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        style={styles.modalContainer}>
        <View>
          <View style={styles.filterSection}>
            <Text
              style={[
                styleVariables.fontSizes.title,
                { color: styleVariables.colors.black },
              ]}>
              Filters
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text
                style={[styleVariables.fontSizes.bodyBold, styles.primaryClr]}>
                Reset all
              </Text>
            </TouchableOpacity>
          </View>
          {/* CATEGORY SELECTION */}
          <TouchableOpacity onPress={slideIn} style={[styles.filterSection]}>
            <View>
              <Text
                style={[
                  styleVariables.fontSizes.bodyBold,
                  { color: styleVariables.colors.black },
                ]}>
                Category
              </Text>
              <Text style={[styleVariables.fontSizes.body, styles.primaryClr]}>
                {categoryFilter}
              </Text>
            </View>
            <ChevronRightSVG />
          </TouchableOpacity>
          {/* CONDITION SELECTION */}
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black },
            ]}>
            Condition
          </Text>
          <View style={[styles.conditions]}>
            <TouchableOpacity
              onPress={() => {
                setConditionFilter("All");
              }}
              style={[
                styles.condition,
                conditionFilter == "All" && styles.conditionSelected,
              ]}>
              <Text
                style={[
                  styleVariables.fontSizes.body,
                  styles.primaryClr,
                  conditionFilter == "All" && styles.textWhite,
                ]}>
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
              ]}>
              <Text
                style={[
                  styleVariables.fontSizes.body,
                  styles.primaryClr,
                  conditionFilter == "New" && styles.textWhite,
                ]}>
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
              ]}>
              <Text
                style={[
                  styleVariables.fontSizes.body,
                  styles.primaryClr,
                  conditionFilter == "Used" && styles.textWhite,
                ]}>
                Used
              </Text>
            </TouchableOpacity>
          </View>
          {/* PRICE FILTER */}
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black },
            ]}>
            Price
          </Text>
          <View style={styles.filterSection}>
            <TextInput
              onFocus={() =>
                setInputFocus({
                  min: true,
                  max: false,
                })
              }
              onBlur={() =>
                setInputFocus({
                  min: false,
                  max: false,
                })
              }
              onChangeText={setMinPrice}
              onEndEditing={(e) => {
                if (e.nativeEvent.text.length > 0) {
                  const price = e.nativeEvent.text.replace(/[^0-9]/g, "");
                  setMinPrice(format(price));
                }
              }}
              value={minPrice}
              keyboardType={"decimal-pad"}
              style={[
                styles.input,
                styles.marginRight,
                inputFocus.min ? styles.focusedInput : {},
              ]}
              placeholder={"$ Min"}
              placeholderTextColor={styleVariables.colors.primary}
            />
            <TextInput
              onFocus={() =>
                setInputFocus({
                  min: false,
                  max: true,
                })
              }
              onBlur={() =>
                setInputFocus({
                  min: false,
                  max: false,
                })
              }
              onChangeText={setMaxPrice}
              onEndEditing={(e) => {
                if (e.nativeEvent.text.length > 0) {
                  const price = e.nativeEvent.text.replace(/[^0-9]/g, "");
                  setMaxPrice(format(price));
                }
              }}
              value={maxPrice}
              keyboardType={"decimal-pad"}
              style={[
                styles.input,
                styles.marginLeft,
                inputFocus.max ? styles.focusedInput : {},
              ]}
              placeholder={"$ Max"}
              placeholderTextColor={styleVariables.colors.primary}
            />
          </View>
          <View style={styles.sectionTitle}>
            <Text
              style={[
                styleVariables.fontSizes.bodyBold,
                { color: styleVariables.colors.black },
              ]}>
              Distance
            </Text>
            <Text style={styles.distanceText}>{distance + "km"}</Text>
          </View>
          <Slider
            value={distance}
            onSlidingComplete={(value) => {
              setDistance(Math.round(value));
            }}
            minimumValue={0}
            maximumValue={100}
            maximumTrackTintColor={styleVariables.colors.primary14}
            minimumTrackTintColor={styleVariables.colors.primary}
            thumbTintColor={styleVariables.colors.primary}
          />
          {/* CATEGORY LIST */}
          <Animated.View style={styles.categoryList}>
            <ModalCategoryPicker
              styleVariables={styleVariables}
              theme={theme}
              closeCategory={slideOut}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              isFilterModal={true}
            />
          </Animated.View>
        </View>

        <View style={styles.listingButton}>
          <TouchableOpacity onPress={applyFilters} style={theme.primaryButton}>
            <Text
              style={[
                theme.primaryButtonText,
                styleVariables.fontSizes.bodyBold,
              ]}>
              See {listingAmount} listings
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default FilterModal;
