import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useTheme } from "../../ThemeContext";

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: "flex-end" },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  modalOptionText: {
    fontSize: 17,
    lineHeight: 22,
    color: "#4D4D4D",
    fontFamily: "Roboto_400Regular",

    marginBottom: 25,
    marginLeft: 20,
  },
  container: {
    height: "auto",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 34,
  },
  closeButton: (styleVariables) => ({
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: styleVariables.colors.primary,
  }),
  closeText: (styleVariables) => ({
    fontSize: 17,
    lineHeight: 22,
    color: styleVariables.colors.primary,
    fontFamily: "Roboto_500Medium",
  }),
});

/**
 *
 * @param {boolean} isModalVisible
 * The visibility of the Modal. This is passed from the parent component.
 * @example <CustomBottomModal isModalVisible={true} />
 *
 * @param {function} setModalVisible
 * Setter for the Modal visibility. This is passed from the parent component.
 * @example <CustomBottomModal setModalVisible={setModalVisible} />
 *
 * @param {Array} options
 * The options to be displayed in the Modal.
 * Has ``content``, ``onPress``, and ``iconName``, ``iconColor`` properties.
 *
 * @param children
 * The children of the Modal. If there are no options, this will be displayed.
 * @example <CustomBottomModal><Text>Hello</Text></CustomBottomModal>
 */
function CustomBottomModal({
  isModalVisible = false,
  setModalVisible = () => {},
  options = [],
  children = null,
}) {
  const { styleVariables } = useTheme();
  const [subscreen, setSubscreen] = React.useState(null);

  useEffect(() => {
    setSubscreen(null);
  }, [isModalVisible]);

  return (
    <Modal
      style={styles.modalContainer}
      coverScreen={true}
      onBackdropPress={() => {
        setModalVisible(false);
      }}
      isVisible={isModalVisible}
    >
      <View style={styles.container}>
        {/* Rendering flow: 
        If there is no subscreen, then the children will be rendered. 
        If there is no children, the modal options will be rendered instead */}
        {subscreen ? (
          subscreen
        ) : children ? (
          children
        ) : (
          <>
            {options.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    // needs handling for Edit Listing
                    item.renderSubscreen && setSubscreen(item.renderSubscreen)
                  }
                  style={styles.optionContainer}
                >
                  <MaterialCommunityIcons
                    name={item.iconName}
                    size={18}
                    color={item.iconColor}
                  />
                  <Text style={styles.modalOptionText}>{item.content}</Text>
                </Pressable>
              );
            })}
            {/* CLOSE BUTTON */}
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.closeButton(styleVariables)}
            >
              <Text style={styles.closeText(styleVariables)}>Close</Text>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
}

export default CustomBottomModal;
