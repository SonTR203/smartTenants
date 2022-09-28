import * as React from "react";
import Svg, { Path, Rect, Defs, G, ClipPath } from "react-native-svg";

const UsersWhoLikedHeartSvg = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={16} height={16} rx={8} fill="#29AA6B" />
    <G ClipPath="url(#a)">
      <Path
        d="M11.667 6.816c0 .567-.218 1.112-.607 1.515-.895.927-1.763 1.895-2.691 2.789a.536.536 0 0 1-.754-.017L4.94 8.331a2.195 2.195 0 0 1 0-3.03 2.046 2.046 0 0 1 2.963 0L8 5.402l.097-.1a2.058 2.058 0 0 1 1.482-.635c.557 0 1.09.228 1.481.634.39.403.607.948.607 1.515Z"
        fill="#fff"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" transform="translate(4 4)" d="M0 0h8v8H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default UsersWhoLikedHeartSvg;
