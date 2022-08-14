import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

function CustomBottomModal({ isModalVisible, setModalVisible, children }) {
  return (
    <Modal
      style={{ margin: 0, justifyContent: "flex-end" }}
      coverScreen={true}
      onBackdropPress={() => setModalVisible(false)}
      isVisible={isModalVisible}
    >
      <View
        style={{
          height: "auto",
          backgroundColor: "white",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 24,
          paddingBottom: 34,
        }}
      >
        {children}
      </View>
    </Modal>
  );
}

export default CustomBottomModal;
