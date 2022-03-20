import { View, Text, ActivityIndicator, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import React from 'react';
import { useAppContext } from '../../Context/AppContext';

const IndividualPosts = () => {
	const { post, setPost } = useAppContext();
	console.log(post);
	return (
		<View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
			<View className="postOwnerInfo" style={{ flexDirection: 'row' }}>
				<Image
					source={{ uri: `${post.userProfileImage}` }}
					style={{ width: 25, height: 25, borderRadius: 50 }}
				/>
				<Text style={{ marginTop: 3, marginLeft: 5 }}>
					{post.userFirstName} {post.userLastName}
				</Text>
			</View>

			<View className="postTextContent" style={{ margin: 10 }}>
				<Text>{post.postContent}</Text>
				{post.image != 'no image posted' && (
					<Image
						source={{
							uri: `${post.image}`,
						}}
						style={{ width: 330, height: 300 }}
					/>
				)}
			</View>
		</View>
	);
};

export default IndividualPosts;
