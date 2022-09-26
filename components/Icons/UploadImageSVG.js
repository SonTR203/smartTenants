import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

function UploadImageSVG(props) {
  return (
    <Svg
      width={40}
      height={40}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={40} height={40} rx={8} fill="#EBEFF0" />
      <Path
        d="M11 28.4V11.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6v16.8a.6.6 0 0 1-.6.6H11.6a.6.6 0 0 1-.6-.6Z"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m29 16-7 3-11-5M16 22a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default UploadImageSVG;
