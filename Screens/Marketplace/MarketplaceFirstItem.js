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

function MarketplaceFirstItem({ item, index }) {
  console.log("first item: ", item);
  const { theme, styleVariables } = useTheme();
  return (
    <View style={[theme.marketplaceItemContainer, { marginTop: 17 }]}>
      <Image
        style={{
          resizeMode: "center",
          marginBottom: 17,
          height: Dimensions.get("window").height * 0.35,
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
          ${item.price}
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
    </View>
  );
}

export default MarketplaceFirstItem;
