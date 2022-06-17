import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { navigateToMarketplaceItemScreen } from "../../utils/Marketplace/marketplace.services";

function MarketplaceFirstItem({ item, navigation }) {
  const { theme, styleVariables } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigateToMarketplaceItemScreen(navigation, item)}
      style={[
        theme.marketplaceItemContainer,
        { marginTop: 17, marginLeft: 17, marginRight: 17 },
      ]}
    >
      <Image
        style={{
          resizeMode: "cover",
          marginBottom: 17,
          height: Dimensions.get("window").height * 0.25,
          backgroundColor: "black",
          borderTopRightRadius: 17,
          borderTopLeftRadius: 17,
        }}
        source={{ uri: item.images[0] }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 17,
          marginRight: 17,
          marginBottom: 11,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 28,
            fontWeight: "600",
            lineHeight: 33,
            color: "#191919",
          }}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {item.postTitle}
        </Text>
        <Text
          style={{
            color: "#395E66",
            fontSize: 22,
            fontWeight: "400",
            lineHeight: 26,
          }}
        >
          {item.price === 0 ? "Free" : "$" + item.price}
        </Text>
      </View>
      <View
        style={{
          marginLeft: 17,
          marginRight: 17,
          marginBottom: 22,
        }}
      >
        <Text
          style={{
            color: "#191919",
            opacity: 0.66,
            fontSize: 17,
            fontWeight: "400",
            lineHeight: 20,
          }}
          numberOfLines={2}
          ellipsizeMode={"tail"}
        >
          {item.postContent}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default MarketplaceFirstItem;
