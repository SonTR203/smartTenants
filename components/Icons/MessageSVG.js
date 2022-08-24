import * as React from "react";
import Svg, { Path } from "react-native-svg";

const MessageSVG = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m7 9 5 3.5L17 9"
      stroke="#395E66"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"
      stroke="#395E66"
      strokeWidth={2}
    />
  </Svg>
);

export default MessageSVG;
