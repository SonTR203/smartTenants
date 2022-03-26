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
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs, addDoc } from '@firebase/firestore'
import { useTheme } from '../../../ThemeContext'
import { ProfilePages } from '../../customNavigator'
import { db } from '../../../firebase-config'
import { useAppContext } from '../../../Context/AppContext'
import EditProfile from '../EditProfile/EditProfile'
import { ProfileNavigator } from '../../customNavigator';

const auth = getAuth()
let globalSetCurrentUser
let globalCurrentUser

const ProfileGeneral = ({ navigation }) => {
	const [theme, styleVariables] = useTheme()

	const { currentUser, setCurrentUser } = useAppContext();

	const logUserOut = () => {
		console.log("logging user out")
		auth.signOut().then(
			console.log("Tenant signed out")
		)
		navigation.navigate("Login")
	}


	return (
		<SafeAreaView>
			<StatusBar style='auto' />
			<View>
				<Image
					source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/smarttenant-19566.appspot.com/o/userProfileImages%2FdefaultIcon2.png?alt=media&token=88588d1f-3bc6-4edb-86a2-b0f3f769d3ce' }}
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
				<View>
					<TouchableOpacity
						onPress={logUserOut}
						style={theme.primaryButton}
					>
						<Text
							style={[
								theme.textInput,
								styleVariables.fontSizes.bodyBold
							]}
						>
							Log Out
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView >
	);
};

export default ProfileGeneral;
