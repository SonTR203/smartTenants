import React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowRightSVG(props) {
  return (
    <Svg
      width={33}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.341 16.334h16.667m0 0-8 8m8-8-8-8"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowRightSVG;
