import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowUpSVG = (props) => (
  <Svg
    width={14}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6.75 13.5V1m0 0-6 6m6-6 6 6"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowUpSVG;
