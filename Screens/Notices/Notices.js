import { React, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

function Notices() {
  return (
    <SafeAreaView>
      <Text>Notices Screen</Text>
    </SafeAreaView>
  );
}

export default Notices;
