import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../ThemeContext";

function MarkAsSoldModal({ handleMarkSold, setModalVisible }) {
  const { styleVariables } = useTheme();

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.2,
      alignItems: "center",
      backgroundColor: "white",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 34,
    },
    cancel: {
      backgroundColor: "#EBEFF0",
      paddingHorizontal: 50,
      paddingVertical: 12,
      borderRadius: 16,
      marginRight: 8,
    },
    confirm: {
      backgroundColor: styleVariables.colors.primary,
      paddingHorizontal: 50,
      paddingVertical: 12,
      borderRadius: 16,
      marginLeft: 8,
    },
    confirmText: {
      color: styleVariables.colors.white,
      textAlign: "center",
    },
    cancelText: {
      color: styleVariables.colors.primary,
      textAlign: "center",
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
    },
  });

  return (
    <View style={styles.modalContainer}>
      <Text
        style={[
          styleVariables.fontSizes.title,
          {
            color: styleVariables.colors.blackm,
            marginBottom: 8,
            marginTop: 24,
          },
        ]}
      >
        Mark listing as sold?
      </Text>
      <Text
        style={{
          color: styleVariables.colors.black,
          fontSize: 15,
          marginBottom: 24,
        }}
      >
        You will be able to restore it
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancel}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Text style={[styles.cancelText, styleVariables.fontSizes.body]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirm}
          onPress={() => {
            handleMarkSold();
            setModalVisible(false);
          }}
        >
          <Text style={[styles.confirmText, styleVariables.fontSizes.body]}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MarkAsSoldModal;
