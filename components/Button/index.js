import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  /**
   *
   * @param {boolean} destructive
   * Determine if the button is a destructive action.
   * Destructive buttons will have a red background and white text.
   * @example <Button destructive={true} />
   *
   *
   * @param {boolean} primary
   * Determine if the button is a primary action, e.g. save, delete
   * Primary buttons will have primary background and white text
   * @example <Button primary={true} />
   *
   */
  button: (destructive, primary) => ({
    paddingVertical: 12,
    flex: 1,
    marginRight: primary ? 0 : 8,
    marginLeft: primary ? 8 : 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primary
      ? destructive
        ? "#AB0728"
        : "#395E66"
      : "#EBEFF0",
    borderRadius: 16,
  }),

  /**
   *
   * @param {boolean} isBold
   * Determine if the text should be bold.
   * This is usually applied to primary or destructive buttons.
   * @example <Button isBold={true} />
   */
  text: (isBold) => ({
    fontSize: 17,
    lineHeight: 22,
    fontFamily: isBold ? "Roboto_500Medium" : "Roboto_400Regular",
  }),
});

/**
 *
 * @param style
 * Style object to be applied to the button.
 * @example <Button style={{ backgroundColor: "red" }} />
 *
 * @param title
 * The text of the button.
 * @example <Button title="Save" />
 *
 * @param onPress
 * The function to be called when the button is pressed.
 * @example <Button onPress={() => {}} />
 *
 * @param {boolean} destructive
 * Determine if the button is a destructive action. E.g: Delete
 * @example <Button destructive={true} />
 *
 * @param {boolean} primary
 * Determine if the button is a primary action, e.g. save, delete
 * @example <Button primary={true} />
 *
 * @param {boolean} isBold
 * Determine if the text should be bold.
 * This is usually applied to primary or destructive buttons.
 * @example <Button isBold={true} />
 *
 * @param {string} textColor
 * The color of the text.
 * @example <Button textColor={"#395E66"} />
 */
function Button({
  style = {},
  onPress = () => {},
  title = "",
  activeOpacity = 0.8,
  textColor = "#395E66",
  isBold = false,
  destructive = false,
  primary = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.button(destructive, primary), style]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text(isBold),
          {
            color: textColor,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
