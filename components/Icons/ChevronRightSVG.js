import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ChevronRightSVG = (props) => {
  return (
    <Svg
      width={12}
      height={20}
      viewBox="0 0 12 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.39 1.264a.687.687 0 01.973 0l8.25 8.25a.687.687 0 010 .973l-8.25 8.25a.688.688 0 01-.974-.973L9.154 10 1.39 2.237a.687.687 0 010-.973z"
        fill="#395E66"
        stroke={props.stroke}
      />
    </Svg>
  );
};

export default ChevronRightSVG;
