// Modal: https://reactnative.dev/docs/modal

import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	Image,
	TouchableOpacity,
	Modal,
	Platform,
	ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { addDoc, collection } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTheme } from '../../ThemeContext';

const CreatePost = ({ navigation }) => {
	const [theme] = useTheme();
	console.log(theme);
	const [postContent, setPostContent] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState('');
	const [image, setImage] = useState(null);
	const [imageURL, setImageURL] = useState('');
	const [isLoading, setIsloading] = useState(false);

	let user; // this will hold the user object
	// replace these with the user object
	let userID = 1234;
	let imageName = `newsfeedImages/${userID}/${
		Date.now() + Math.floor(Math.random() * 20)
	}.jpg`;
	let buildingID = 5678;
	let postUserID = 12345678;

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
			}
		})();
	}, []);

	async function PostContent(imgUrl) {
		if (!imgUrl) {
			imgUrl = 'no image posted';
		}
		try {
			await addDoc(collection(db, 'Newsfeed'), {
				buildingID: buildingID,
				postContent: postContent,
				postID:
					String.fromCharCode(Math.floor(Math.random() * 20) + 97) +
					Math.random().toString(16).slice(2) +
					Date.now().toString(16).slice(4),
				postUserID: userID,
				images: [imgUrl],
				peopleWhoLiked: [],
				comments: [],
			});

			postSuccess();
		} catch (error) {
			console.log(error);
			postFailure();
		}
	}

	function postSuccess() {
		setIsloading(false);
		setModalText('Post Successful!');
		setModalVisible(true);
	}

	function postFailure() {
		setModalText('Post Failed');
		setModalVisible(true);
	}

	// ============================= IMAGE UPLOAD =============================

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	async function handleSelectedImage() {
		setIsloading(true);

		if (image == null) {
			console.log('no image found');
			PostContent();
		} else {
			try {
				if (!image.cancelled) {
					await uploadImage(image);
				}
			} catch (e) {
				console.log(e);
				alert('Upload failed, sorry :(');
			}
		}
	}

	async function uploadImage() {
		console.log('UPLOADING');
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', image, true);
			xhr.send(null);
		});

		const fileRef = ref(getStorage(), imageName);
		await uploadBytes(fileRef, blob);

		// blob.close();
		let imgUrl = await getDownloadURL(fileRef);
		setImageURL(imgUrl);

		//set postContent to ImageURl hook in future, for some reason ImageUrl keeps coming back empty
		PostContent(imgUrl);
		return imgUrl;
	}

	return (
		<>
			<Modal
				animationType="slide"
				transparent={false}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{modalText}</Text>
						<TouchableOpacity
							style={[styles.button, styles.buttonClose]}
							onPress={() => {
								setModalVisible(!modalVisible);
								navigation.navigate('Newsfeed');
							}}
						>
							<Text style={styles.textStyle}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<View>
				<TextInput
					onChangeText={(text) => {
						setPostContent(text);
					}}
					placeholder="Write your post here"
				></TextInput>
				<StatusBar style="auto" />
			</View>

			{isLoading && <ActivityIndicator size="large" />}

			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				{image && (
					<Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
				)}
				<TouchableOpacity onPress={pickImage}>
					<Text>Upload Image</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity>
				<Text onPress={handleSelectedImage}>Post</Text>
			</TouchableOpacity>
		</>
	);
};

export default CreatePost;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});
