import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "../../../ThemeContext";
import { constants } from "../../../utils/constants";

function MarketplaceFirstItem({ item, navigation, own, sold }) {
  const { theme, styleVariables } = useTheme();

  const styles = StyleSheet.create({
    container: { marginTop: 17, marginLeft: 17, marginRight: 17 },
    image: {
      resizeMode: "cover",
      marginBottom: 17,
      height: constants.height * 0.25,
      backgroundColor: "black",
      borderTopRightRadius: 17,
      borderTopLeftRadius: 17,
    },
    titleContainer: {
      flex: 1,
      marginLeft: 17,
      marginRight: 17,
      marginBottom: 11,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      flex: 1,
      fontSize: 28,
      fontWeight: "600",
      lineHeight: 33,
      color: "#191919",
    },
    price: {
      color: "#395E66",
      fontSize: 22,
      fontWeight: "400",
      lineHeight: 26,
    },
    contentContainer: {
      marginLeft: 17,
      marginRight: 17,
      marginBottom: 8,
    },
    content: {
      color: "#191919",
      opacity: 0.66,
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 20,
    },
  });

  if (!item) {
    return null;
  }

  return (
    // CONTAINER
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MarketplaceItemInfo", {
          title: item.userFirstName,
          item: item,
        })
      }
      style={[theme.marketplaceItemContainer, styles.container]}
    >
      {/* ITEM IMAGE  */}
      <Image style={styles.image} source={{ uri: item.images[0] }} />
      {/* IMAGE TITLE & PRICE  */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
          {item.postTitle}
        </Text>
        <Text style={styles.price}>
          {item.price === 0 ? "Free" : item.price}
        </Text>
      </View>
      {/* ITEM CONTENT  */}
      <View style={styles.contentContainer}>
        <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>
          {item.postContent}
        </Text>
      </View>
      {own || sold ? (
        <TouchableOpacity
          style={{
            margin: 16,
            padding: 8,
            borderRadius: 8,
            backgroundColor: styleVariables.colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 17,
              lineHeight: 22,
              fontWeight: "400",
              fontFamily: "Roboto_400Regular",
            }}
            numberOfLines={2}
            ellipsizeMode={"tail"}
          >
            {sold ? "List again" : "Mark as sold"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

export default MarketplaceFirstItem;
