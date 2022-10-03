import React from "react";
import Svg, { Path } from "react-native-svg";

function EyeClosedSVG(props) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M18.854 11.935 21 15.638M14.457 13.997l.666 3.778M9.535 13.987l-.666 3.788M5.137 11.935 2.99 15.656M3 9.834c1.575 1.95 4.463 4.416 9 4.416 4.538 0 7.425-2.466 9-4.416"
        stroke="#92A6AB"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default EyeClosedSVG;
