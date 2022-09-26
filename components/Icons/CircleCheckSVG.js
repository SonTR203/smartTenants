import React from "react";
import Svg, { Path } from "react-native-svg";

function CircleCheckSVG(props) {
  return (
    <Svg
      width={33}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="m9.342 16.667 4 4 9.333-9.334"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.007 29.333c7.364 0 13.333-5.97 13.333-13.333 0-7.364-5.97-13.334-13.333-13.334C8.643 2.666 2.674 8.636 2.674 16s5.97 13.333 13.333 13.333Z"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CircleCheckSVG;
