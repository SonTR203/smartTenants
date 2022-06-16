import React from "react";
import { View, Text } from "react-native";

function AnnouncementItem({ announcementContent }) {
  return (
    <View>
      <Text>{announcementContent}</Text>
    </View>
  );
}

export default AnnouncementItem;
