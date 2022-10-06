import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ReplyArrowVerticalSVG = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m8.834 12.833 2.333-2.333-2.333-2.334"
      stroke="#395E66"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.167 10.5h-4A2.667 2.667 0 0 1 4.5 7.833V3.166"
      stroke="#395E66"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ReplyArrowVerticalSVG;
