//https://www.youtube.com/watch?v=aSOsfpsMriI

import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase-config";

const colRef = collection(db, "Buildings");
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ModalPicker = (props) => {
  const [buildings, setBuildings] = useState([]);
  const onPressItem = (building) => {
    props.changeModalVisibility(false);
    props.setData(building);
  };

  useEffect(() => {
    getBuildings();
  }, []);

  const getBuildings = async () => {
    const data = await getDocs(colRef);
    setBuildings(
      data.docs.map((item) => ({
        ...item._document.data.value.mapValue.fields,
        id: item._key.path.segments[6],
      }))
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          marginBottom: -10,
        }}
        onPress={() => props.changeModalVisibility(false)}
        activeOpacity={1}
      />
      <View
        style={{
          backgroundColor: "white",
          height: height * 0.85,
          alignItems: "center",
          borderRadius: 5,

          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <FlatList
          data={buildings}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  width: width - 34 - 34,
                  margin: 17,
                  display: "flex",
                  justifyContent: "center",
                }}
                key={index}
                onPress={() => onPressItem(item)}
              >
                <Text>{item.buildingAddress.stringValue}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ModalPicker;
