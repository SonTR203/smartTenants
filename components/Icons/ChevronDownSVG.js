import React from "react";
import Svg, { Path } from "react-native-svg";

function ChevronDownSVG(props) {
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="m4.645 8.527 4.778 4.884a.76.76 0 0 0 .577.258c.22 0 .42-.088.584-.258l4.771-4.884a.715.715 0 0 0 .214-.521.736.736 0 0 0-.741-.747.74.74 0 0 0-.54.226l-4.282 4.4-4.294-4.4a.744.744 0 0 0-.54-.226.736.736 0 0 0-.74.747c0 .2.075.383.213.52Z"
        fill="#9D9D9D"
      />
    </Svg>
  );
}

export default ChevronDownSVG;
