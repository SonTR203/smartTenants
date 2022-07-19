import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../ThemeContext";

function TermsAndConditions() {
  const { theme, styleVariables } = useTheme();

  return (
    <View>
      <Text>Terms & Conditions</Text>
    </View>
  );
}

export default TermsAndConditions;
