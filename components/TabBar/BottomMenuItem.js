import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NotificationBadge from "../NotificationBadge";

export const BottomMenuItem = ({ label, isCurrent }) => {
  let newIconName;
  let color;
  if (label === "Marketplace") {
    newIconName = "store";
    color = isCurrent ? "#395E66" : "#395E6654";
  } else if (label === "Newsfeed") {
    newIconName = "newspaper";
    color = isCurrent ? "#395E66" : "#395E6654";
  } else if (label === "Notifications") {
    newIconName = "bell";
    color = isCurrent ? "#395E66" : "#395E6654";
  } else if (label === "Profile") {
    newIconName = "account";
    color = isCurrent ? "#395E66" : "#395E6654";
  }
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={newIconName} size={30} color={color} />
      <NotificationBadge screen={`${label}Navigator`} />
      <Text style={styles.label(isCurrent)}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: (isCurrent) => ({
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Roboto_400Regular",
    color: isCurrent ? "#395E66" : "#B0BFC2",
  }),
});
