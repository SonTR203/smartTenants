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
import { AppProvider } from './Context/AppContext';
import Splashscreen from './Screens/Splashscreen/Splashscreen';

const Tab = createBottomTabNavigator();
let globalShowSplashscreen;
let globalSetShowSplashscreen;

export default function App() {
	const [resourcesLoaded, setResourcesLoaded] = useState(false);
	const [showSplashscreen, setShowSplashscreen] = useState(true);
	globalShowSplashscreen = showSplashscreen;
	globalSetShowSplashscreen = setShowSplashscreen;

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
					setResourcesLoaded(true);
				}}
				onError={console.warn}
			/>
		);
	}
}

function AppContainer() {
	setTimeout(() => {
		globalSetShowSplashscreen(false);
	}, 2000);
	return (
		<ThemeProvider>
			<AppProvider>
				{globalShowSplashscreen ? (
					<Splashscreen />
				) : (
					<NavigationContainer>
						<Tab.Navigator initialRouteName="Login ">
							{/* ======= Login ======= */}
							<Tab.Screen
								name="Login "
								component={LoginNavigator}
								options={{
									headerShown: false,
									tabBarStyle: { display: 'none' },
								}}
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
								options={{
									headerShown: false,
								}}
								tabBarOptions={{
									display: 'none',
								}}
							/>
						</Tab.Navigator>
					</NavigationContainer>
				)}
			</AppProvider>
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
