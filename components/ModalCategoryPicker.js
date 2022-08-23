import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import ChevronRightSVG from "../components/Icons/ChevronRightSVG";
import CategoryIconSVG from "../components/Icons/CategoryIconSVG";
import ChevronLeftSVG from "../components/Icons/ChevronLeftSVG";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { categories, constants } from "../utils/constants";

function ModalCategoryPicker({
  theme,
  styleVariables,
  setCategoryModalVisible,
  setCategory,
  categoryFilter,
  setCategoryFilter,
  closeCategory,
  isFilterModal,
}) {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const slideInOut = useRef(new Animated.Value(constants.width)).current;

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

  const CategoryItem = ({ category, subCategories }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        if (category == "Free Goods") {
          if (isFilterModal) {
            setCategoryFilter(category);
            closeCategory();
          } else {
            setCategory(category);
            setCategoryModalVisible(false);
          }
        } else {
          setSubCategories(subCategories);
          setCategoryTitle(category);
          slideIn();
        }
      }}
    >
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
    <CategoryItem category={item.category} subCategories={item.subCategories} />
  );

  const SubCategoryItem = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        !isFilterModal && category == "All" ? { display: "none" } : {},
      ]}
      onPress={() => {
        if (isFilterModal) {
          setCategoryFilter(`${categoryTitle} - ${category}`);
        } else {
          setCategory(`${categoryTitle} - ${category}`);
        }
        if (!isFilterModal) {
          setCategoryModalVisible(false);
        }
      }}
    >
      <Text style={[styleVariables.fontSizes.body]}>{category}</Text>
      {isFilterModal && (
        <BouncyCheckbox
          size={28}
          fillColor={styleVariables.colors.primary}
          iconStyle={{
            width: 20,
            height: 20,
            borderColor: styleVariables.colors.primary,
          }}
          iconComponent={<View></View>}
          style={styles.subCategoryCheckbox}
          disableText={true}
          disableBuiltInState={true}
          isChecked={categoryFilter == `${categoryTitle} - ${category}`}
          onPress={() => {
            setCategoryFilter(category);
          }}
        />
      )}
    </TouchableOpacity>
  );

  const renderSubCategoryItem = ({ item }) => (
    <SubCategoryItem category={item.category} />
  );

  const styles = StyleSheet.create({
    modalContainer: {
      flex: isFilterModal ? 1 : 0.6,
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "column",
      paddingHorizontal: isFilterModal ? 0 : 24,
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
    subCategoryContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: [{ translateX: slideInOut }],
      backgroundColor: "#fff",
    },
    subCategoryHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: isFilterModal ? 0 : 24,
    },
    subCategoryTitle: {
      color: "#4d4d4d",
      marginLeft: 10,
    },
    title: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    marginLeft: {
      marginLeft: 16,
    },
    primaryClr: {
      color: styleVariables.colors.primary,
    },
    filterCheckbox: {
      marginTop: 34,
      marginRight: 4,
      paddingBottom: 5,
    },
    subCategoryCheckbox: {
      marginRight: 4,
    },
  });
  return (
    <View style={styles.modalContainer}>
      <View style={styles.categoryList}>
        {isFilterModal && (
          <View>
            <View style={styles.title}>
              <TouchableOpacity onPress={closeCategory} style={styles.title}>
                <ChevronLeftSVG />
                <Text
                  style={[styleVariables.fontSizes.title, styles.marginLeft]}
                >
                  Category
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCategoryFilter("All");
                }}
              >
                <Text
                  style={[styleVariables.fontSizes.bodyBold, styles.primaryClr]}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.title, styles.filterCheckbox]}>
              <Text style={styleVariables.fontSizes.body}>All</Text>
              <BouncyCheckbox
                size={28}
                fillColor={styleVariables.colors.primary}
                iconStyle={{
                  width: 20,
                  height: 20,
                  borderColor: styleVariables.colors.primary,
                }}
                iconComponent={<View></View>}
                disableText={true}
                disableBuiltInState={true}
                isChecked={categoryFilter == "All"}
                onPress={() => {
                  setCategoryFilter("All");
                }}
              />
            </View>
          </View>
        )}
        <FlatList data={categories} renderItem={renderCategoryItem} />
        <Animated.View style={styles.subCategoryContainer}>
          <TouchableOpacity style={styles.subCategoryHeader} onPress={slideOut}>
            <ChevronLeftSVG />
            <Text
              style={[styleVariables.fontSizes.title, styles.subCategoryTitle]}
            >
              {categoryTitle}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={subCategories}
            renderItem={renderSubCategoryItem}
            contentContainerStyle={{ paddingBottom: isFilterModal && 4 }}
          />
        </Animated.View>
      </View>
      {!isFilterModal && (
        <TouchableOpacity
          style={[theme.secondaryButton, styles.closeBtn]}
          onPress={() => setCategoryModalVisible(false)}
        >
          <Text style={[styleVariables.fontSizes.bodyBold, styles.btnText]}>
            Close
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ModalCategoryPicker;
