import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

function UploadImageSVG() {
  return (
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect x="0.0078125" width="32" height="32" rx="8" fill="#EBEFF0" />
      <Path
        d="M7.00781 24.4V7.6C7.00781 7.2686 7.27641 7 7.60781 7H24.4078C24.7392 7 25.0078 7.2686 25.0078 7.6V24.4C25.0078 24.7314 24.7392 25 24.4078 25H7.60781C7.27641 25 7.00781 24.7314 7.00781 24.4Z"
        stroke="#395E66"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M25.0078 12L18.0078 15L7.00781 10"
        stroke="#395E66"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12.0078 18C13.1124 18 14.0078 18.8954 14.0078 20C14.0078 21.1046 13.1124 22 12.0078 22C10.9032 22 10.0078 21.1046 10.0078 20C10.0078 18.8954 10.9032 18 12.0078 18Z"
        stroke="#395E66"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default UploadImageSVG;
