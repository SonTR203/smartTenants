import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAppContext } from "../../../Context/AppContext";
import { useTheme } from "../../../ThemeContext";
import { constants } from "../../../utils/constants";
import { incrementItemCLicks } from "../../../utils/Marketplace/marketplace.services.js";

function MarketplaceItem({ item, index, navigation }) {
  const { theme, styleVariables } = useTheme();
  const { setCurrentMarketplacePost } = useAppContext();
  const styles = StyleSheet.create({
    container: {
      marginRight: 17,
      marginLeft: index % 2 === 0 ? 17 : 0,
      flex: 0.5,
    },
    image: {
      resizeMode: "cover",
      marginBottom: 8,
      height: constants.height * 0.2,
      backgroundColor: "#4d4d4d",
      borderTopRightRadius: 16,
      borderTopLeftRadius: 16,
    },
    titleContainer: {
      flex: 1,
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 5,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    title: {
      flex: 1,
      fontSize: 17,
      fontWeight: "600",
      lineHeight: 20,
      color: styleVariables.colors.black,
    },
    price: {
      color: "#395E66",
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 20,
    },
    contentContainer: {
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    content: {
      color: styleVariables.colors.black,
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 18,
    },
  });

  if (!item) {
    return null;
  }

  return (
    // CONTAINER
    <TouchableOpacity
      onPress={() => {
        incrementItemCLicks(item);
        setCurrentMarketplacePost(item);
        navigation.navigate("MarketplaceItemInfo", {
          title: item.userFirstName,
          itemUserId: item.userID,
          item: item,
        });
      }}
      style={[theme.marketplaceItemContainer, styles.container]}
      activeOpacity={1}>
      {/* ITEM IMAGE  */}
      <Image style={styles.image} source={{ uri: item.images[0] }} />
      {/* ITEM TITLE & PRICE */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
          {item.postTitle}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 6,
          }}>
          <Text style={styles.price}>
            {item.price === 0 ? "Free" : item.price}
          </Text>
          {item.distance !== 0 && (
            <Text style={[styleVariables.fontSizes.callout]}>
              {item.distance.toFixed(1) < 1
                ? item.distance.toFixed(1) * 1000
                : item.distance.toFixed(1)}
              {item.distance.toFixed(1) < 1 ? "m" : "km"}
            </Text>
          )}
        </View>
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
