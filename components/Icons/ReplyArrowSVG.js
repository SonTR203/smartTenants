import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ReplyArrowSVG = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M7.167 3.167 4.832 5.5l2.333 2.333"
      stroke="#395E66"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.833 5.5h4A2.667 2.667 0 0 1 11.5 8.167v4.667"
      stroke="#395E66"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ReplyArrowSVG;
