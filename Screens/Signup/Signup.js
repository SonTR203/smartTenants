//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useEffect, useState } from 'react';

import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	TextInput,
	TouchableOpacity,
	Modal,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../../firebase-config';
import ModalPicker from '../../components/ModalBuildingPicker';

const auth = getAuth();

const Signup = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [buildingAddress, setBuildingAddress] = useState('Select Building...');
	const [buildingID, setBuildingID] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [unitNumber, setUnitNumber] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [tenantAuthorized, setTenantAuthorized] = useState(false);
	const [myMarketplacePosts, setMyMarketplacePosts] = useState([]);
	const [myPosts, setMyPosts] = useState([]);
	const [visibleNotices, setVisibileNotices] = useState([]);
	const [visibleAnnouncements, setVisibleAnnouncements] = useState([]);
	const defaultProfileImage =
		'https://firebasestorage.googleapis.com/v0/b/smarttenant-19566.appspot.com/o/userProfileImages%2FdefaultIcon.png?alt=media&token=80cd4281-4842-42b6-90ca-0828f00ceb82';

	const changeModalVisibility = (bool) => {
		setModalVisible(bool);
	};

	const setData = (building) => {
		building = building.buildingAddress.stringValue;
		setBuildingAddress(building);
		setBuildingID(building.replace(/\s/g, ''));
	};

	const checkTextInputs = () => {
		if (!firstName.trim()) {
			alert('Please Enter Your First Name');
			return false;
		} else if (!lastName.trim()) {
			alert('Please Enter Your last Name');
			return false;
		} else if (!unitNumber.trim() || isNaN(unitNumber.trim())) {
			console.log(+unitNumber);
			alert('Please Enter a Unit Number');
			return false;
		} else if (!buildingID.trim()) {
			alert('Please Enter Your Building Id');
			return false;
		} else if (!email) {
			alert('Please Enter Your Email Address');
			return false;
		} else if (!password) {
			alert('Please Enter Your Password, at leat 6 charcters');
			return false;
		}
		return true;
	};

	async function createNewUser(user) {
		try {
			await addDoc(collection(db, 'Users'), {
				userID: user.uid,
				firstName,
				lastName,
				buildingID,
				buildingAddress,
				email,
				unitNumber: parseInt(unitNumber),
				isAdmin,
				tenantAuthorized,
				myMarketplacePosts,
				myPosts,
				visibleNotices,
				visibleAnnouncements,
				userProfileImage: defaultProfileImage,
			});
		} catch (error) {
			alert(error);
		}
	}

	function signUpSuccess(user) {
		createNewUser(user);
		navigation.navigate('AccountApprovalPending');
	}

	function signUpFailure() {
		alert('You have not been signed up, please try again');
	}

	const handleSignup = () => {
		if (!checkTextInputs()) return;

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				signUpSuccess(user);
			})
			.catch((error) => {
				alert(error.message);
				signUpFailure();
			});
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="First Name"
						value={firstName}
						onChangeText={(text) => setFirstName(text)}
						style={styles.input}
					/>

					<TextInput
						placeholder="Last Name"
						value={lastName}
						onChangeText={(text) => setLastName(text)}
						style={styles.input}
					/>

					<TextInput
						placeholder="Unit Number"
						value={unitNumber}
						onChangeText={(text) => setUnitNumber(text)}
						style={styles.input}
					/>

					<TouchableOpacity
						onPress={() => {
							changeModalVisibility(true);
						}}
					>
						<Text>{buildingAddress}</Text>
					</TouchableOpacity>
					<Modal
						transparent={true}
						animationType="fade"
						visible={modalVisible}
						nRequestClose={() => {
							changeModalVisibility(false);
						}}
					>
						<ModalPicker
							changeModalVisibility={changeModalVisibility}
							setData={setData}
						/>
					</Modal>

					<TextInput
						placeholder="Email"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
						}}
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

				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={handleSignup} style={styles.button}>
						<Text style={styles.buttonText}>Signup</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>

			<View>
				<Text style={styles.title}>
					upon signup you accept our terms & conditions outlined in out terms of
					use and privacy policy
				</Text>
			</View>
		</SafeAreaView>
	);
};

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

export default Signup;
