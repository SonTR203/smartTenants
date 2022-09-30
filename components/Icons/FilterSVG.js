import React from "react";
import Svg, { Path } from "react-native-svg";

function FilterSVG(props) {
  return (
    <Svg
      width={17}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2.917 2h10.666c.369 0 .667.298.667.667v1.057c0 .177-.07.346-.195.471L9.779 8.471a.667.667 0 0 0-.196.472v4.203a.667.667 0 0 1-.828.647l-1.333-.333a.667.667 0 0 1-.505-.647v-3.87a.667.667 0 0 0-.196-.472L2.445 4.195a.667.667 0 0 1-.195-.471V2.667c0-.369.298-.667.667-.667Z"
        stroke="#395E66"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FilterSVG;
