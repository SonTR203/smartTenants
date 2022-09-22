import * as React from "react";
import Svg, { Ellipse, Path } from "react-native-svg";

const BucketIconSVG = (props) => {
	return (
		<Svg
			width={24}
			height={24}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			<Ellipse
				rx={7}
				ry={3}
				transform="matrix(1 0 0 -1 12 6)"
				stroke="#4D4D4D"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			<Path
				d="m5 6 1.996 10.98a.068.068 0 0 0 .019.035v0a7.05 7.05 0 0 0 9.97 0v0a.068.068 0 0 0 .019-.036L19 6"
				stroke="#4D4D4D"
				strokeWidth={2}
				strokeLinecap="round"
			/>
		</Svg>
	);
};

export default BucketIconSVG;
