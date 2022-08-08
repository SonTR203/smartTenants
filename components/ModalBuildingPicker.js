//https://www.youtube.com/watch?v=aSOsfpsMriI

import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useCallback } from "react";
import { useTheme } from "../ThemeContext";
import BuildingIconSVG from "./Icons/BuildingIconSVG";

const ModalPicker = ({ changeModalVisibility, setData, buildings }) => {
  const { styleVariables, theme } = useTheme();
  const onPressItem = (building) => {
    changeModalVisibility(false);
    setData(building);
  };
  const callBackRender = useCallback(
    ({ item }) => renderBuildingItem({ item }),
    [[buildings]]
  );

  const renderBuildingItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          width: "90%",
          marginVertical: 17,
          display: "flex",
          flexDirection: "row",
        }}
        onPress={() => onPressItem(item)}
      >
        <BuildingIconSVG />
        <Text style={[styleVariables.fontSizes.body, { marginLeft: 20 }]}>
          {item.buildingAddress}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 0.6,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 24,
        paddingHorizontal: 24,
      }}
    >
      <View style={{ flex: 1 }}>
        <FlatList data={buildings} renderItem={callBackRender} />
      </View>
      <TouchableOpacity
        style={[
          theme.secondaryButton,
          {
            borderColor: styleVariables.colors.primary,
            marginTop: 24,
            marginBottom: 34,
          },
        ]}
        onPress={() => changeModalVisibility(false)}
      >
        <Text
          style={[
            styleVariables.fontSizes.bodyBold,
            { color: styleVariables.colors.primary },
          ]}
        >
          Close
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalPicker;
