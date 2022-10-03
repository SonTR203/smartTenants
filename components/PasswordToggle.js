import React from "react";
import { TouchableOpacity } from "react-native";
import EyeOpenSVG from "./Icons/EyeOpenSVG";
import EyeClosedSVG from "./Icons/EyeClosedSVG";
import { useTheme } from "../ThemeContext";

function PasswordToggle({ passwordSecure, setPasswordSecure }) {
  const { theme } = useTheme();

  return passwordSecure ? (
    <TouchableOpacity
      style={theme.passwordIcon}
      onPress={() => setPasswordSecure(false)}
      activeOpacity={1}
    >
      <EyeClosedSVG />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={theme.passwordIcon}
      onPress={() => setPasswordSecure(true)}
      activeOpacity={1}
    >
      <EyeOpenSVG />
    </TouchableOpacity>
  );
}

export default PasswordToggle;
