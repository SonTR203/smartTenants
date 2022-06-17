import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { navigateToMarketplaceItemScreen } from "../../utils/Marketplace/marketplace.services";

function MarketplaceItem({ item, index, navigation }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigateToMarketplaceItemScreen(navigation, item)}
      style={[
        theme.marketplaceItemContainer,
        {
          marginRight: 17,
          marginLeft: index % 2 === 0 ? 17 : 0,
          flex: 0.5,
        },
      ]}
    >
      <Image
        style={{
          resizeMode: "cover",
          marginBottom: 17,
          height: Dimensions.get("window").height * 0.2,
          backgroundColor: "black",
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
        }}
        source={{ uri: item.images[0] }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 17,
          marginRight: 17,
          marginBottom: 11,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: "600",
            lineHeight: 20,
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
            marginTop: 6,
            fontSize: 17,
            fontWeight: "400",
            lineHeight: 20,
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
            fontSize: 15,
            fontWeight: "400",
            lineHeight: 18,
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

export default MarketplaceItem;
