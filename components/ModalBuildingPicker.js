//https://www.youtube.com/watch?v=aSOsfpsMriI

import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase-config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ModalPicker = ({ changeModalVisibility, setData }) => {
  const [buildings, setBuildings] = useState([]);
  const { styleVariables, theme } = useTheme();
  const onPressItem = (building) => {
    changeModalVisibility(false);
    setData(building);
  };

  useEffect(() => {
    getBuildings();
  }, []);

  const callBackRender = useCallback(
    ({ item }) => renderBuildingItem({ item }),
    [[buildings]]
  );

  const renderBuildingItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          width: width - 34 - 34,
          margin: 17,
          display: "flex",
          flexDirection: "row",
        }}
        onPress={() => onPressItem(item)}
      >
        <MaterialCommunityIcons
          name={"office-building"}
          size={28}
          color={"#000000"}
        />
        <Text style={[styleVariables.fontSizes.body, { marginHorizontal: 20 }]}>
          {item.buildingAddress}
        </Text>
      </TouchableOpacity>
    );
  };

  const getBuildings = async () => {
    const colRef = collection(db, "Buildings");

    const data = await getDocs(colRef);

    const formattedData = data.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    setBuildings(formattedData);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          marginBottom: -10,
        }}
        onPress={() => changeModalVisibility(false)}
        activeOpacity={1}
      />
      <View
        style={{
          backgroundColor: "white",
          height: height * 0.85,
          alignItems: "flex-start",
          borderRadius: 5,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <FlatList data={buildings} renderItem={callBackRender} />
      </View>
    </View>
  );
};

export default ModalPicker;
