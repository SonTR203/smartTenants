import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "../../../ThemeContext";
import { useAppContext } from "../../../Context/AppContext";
import { constants } from "../../../utils/constants";
import SaveIcon from "../../../components/SaveIcon/SaveIcon";
import { LinearGradient } from "expo-linear-gradient";

function MarketplaceFirstItem({
  item,
  navigation,
  own,
  sold,
  handleOpenSoldModal,
  saved,
  handleUnSaved,
  isPopular = false,
}) {
  const { theme, styleVariables } = useTheme();
  const { setCurrentMarketplacePost } = useAppContext();
  const styles = StyleSheet.create({
    container: {
      marginTop: 17,
      marginLeft: 17,
      marginRight: 17,
    },
    image: {
      resizeMode: "cover",
      marginBottom: 17,
      height: constants.height * 0.25,
      backgroundColor: "#4d4d4d",
      borderTopRightRadius: 17,
      borderTopLeftRadius: 17,
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
      fontSize: 28,
      fontWeight: "600",
      lineHeight: 33,
      color: styleVariables.colors.black,
    },
    price: {
      color: "#395E66",
      fontSize: 22,
      fontWeight: "400",
      lineHeight: 26,
      marginTop: 8,
    },
    contentContainer: {
      marginLeft: 17,
      marginRight: 17,
      marginBottom: 16,
    },
    content: {
      color: styleVariables.colors.black,
      fontSize: 17,
      fontWeight: "400",
      lineHeight: 20,
    },
    saveIcon: {
      position: "absolute",
      top: 16,
      right: 16,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 8,
      ...styleVariables.shadow,
    },
    bottomButton: {
      margin: 16,
      marginTop: 8,
      padding: 8,
      borderRadius: 8,
      backgroundColor: styleVariables.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "400",
      fontFamily: "Roboto_400Regular",
    },
  });

  if (!item) {
    return null;
  }

  return (
    // CONTAINER
    <TouchableOpacity
      onPress={() => {
        setCurrentMarketplacePost(item);
        navigation.navigate("MarketplaceItemInfo", {
          title: item.userFirstName,
          itemUserId: item.userID,
          item: item,
        });
      }}
      style={[theme.marketplaceItemContainer, styles.container]}
    >
      {/* ITEM IMAGE  */}

      <Image style={styles.image} source={{ uri: item.images[0] }} />
      <LinearGradient
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 17,
          borderBottomEndRadius: 0,
          borderBottomStartRadius: 0,

          width: "100%",
          height: constants.height * 0.25,
        }}
        colors={["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0)"]}
      />
      {saved && (
        <SaveIcon
          isSaved={true}
          onPress={handleUnSaved}
          style={styles.saveIcon}
          size={30}
        />
      )}
      {isPopular && (
        <View
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 8,
            ...styleVariables.shadow,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              lineHeight: 20,
              color: styleVariables.colors.popularOrange,
              textAlign: "center",
            }}
          >
            Popular 🔥️
          </Text>
        </View>
      )}

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
          onPress={() => handleOpenSoldModal(item)}
          style={styles.bottomButton}
        >
          <Text
            style={styles.buttonText}
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
