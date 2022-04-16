import { View, Image } from 'react-native';
import React from 'react';
import { useTheme } from '../../ThemeContext';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Splashscreen = () => {
	const [theme, styleVariables] = useTheme();

	return (
		<View
			style={{
				height: windowHeight,
				width: windowWidth,
				backgroundColor: styleVariables.colors.white,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View style={{ backgroundColor: 'black' }}></View>
			<View
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				{/* slogan */}
				<Image
					source={require('../../assets/slogan.png')}
					style={{
						width: windowWidth - 136,
						height: (windowWidth - 136) / 2.5,
						margin: 'auto',
						marginBottom: 68,
					}}
					resizeMode="contain"
				/>
				{/* Logo image */}
				<Image
					source={require('../../assets/SmartLiving_Logo.png')}
					style={{
						width: 146,
						height: 87,
						margin: 'auto',
					}}
					resizeMode="contain"
				/>
			</View>
			<View style={{ backgroundColor: 'black' }}></View>
		</View>
	);
};

export default Splashscreen;
