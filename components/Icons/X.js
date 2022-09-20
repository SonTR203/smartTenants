import * as React from "react";
import Svg, { Path } from "react-native-svg";

const X = (props) => (
  <Svg
    width={13}
    height={13}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1 11.663 6.243 6.42m5.243-5.243L6.242 6.42m0 0L1 1.177M6.243 6.42l5.243 5.243"
      stroke="#9D9D9D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default X;
