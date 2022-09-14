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
			d="M24.178 14.667C24.954 21.834 28 24 28 24H4s4-2.844 4-12.8c0-2.263.843-4.433 2.343-6.034 1.5-1.6 3.535-2.499 5.657-2.499.45 0 .896.04 1.333.12"
			stroke="#395E66"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<Path
			d="M25.332 10.667a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18.309 28a2.665 2.665 0 0 1-4.614 0"
			stroke="#395E66"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Svg>
);

export default SvgComponent;
