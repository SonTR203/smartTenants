//https://www.youtube.com/watch?v=aSOsfpsMriI

import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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

  const building = buildings.map((item, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => onPressItem(item)}>
        <Text>{item.buildingAddress.stringValue}</Text>
      </TouchableOpacity>
    );
  });

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
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00000066",
        width: width,
        height: height,
        paddingBottom: 45,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: width - 34,
          borderRadius: 4,
        }}
      >
        <ScrollView>
          {building &&
            building.map(function (item, index) {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: "white",
                    width: width - 34 - 34,
                    margin: 17,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 1 }}>{item}</Text>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default ModalPicker;
