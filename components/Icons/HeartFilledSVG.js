import * as React from "react";
import Svg, { Path } from "react-native-svg";

const HeartFilledSVG = ({ props, width, height }) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M20.46 12.298c-.909.943-1.8 1.889-2.687 2.83-1.766 1.876-3.515 3.733-5.357 5.508a.61.61 0 0 1-.853-.02L3.54 12.298c-2.052-2.127-2.052-5.572 0-7.699a5.139 5.139 0 0 1 7.45 0l.291.302a1 1 0 0 0 1.44 0l.291-.302A5.173 5.173 0 0 1 16.736 3c1.394 0 2.735.573 3.725 1.599A5.545 5.545 0 0 1 22 8.45c0 1.446-.556 2.83-1.54 3.849Z"
      fill="#395E66"
      stroke="#395E66"
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);

export default HeartFilledSVG;
