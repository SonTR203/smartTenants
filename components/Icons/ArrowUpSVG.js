import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowUpSVG() {
  return (
    <Svg
      width="16"
      height="16"
      // viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.8335 12.3333V4M7.8335 4L3.8335 8M7.8335 4L11.8335 8"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default ArrowUpSVG;
