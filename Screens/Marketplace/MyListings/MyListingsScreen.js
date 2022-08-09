import React, { useState } from "react";
import { View, Text } from "react-native";
import ScreenSelector from "./ScreenSelector";

function MyListingsScreen() {
  const [available, setAvailable] = useState(true);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScreenSelector available={available} setAvailable={setAvailable} />
      {available ? <Text>Available</Text> : <Text>Sold</Text>}
    </View>
  );
}

export default MyListingsScreen;
