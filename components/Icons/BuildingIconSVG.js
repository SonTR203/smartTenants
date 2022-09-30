import React from "react";
import Svg, { Path } from "react-native-svg";

function BuildingIconSVG(props) {
  return (
    <Svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4 11.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C9.667 3.913 10.732 3 12 3c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H8.57c-2.155 0-3.232 0-3.902-.67C4 20.002 4 18.925 4 16.77v-4.846Z"
        stroke="#4D4D4D"
        strokeWidth={1.5}
      />
      <Path
        d="M14.857 21.341v-5.857a1 1 0 0 0-1-1h-3.714a1 1 0 0 0-1 1v5.857"
        stroke="#4D4D4D"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BuildingIconSVG;
