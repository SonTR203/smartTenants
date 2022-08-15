import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ChevronRightSVG from "../components/Icons/ChevronRightSVG";
import CategoryIconSVG from "../components/Icons/CategoryIconSVG";

function ModalCategoryPicker({
  theme,
  styleVariables,
  setCategoryModalVisible,
  setCategory,
}) {
  const categories = [
    { id: "1", category: "Clothes" },
    { id: "2", category: "Electronics" },
    { id: "3", category: "Free Goods" },
    { id: "4", category: "Health & beaty" },
    { id: "5", category: "Hobbies & sports" },
    { id: "6", category: "Home" },
    { id: "7", category: "Kids" },
    { id: "8", category: "Office goods" },
    { id: "9", category: "Outdoor & garden" },
    { id: "10", category: "Pets" },
    { id: "11", category: "Toys & games" },
    { id: "12", category: "Vehicles" },
  ];

  const CategoryItem = ({ category }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryTitle}>
        <CategoryIconSVG category={category} />
        <Text style={[styleVariables.fontSizes.body, styles.categoryText]}>
          {category}
        </Text>
      </View>
      <ChevronRightSVG />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <CategoryItem category={item.category} />
  );

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.6,
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "column",
      paddingHorizontal: 24,
    },
    closeBtn: {
      borderColor: styleVariables.colors.primary,
      marginTop: 24,
      marginBottom: 34,
    },
    btnText: {
      color: styleVariables.colors.primary,
    },
    categoryList: {
      flex: 1,
    },
    categoryItem: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 34,
    },
    categoryTitle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    categoryText: {
      marginLeft: 10,
    },
  });
  return (
    <View style={styles.modalContainer}>
      <View style={styles.categoryList}>
        <FlatList data={categories} renderItem={renderCategoryItem} />
      </View>
      <TouchableOpacity
        style={[theme.secondaryButton, styles.closeBtn]}
        onPress={() => setCategoryModalVisible(false)}
      >
        <Text style={[styleVariables.fontSizes.bodyBold, styles.btnText]}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ModalCategoryPicker;
