import React from "react";
import { View, Text } from "react-native";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function Notices() {
  return (
    <View>
      <Text>Notices Screen</Text>
    </View>
  );
}

export default Notices;
