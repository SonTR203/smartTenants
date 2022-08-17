import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../ThemeContext";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  availableSection: (available, styleVariables) => ({
    marginLeft: 16,
    borderBottomColor: available
      ? styleVariables.colors.primary
      : "transparent",
    borderBottomWidth: 4,

    padding: 10,
    flex: 0.5,
  }),
  customText: (available, styleVariables) => ({
    textAlign: "center",
    fontSize: 22,
    fontWeight: "500",
    fontFamily: !available ? "Roboto_400Regular" : "Roboto_500Medium",
    color: styleVariables.colors.primary,
  }),
});

function ScreenSelector({ setAvailable, available }) {
  const { styleVariables } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.availableSection(available, styleVariables)}
        onPress={() => setAvailable(true)}
      >
        <Text style={styles.customText(available, styleVariables)}>
          Available
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.availableSection(!available, styleVariables)}
        onPress={() => setAvailable(false)}
      >
        <Text style={styles.customText(!available, styleVariables)}>Sold</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ScreenSelector;
