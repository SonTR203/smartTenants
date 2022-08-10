import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../ThemeContext";

function ScreenSelector({ setAvailable, available }) {
  const { styleVariables } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        style={{
          marginLeft: 16,
          borderBottomColor: available
            ? styleVariables.colors.primary
            : "transparent",
          borderBottomWidth: 4,

          padding: 10,
          flex: 0.5,
        }}
        onPress={() => setAvailable(true)}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: "500",
            fontFamily: !available ? "Roboto_400Regular" : "Roboto_500Medium",
            color: styleVariables.colors.primary,
          }}
        >
          Available
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginRight: 16,
          borderBottomColor: !available
            ? styleVariables.colors.primary
            : "transparent",
          borderBottomWidth: 4,

          padding: 10,
          flex: 0.5,
        }}
        onPress={() => setAvailable(false)}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: "500",
            fontFamily: available ? "Roboto_400Regular" : "Roboto_500Medium",
            color: styleVariables.colors.primary,
          }}
        >
          Sold
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ScreenSelector;
