import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowUpSVG = (props) => (
  <Svg
    width={14}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6.833 11.333V3m0 0-4 4m4-4 4 4"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowUpSVG;
