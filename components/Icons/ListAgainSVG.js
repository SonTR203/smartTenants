import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ListAgainSVG = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      stroke="#4D4D4D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16.391V18.5m3-10c-.685-.685-1.891-1.161-3-1.191L15 8.5ZM9 15c.644.86 1.843 1.35 3 1.391L9 15Zm3-7.691c-1.32-.036-2.5.561-2.5 2.191 0 3 5.5 1.5 5.5 4.5 0 1.711-1.464 2.446-3 2.391V7.309Zm0 0V5.5v1.809Z"
      stroke="#4D4D4D"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ListAgainSVG;
