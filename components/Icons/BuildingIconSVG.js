import React from "react";
import Svg, { Path } from "react-native-svg";

function BuildingIconSVG() {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M4 11.9239C4 10.3721 4 9.59627 4.31367 8.91429C4.62734 8.2323 5.21642 7.72737 6.39457 6.71753L7.53743 5.73794C9.66694 3.91265 10.7317 3 12 3C13.2683 3 14.3331 3.91265 16.4626 5.73794L17.6054 6.71753C18.7836 7.72737 19.3727 8.2323 19.6863 8.91429C20 9.59627 20 10.3721 20 11.9239V16.77C20 18.925 20 20.0025 19.3305 20.672C18.6611 21.3414 17.5836 21.3414 15.4286 21.3414H8.57143C6.41644 21.3414 5.33894 21.3414 4.66947 20.672C4 20.0025 4 18.925 4 16.77V11.9239Z"
        stroke="#4D4D4D"
        stroke-width="1.5"
      />
      <Path
        d="M14.8569 21.3415V15.4844C14.8569 14.9321 14.4091 14.4844 13.8569 14.4844H10.1426C9.59029 14.4844 9.14258 14.9321 9.14258 15.4844V21.3415"
        stroke="#4D4D4D"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default BuildingIconSVG;
