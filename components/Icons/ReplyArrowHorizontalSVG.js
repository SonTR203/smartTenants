import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ReplyArrowHorizontalSVG = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M3.167 7.167 5.5 4.832l2.333 2.333"
      stroke="#395E66"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.5 4.833v4A2.667 2.667 0 0 0 8.167 11.5h4.667"
      stroke="#395E66"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ReplyArrowHorizontalSVG;
