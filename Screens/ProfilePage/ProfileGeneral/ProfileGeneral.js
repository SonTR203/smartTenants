import React, { useEffect, useState } from 'react'
import {
	KeyboardAvoidingView,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Image,
	Linking
} from 'react-native';

import { StatusBar } from 'expo-status-bar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc } from '@firebase/firestore'
import { useTheme, ThemeProvider } from '../../../ThemeContext'
import { ProfilePages } from '../../customNavigator'
import { db } from '../../../firebase-config'
import { useAppContext, AppProvider } from '../../../Context/AppContext'
import EditProfile from '../EditProfile/EditProfile'
import { ProfileNavigator } from '../../customNavigator';
import { NewsfeedNavigator } from '../../customNavigator';
import LogOut from './LogOut'


const auth = getAuth()
let globalSetCurrentUser
let globalCurrentUser;


const ProfileGeneral = ({ route, navigation, ...props }) => {
	const [theme, styleVariables] = useTheme();

	const { currentUser, setCurrentUser } = useAppContext();


	return (
		<ThemeProvider>
			<AppProvider>
				<TouchableOpacity onPress={() => { navigation.navigate("BuildingInfo") }}>
					<Text>{currentUser.buildingAddress}</Text>
				</TouchableOpacity>
				<View>
					<Image
						source={{ uri: currentUser.userProfileImage }}
						style={{ height: 43, width: 43, borderRadius: 12 }}
					/>
				</View>
				<View>
					<Text>{currentUser.firstName + " " + currentUser.lastName}</Text>
				</View>
				{currentUser.isAdmin && <View>
					<Text>Admin Panel</Text>
				</View>}
				<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
					<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
						<TouchableOpacity
							id=''
							onPress={() => { navigation.navigate('EditProfile') }}
							style={theme.primaryButton}
						>

							<Text
								style={[
									theme.textInput,
									styleVariables.fontSizes.bodyBold
								]}
							>
								Edit Info
							</Text>
						</TouchableOpacity>
					</View>


					<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
						<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
							<TouchableOpacity

								onPress={() => {
									Linking.openURL('https://www.smartlivingproperties.ca/')
								}}
							>
								<Text
									style={[
										styleVariables.fontSizes.calloutBold,
										{ color: styleVariables.colors.primary }
									]}
								>
									Residential Portal
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View>
						<TouchableOpacity
							id=''
							onPress={() => navigation.navigate('MyPosts')}
							style={theme.primaryButton}
						>
							<Text
								style={[
									theme.textInput,
									styleVariables.fontSizes.bodyBold
								]}
							>
								My Posts
							</Text>
						</TouchableOpacity>
					</View>
					<LogOut navigation={props.navigation}/>
				</View>
			</AppProvider>
		</ThemeProvider>
	);
};


export default ProfileGeneral;
