import * as React from "react";
import Svg, { Path } from "react-native-svg";

const PersonalInfoSVG = (props) => (
	<Svg
		width={32}
		height={32}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<Path
			d="M6.668 26.667v-1.334a9.333 9.333 0 0 1 18.667 0v1.334"
			stroke="#395E66"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<Path
			d="M16.001 16a5.333 5.333 0 1 0 0-10.667 5.333 5.333 0 0 0 0 10.667Z"
			stroke="#395E66"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
);

export default PersonalInfoSVG;
