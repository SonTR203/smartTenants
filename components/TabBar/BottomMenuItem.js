import React from "react";
import { View } from "react-native";
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
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name={newIconName} size={28} color={color} />
      <NotificationBadge screen={`${label}Navigator`} />
    </View>
  );
};
