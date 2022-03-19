import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from '@firebase/firestore';

// import Signup from '../Signup/Signup';

import { db } from '../../firebase-config';
import { useAppContext } from '../../Context/AppContext';

const auth = getAuth();
let globalSetCurrentUser;
let globalCurrentUser;

const Login = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { currentUser, setCurrentUser } = useAppContext();
	globalSetCurrentUser = setCurrentUser;
	globalCurrentUser = currentUser;

	const handleLogin = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredentials) => {
				console.log('Logged in with:', userCredentials.user.email);
				if (userCredentials.user.email) {
					navigation.navigate('Newsfeed');
					findUser(userCredentials.user);
				} else {
					//the first time never logs in? email is undefined?
				}
			})
			.catch((error) => alert(error.message));
	};

	const findUser = async (user) => {
		const colRef = collection(db, 'Users');
		const data = await getDocs(colRef);

		data.docs.map((item) => {
			let userUID =
				item._document.data.value.mapValue.fields.userID.stringValue;
			if (userUID) {
				if (userUID == user.uid) {
					let object = item._document.data.value.mapValue.fields;
					let loggedInUser = {
						buildingID: object.buildingID.stringValue,
						email: object.email.stringValue,
						firstName: object.firstName.stringValue,
						lastName: object.lastName.stringValue,
						isAdmin: object.isAdmin.booleanValue,
						myMarketplacePosts: object.myMarketplacePosts.arrayValue,
						myPosts: object.myPosts.arrayValue,
						tenantAuthorized: object.tenantAuthorized.booleanValue,
						unitNumber: object.unitNumber.integerValue,
						userUID: object.userID.stringValue,
						userDocId: item._key.path.segments[6],
						visibleNotices: object.visibleNotices.arrayValue,
						visibleAnnouncements: object.visibleAnnouncements.arrayValue,
					};
					globalSetCurrentUser(loggedInUser);
				}
			}
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="Email"
						value={email}
						onChangeText={(text) => setEmail(text)}
						style={styles.input}
					/>
					<TextInput
						placeholder="Password"
						value={password}
						onChangeText={(text) => setPassword(text)}
						style={styles.input}
						secureTextEntry
					/>
				</View>
				<View>
					<Text>Forgot password?</Text>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={handleLogin} style={styles.button}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
				</View>
				<View>
					<Text>Don't have an account?</Text>
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Signup');
						}}
						style={styles.button}
					>
						<Text style={styles.buttonText}>Signup here</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer: {
		width: '80%',
	},
	input: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
	buttonContainer: {
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	buttonOutline: {
		backgroundColor: 'white',
		marginTop: 5,
		borderColor: '#0782F9',
		borderWidth: 2,
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
	buttonOutlineText: {
		color: '#0782F9',
		fontWeight: '700',
		fontSize: 16,
	},
});
