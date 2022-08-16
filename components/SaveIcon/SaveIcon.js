import React from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";

function SaveIcon({ size, onPress, style, isSaved }) {
  const { styleVariables } = useTheme();
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <AntDesign
        name={isSaved ? "heart" : "hearto"}
        size={size}
        color={styleVariables.colors.primary}
      />
    </TouchableOpacity>
  );
}

export default SaveIcon;
