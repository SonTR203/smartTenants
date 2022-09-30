import React from "react";
import Svg, { Path } from "react-native-svg";

function ChevronLeftSVG(props) {
  return (
    <Svg
      width={22}
      height={23}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.611 2.763a.687.687 0 0 0-.973 0l-8.25 8.25a.686.686 0 0 0 0 .973l8.25 8.25a.688.688 0 0 0 .973-.973L7.847 11.5l7.764-7.763a.689.689 0 0 0 0-.974Z"
        fill="#4D4D4D"
        stroke="#4D4D4D"
      />
    </Svg>
  );
}

export default ChevronLeftSVG;
