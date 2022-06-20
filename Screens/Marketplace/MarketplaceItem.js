import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../../ThemeContext";
import { constants } from "../../utils/constants";
import { navigateToMarketplaceItemScreen } from "../../utils/Marketplace/marketplace.services";

function MarketplaceItem({ item, index, navigation }) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      marginRight: 17,
      marginLeft: index % 2 === 0 ? 17 : 0,
      flex: 0.5,
    },
    image: {
      resizeMode: "cover",
      marginBottom: 17,
      height: constants.height * 0.2,
      backgroundColor: "black",
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24,
    },
    titleContainer: {
      flex: 1,
      marginLeft: 17,
      marginRight: 17,
      marginBottom: 11,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    title: {
      flex: 1,
      fontSize: 17,
      fontWeight: "600",
      lineHeight: 20,
      color: "#191919",
    },
    price: {
      color: "#395E66",
      marginTop: 6,
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 20,
    },
    contentContainer: {
      marginLeft: 17,
      marginRight: 17,
      marginBottom: 22,
    },
    content: {
      color: "#191919",
      opacity: 0.66,
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 18,
    },
  });
  return (
    // CONTAINER
    <TouchableOpacity
      onPress={() => navigateToMarketplaceItemScreen(navigation, item)}
      style={[theme.marketplaceItemContainer, styles.container]}
    >
      {/* ITEM IMAGE  */}
      <Image style={styles.image} source={{ uri: item.images[0] }} />
      {/* ITEM TITLE & PRICE */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
          {item.postTitle}
        </Text>
        <Text style={styles.price}>
          {item.price === 0 ? "Free" : "$" + item.price}
        </Text>
      </View>
      {/* ITEM CONTENT */}
      <View style={styles.contentContainer}>
        <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>
          {item.postContent}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default MarketplaceItem;
