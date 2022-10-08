import React from "react";
import Svg, { Path } from "react-native-svg";

function SortSVG(props) {
  return (
    <Svg
      width={17}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="m12.25 5-3.5-3.5L5.25 5M12.25 11l-3.5 3.5-3.5-3.5"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SortSVG;
