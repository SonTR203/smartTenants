import * as React from "react";
import Svg, { Path } from "react-native-svg";

const MyPostsSVG = (props) => (
	<Svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg">
		<Path
			d="M4.8 8h14.4v2.4H4.8V8Zm0 10h9.6v2.4H4.8V18Zm0-5.008h14.4v2.4H4.8v-2.4Zm22.049 6.192 1.04-1.04a1.207 1.207 0 0 0 0-1.696l-1.136-1.136a1.207 1.207 0 0 0-1.696 0l-1.04 1.04 2.832 2.832Zm-.944.944L18.833 27.2H16v-2.832l7.072-7.072 2.832 2.832Z"
			fill="#395E66"
		/>
	</Svg>
);

export default MyPostsSVG;
