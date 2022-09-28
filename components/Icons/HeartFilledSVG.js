import * as React from "react";
import Svg, { Path } from "react-native-svg";

const HeartFilledSVG = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M20.64 12.471c-.904.938-1.793 1.882-2.68 2.823-1.768 1.878-3.525 3.744-5.372 5.523a.86.86 0 0 1-1.205-.028L3.36 12.471c-2.145-2.223-2.145-5.822 0-8.046a5.389 5.389 0 0 1 7.81 0l.291.303a.75.75 0 0 0 1.08 0l.291-.302a5.424 5.424 0 0 1 3.905-1.676c1.463 0 2.869.601 3.904 1.675a5.795 5.795 0 0 1 1.61 4.023c0 1.51-.58 2.957-1.61 4.023Z"
      fill="#29AA6B"
    />
  </Svg>
);

export default HeartFilledSVG;
