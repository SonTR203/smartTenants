import React from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Fab({ navigation, theme, styleVariables, route }) {
  return (
    <Pressable
      id="FAB"
      onPress={() => {
        navigation.navigate(route);
      }}
      style={theme.fab}
    >
      <MaterialCommunityIcons
        name="plus"
        size={24}
        color={styleVariables.colors.white}
      />
    </Pressable>
  );
}

export default Fab;
