import * as React from "react";
import Svg, { Path } from "react-native-svg";

const LogoutSVG = (props) => (
	<Svg
		width={32}
		height={32}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<Path
			d="M7.999 2.667h12a2.667 2.667 0 0 1 2.666 2.667V8H20V5.334h-12v21.333h12V24h2.666v2.667A2.667 2.667 0 0 1 20 29.334h-12a2.667 2.667 0 0 1-2.667-2.667V5.334a2.667 2.667 0 0 1 2.667-2.667Z"
			fill="#395E66"
		/>
		<Path
			d="m21.453 20.786 1.88 1.88L30 16l-6.667-6.667-1.88 1.88 3.44 3.453H12v2.667h12.893l-3.44 3.453Z"
			fill="#395E66"
		/>
	</Svg>
);

export default LogoutSVG;
