import React from "react";
import EyeOpenSVG from "./Icons/EyeOpenSVG";
import EyeClosedSVG from "./Icons/EyeClosedSVG";

function PasswordToggle({ passwordSecure, setPasswordSecure }) {
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
