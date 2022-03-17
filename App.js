import { StyleSheet } from 'react-native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { ThemeProvider } from './ThemeContext';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Notifications from './Screens/Notifications/Notifications';
import Marketplace from './Screens/Marketplace/Marketplace';
import Profile from './Screens/ProfilePage/ProfileGeneral/ProfileGeneral';
import {
	NewsfeedNavigator,
	LoginNavigator,
} from './Screens/customNavigator.js';

// Import building for testing
// import BuildingInfo from './Screens/BuildingInfo/BuildingInfo'

const Tab = createBottomTabNavigator();

export default function App() {
	const [resourcesLoaded, setResourcesLoaded] = useState(false);

	let [fontLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_500Medium,
		Roboto_700Bold,
	});

	const getResources = () => {
		if (fontLoaded) {
			Promise.resolve();
		}
	};

	if (resourcesLoaded) {
		return <AppContainer />;
	} else {
		return (
			<AppLoading
				startAsync={getResources}
				onFinish={() => {
					//minimum timeout for 2s so that we can see splashscreen
					setTimeout(() => {
						setResourcesLoaded(true);
					}, 2000);
				}}
				onError={console.warn}
			/>
		);
	}
}

function AppContainer() {
	return (
		<ThemeProvider>
			<NavigationContainer>
				<Tab.Navigator initialRouteName="Newsfeed ">
					{/* ======= Login ======= */}
					<Tab.Screen
						name="Login "
						component={LoginNavigator}
						options={{ headerShown: false }}
					/>

					{/* ======= Marketplace ======= */}
					<Tab.Screen
						name="Marketplace "
						component={Marketplace}
						options={{ headerShown: false }}
					/>

					{/* ======= Newsfeed ======= */}
					<Tab.Screen
						name="Newsfeed "
						component={NewsfeedNavigator}
						options={{ headerShown: false }}
					/>

					{/* ======= Notifications ======= */}
					<Tab.Screen
						name="Notifications "
						component={Notifications}
						options={{ headerShown: false }}
					/>

					{/* ======= Profile ======= */}
					<Tab.Screen
						name="Profile "
						component={Profile}
						options={{ headerShown: false }}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
