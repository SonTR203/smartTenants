import * as React from "react";
import Svg, { Path } from "react-native-svg";

const EmailIconSVG = () => (
	<Svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg">
		<Path
			d="m9.332 12 6.667 4.667L22.665 12"
			stroke="#395E66"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<Path
			d="M2.668 22.667V9.334a2.667 2.667 0 0 1 2.667-2.667h21.333a2.667 2.667 0 0 1 2.667 2.667v13.333a2.667 2.667 0 0 1-2.667 2.667H5.335a2.667 2.667 0 0 1-2.667-2.667Z"
			stroke="#395E66"
			strokeWidth={2}
		/>
	</Svg>
);

export default EmailIconSVG;
