import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useAppContext } from "../Context/AppContext";

function NotificationBadge({ screen }) {
  const { notificationBadges, marketplaceBadges, announcements, notices } =
    useAppContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (screen) {
      switch (screen) {
        case "MarketplaceNavigator":
          setCount(marketplaceBadges.unseen.length);
          break;
        case "NotificationsNavigator":
          setCount(
            notificationBadges.unseen.length +
              announcements.count +
              notices.count
          );
          break;
      }
    }
  }, [notificationBadges, marketplaceBadges, announcements, notices]);

  if (count < 1) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: "rgba(232, 72, 85, 1)",
        position: "absolute",
        left: 45,
        top: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          fontWeight: "400",
          fontSize: 11,
          lineHeight: 13,
          color: "white",
        }}
      >
        {count}
      </Text>
    </View>
  );
}

export default NotificationBadge;
