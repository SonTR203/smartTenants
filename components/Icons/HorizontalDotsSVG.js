import * as React from "react";
import Svg, { Circle } from "react-native-svg";

const HorizontalDotsSVG = (props) => (
  <Svg
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={8} cy={16} r={2} fill="#4D4D4D" />
    <Circle cx={16} cy={16} r={2} fill="#4D4D4D" />
    <Circle cx={24} cy={16} r={2} fill="#4D4D4D" />
  </Svg>
);

export default HorizontalDotsSVG;
