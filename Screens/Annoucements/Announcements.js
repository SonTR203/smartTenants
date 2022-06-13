import React from "react";
import { View, Text } from "react-native";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function Announcements() {
  return (
    <View>
      <Text>Annonucements</Text>
    </View>
  );
}

export default Announcements;
