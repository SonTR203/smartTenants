import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgComponent = (props) => (
	<Svg
		width={32}
		height={32}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<Path
			d="M21.333 16H23.2a.8.8 0 0 1 .8.8v9.066a.8.8 0 0 1-.8.8H8.8a.8.8 0 0 1-.8-.8V16.8a.8.8 0 0 1 .8-.8h1.867m10.666 0v-5.334c0-1.777-1.066-5.333-5.333-5.333s-5.333 3.556-5.333 5.333V16m10.666 0H10.667"
			stroke="#395E66"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
);

export default SvgComponent;
