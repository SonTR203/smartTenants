import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ChevronRightSVG = (props) => {
	return (
		<Svg
			width={22}
			height={22}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.39 2.264a.687.687 0 0 1 .973 0l8.25 8.25a.687.687 0 0 1 0 .973l-8.25 8.25a.688.688 0 0 1-.974-.973L14.154 11 6.39 3.237a.687.687 0 0 1 0-.973Z"
				fill="#395E66"
				stroke="#395E66"
			/>
		</Svg>
	);
};

export default ChevronRightSVG;
