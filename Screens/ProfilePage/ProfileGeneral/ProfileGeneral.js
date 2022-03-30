import React from 'react';
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	Linking,
	Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../../ThemeContext';
import { useAppContext } from '../../../Context/AppContext';

const ProfileGeneral = ({ navigation }) => {
	const [theme, styleVariables] = useTheme();

	const { currentUser, setCurrentUser } = useAppContext();
	console.log(currentUser.userProfileImage);

	const logUserOut = () => {
		console.log('logging user out');
		navigation.navigate('Login');
	};

	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			<TouchableOpacity
				onPress={() => {
					navigation.navigate('BuildingInfo');
				}}
			>
				<Text>{currentUser.buildingAddress}</Text>
			</TouchableOpacity>
			<View>
				<Image
					source={{ uri: `${currentUser.userProfileImage}` }}
					style={{ height: 50, width: 50 }}
				/>
			</View>
			<View>
				<Text>{currentUser.firstName + ' ' + currentUser.lastName}</Text>
			</View>
			{currentUser.isAdmin && (
				<View>
					<TouchableOpacity
						id=""
						onPress={() => {
							navigation.navigate('AdminPanel');
						}}
						style={theme.primaryButton}
					>
						<Text>Admin Panel</Text>
					</TouchableOpacity>
				</View>
			)}
			<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
				<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
					<TouchableOpacity
						id=""
						onPress={() => {
							navigation.navigate('EditProfile');
						}}
						style={theme.primaryButton}
					>
						<Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
							Edit Info
						</Text>
					</TouchableOpacity>
				</View>

				<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
					<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(
									'https://smartlivinggroup.securecafe.com/residentservices/apartmentsforrent/userlogin.aspx'
								);
							}}
						>
							<Text
								style={[
									styleVariables.fontSizes.calloutBold,
									{ color: styleVariables.colors.primary },
								]}
							>
								Residential Portal
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View>
					<TouchableOpacity
						onPress={() => navigation.navigate('MyPosts')}
						style={theme.primaryButton}
					>
						<Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
							My Posts
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<TouchableOpacity onPress={logUserOut} style={theme.primaryButton}>
						<Text style={[theme.textInput, styleVariables.fontSizes.bodyBold]}>
							Log Out
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<Text>Created by IntelliDev Solutions</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};


export default ProfileGeneral;
