import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Button from "../../Button";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: "row",
    width: "100%",
  },
  subtitle: {
    marginTop: 8,
    color: "#4D4D4D",
    fontSize: 15,
    lineHeight: 20,
  },
  title: {
    color: "#4D4D4D",
    fontSize: 20,
    lineHeight: 25,
    fontFamily: "Roboto_500Medium",
  },
});

/**
 * Component for any action inside a custom Modal that requires confirmation or cancellation.
 * @param {string} title
 * The title text of the action.
 *
 * @param {string} subtitle
 * The subtitle text of the action.
 *
 * @param {string} confirmText
 * The text of the primary button.
 * @param onConfirm
 * The function to be called when the primary button is pressed.
 *
 * @param onCancel
 * The function to be called when the secondary button is pressed.
 *
 * @param destructive
 * Determine if the button is a destructive action. E.g: Delete
 *
 */
function ModalActionConfirm({
  title = "",
  subtitle = "",
  confirmText = "",
  onConfirm = () => {},
  onCancel = () => {},
  destructive = false,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.buttonContainer}>
        <Button textColor={"#395E66"} title="Cancel" onPress={onCancel} />
        <Button
          primary={true}
          isBold={true}
          textColor={"white"}
          destructive={destructive}
          title={confirmText}
          onPress={onConfirm}
        />
      </View>
    </View>
  );
}

export default ModalActionConfirm;
