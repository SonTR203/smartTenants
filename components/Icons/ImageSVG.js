import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ImageSVG = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M21 3.6v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6Z"
      stroke="rgba(57, 94, 102, 1)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m3 16 7-3 11 5M16 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
      stroke="rgba(57, 94, 102, 1)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ImageSVG;
