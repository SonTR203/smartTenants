import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Import Required functions from FireStore
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const auth = getAuth();

	const handleReset = async () => {
		try {
			await sendPasswordResetEmail(auth, email.trim());
			alert('Password reset link sent!');
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	return (
		<>
			<View>
				<Text>Did you Forgot your Password?</Text>
				<Text>Just type in your Email and we will send you a reset link</Text>
				<TextInput
					placeholder="name@company.com"
					value={email}
					onChangeText={(text) => setEmail(text)}
				></TextInput>
				<TouchableOpacity id="SendResetEmail" onPress={handleReset}>
					<Text>Reset</Text>
				</TouchableOpacity>
			</View>
		</>
	);
};

export default ForgotPassword;
