import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function ModalConditionPicker({
  setCondition,
  setConditionModalVisible,
  styleVariables,
  theme,
  condition,
}) {
  const [newChecked, setNewChecked] = useState(condition === "New");
  const [usedChecked, setUsedChecked] = useState(condition === "Used");

  const styles = StyleSheet.create({
    modalContainer: {
      // flex: 0.4,
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "column",
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    closeBtn: {
      borderColor: styleVariables.colors.primary,
      marginTop: 24,
      marginBottom: 34,
    },
    btnText: {
      color: styleVariables.colors.primary,
    },
    checkBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    checkBoxContainer: {
      paddingVertical: 10,
    },
  });
  return (
    <View style={styles.modalContainer}>
      <View style={styles.checkBoxContainer}>
        <View style={[styles.checkBox, { marginBottom: 30 }]}>
          <Text style={styleVariables.fontSizes.body}>New</Text>
          <BouncyCheckbox
            size={28}
            fillColor={styleVariables.colors.primary}
            iconStyle={{
              width: 20,
              height: 20,
              color: styleVariables.colors.primary,
              borderColor: styleVariables.colors.primary,
            }}
            iconComponent={<View></View>}
            disableText={true}
            disableBuiltInState={true}
            isChecked={newChecked}
            onPress={() => {
              if (newChecked) {
                setNewChecked(false);
              } else {
                setNewChecked(true);
                setUsedChecked(false);
              }
              setCondition("New");
              setConditionModalVisible(false);
            }}
          />
        </View>
        <View style={styles.checkBox}>
          <Text style={styleVariables.fontSizes.body}>Used</Text>
          <BouncyCheckbox
            size={28}
            fillColor={styleVariables.colors.primary}
            iconStyle={{
              width: 20,
              height: 20,
              borderColor: styleVariables.colors.primary,
            }}
            iconComponent={<View></View>}
            disableText={true}
            disableBuiltInState={true}
            isChecked={usedChecked}
            onPress={() => {
              if (usedChecked) {
                setUsedChecked(false);
              } else {
                setUsedChecked(true);
                setNewChecked(false);
              }
              setCondition("Used");
              setConditionModalVisible(false);
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[theme.secondaryButton, styles.closeBtn]}
        onPress={() => setConditionModalVisible(false)}
      >
        <Text style={[styleVariables.fontSizes.bodyBold, styles.btnText]}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ModalConditionPicker;
