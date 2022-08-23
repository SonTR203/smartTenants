import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { getSortedList } from "../utils/Marketplace/marketplace.services";

function SortModal({
  setSortModalVisible,
  marketplaceData,
  filteredItemList,
  setFilteredItemList,
  sortingBy,
  setSortingBy,
}) {
  const { styleVariables, theme } = useTheme();

  const applySort = () => {
    if (filteredItemList) {
      const sortedList = getSortedList(filteredItemList, sortingBy);
      setFilteredItemList(sortedList);
    } else {
      const sortedList = getSortedList(marketplaceData, sortingBy);
      setFilteredItemList(sortedList);
    }
    setSortModalVisible(false);
  };

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
    flexApart: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    primaryClr: {
      color: styleVariables.colors.primary,
    },
    sortCheckbox: {
      marginTop: 34,
    },
    listingsButton: {
      alignSelf: "center",
      position: "absolute",
      bottom: 0,
      marginBottom: 34,
    },
  });
  return (
    <View style={styles.modalContainer}>
      <View style={styles.flexApart}>
        <Text style={styleVariables.fontSizes.title}>Sort</Text>
        <TouchableOpacity
          onPress={() => {
            setSortingBy("Date(newest)");
          }}
        >
          <Text style={[styleVariables.fontSizes.bodyBold, styles.primaryClr]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          setSortingBy("Date(newest)");
        }}
        style={[styles.flexApart, styles.sortCheckbox]}
      >
        <Text style={styleVariables.fontSizes.body}>Date (newest first)</Text>
        <BouncyCheckbox
          size={28}
          fillColor={styleVariables.colors.primary}
          iconStyle={{
            width: 20,
            height: 20,
            color: styleVariables.colors.primary,
            borderColor: styleVariables.colors.primary,
          }}
          iconComponent={<View></View>}
          disableText={true}
          disableBuiltInState={true}
          isChecked={sortingBy == "Date(newest)"}
          onPress={() => {
            setSortingBy("Date(newest)");
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSortingBy("Date(oldest)");
        }}
        style={[styles.flexApart, styles.sortCheckbox]}
      >
        <Text style={styleVariables.fontSizes.body}>Date (oldest first)</Text>
        <BouncyCheckbox
          size={28}
          fillColor={styleVariables.colors.primary}
          iconStyle={{
            width: 20,
            height: 20,
            color: styleVariables.colors.primary,
            borderColor: styleVariables.colors.primary,
          }}
          iconComponent={<View></View>}
          disableText={true}
          disableBuiltInState={true}
          isChecked={sortingBy == "Date(oldest)"}
          onPress={() => {
            setSortingBy("Date(oldest)");
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSortingBy("Price(lowest)");
        }}
        style={[styles.flexApart, styles.sortCheckbox]}
      >
        <Text style={styleVariables.fontSizes.body}>Price (lowest first)</Text>
        <BouncyCheckbox
          size={28}
          fillColor={styleVariables.colors.primary}
          iconStyle={{
            width: 20,
            height: 20,
            color: styleVariables.colors.primary,
            borderColor: styleVariables.colors.primary,
          }}
          iconComponent={<View></View>}
          disableText={true}
          disableBuiltInState={true}
          isChecked={sortingBy == "Price(lowest)"}
          onPress={() => {
            setSortingBy("Price(lowest)");
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSortingBy("Price(highest)");
        }}
        style={[styles.flexApart, styles.sortCheckbox]}
      >
        <Text style={styleVariables.fontSizes.body}>Date (highest first)</Text>
        <BouncyCheckbox
          size={28}
          fillColor={styleVariables.colors.primary}
          iconStyle={{
            width: 20,
            height: 20,
            color: styleVariables.colors.primary,
            borderColor: styleVariables.colors.primary,
          }}
          iconComponent={<View></View>}
          disableText={true}
          disableBuiltInState={true}
          isChecked={sortingBy == "Price(highest)"}
          onPress={() => {
            setSortingBy("Price(highest)");
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSortingBy("Distance(closest)");
        }}
        style={[styles.flexApart, styles.sortCheckbox]}
      >
        <Text style={styleVariables.fontSizes.body}>
          Distance (closest first)
        </Text>
        <BouncyCheckbox
          size={28}
          fillColor={styleVariables.colors.primary}
          iconStyle={{
            width: 20,
            height: 20,
            color: styleVariables.colors.primary,
            borderColor: styleVariables.colors.primary,
          }}
          iconComponent={<View></View>}
          disableText={true}
          disableBuiltInState={true}
          isChecked={sortingBy == "Distance(closest)"}
          onPress={() => {
            setSortingBy("Distance(closest)");
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={applySort}
        style={[theme.primaryButton, styles.listingsButton]}
      >
        <Text
          style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
        >
          See listings
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SortModal;
