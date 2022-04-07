import { View, Text, Image } from 'react-native';
import React from 'react';
import { useTheme } from '../../ThemeContext';

const Splashscreen = () => {
	const [theme, styleVariables] = useTheme();

	return (
		<View style={theme.firstListItem}>
			<View style={theme.topCard}>
				<View
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						paddingTop: 34
					}}
				>
					<Text>Community Comes</Text>
					<Text>included</Text>
					{/* Logo image */}
					</View>
					<View style={[theme.container, {}]}>
						<Image
							source={require('../../assets/SmartLiving_Logo.png')}
							style={{
								width: 187,
								height: 111,
								margin: 'auto',
							}}
							resizeMode="contain"
						/>
					</View>
				</View>
			</View>
	);
};

export default Splashscreen;
