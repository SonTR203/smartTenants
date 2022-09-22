import * as React from "react";
import Svg, { Path } from "react-native-svg";

const PencilIconSVG = (props) => {
	return (
		<Svg
			width={24}
			height={24}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			<Path
				d="M13.02 5.828 15.85 3l4.95 4.95-2.829 2.828m-4.95-4.95-9.606 9.607a1 1 0 0 0-.293.707v4.536h4.536a1 1 0 0 0 .707-.293l9.606-9.607m-4.95-4.95 4.95 4.95"
				stroke="#4D4D4D"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
};
export default PencilIconSVG;
