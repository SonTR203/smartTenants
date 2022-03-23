import { StyleSheet } from 'react-native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'
import { ThemeProvider } from './ThemeContext'
import AppLoading from 'expo-app-loading'
import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Notifications from './Screens/Notifications/Notifications'
import Marketplace from './Screens/Marketplace/Marketplace'
import Profile from './Screens/ProfilePage/ProfileGeneral/ProfileGeneral'
import { NewsfeedNavigator } from './Screens/customNavigator.js'
import { AppProvider } from './Context/AppContext'
import Splashscreen from './Screens/Splashscreen/Splashscreen'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

const Tab = createBottomTabNavigator()
let globalShowSplashscreen
let globalSetShowSplashscreen

export default function App () {
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const [showSplashscreen, setShowSplashscreen] = useState(true)
  globalShowSplashscreen = showSplashscreen
  globalSetShowSplashscreen = setShowSplashscreen

  let [fontLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  })

  const getResources = () => {
    if (fontLoaded) {
      Promise.resolve()
    }
  }

  if (resourcesLoaded) {
    return <AppContainer />
  } else {
    return (
      <AppLoading
        startAsync={getResources}
        onFinish={() => {
          setResourcesLoaded(true)
        }}
        onError={console.warn}
      />
    )
  }
}

function AppContainer () {
  setTimeout(() => {
    globalSetShowSplashscreen(false)
  }, 2000)
  return (
    <ThemeProvider>
      <AppProvider>
        {globalShowSplashscreen ? (
          <Splashscreen />
        ) : (
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName='Newsfeed '
              screenOptions={{ headerShown: false }}
            >
              {/* ======= Marketplace ======= */}
              <Tab.Screen name='Marketplace ' component={Marketplace} />

              {/* ======= Newsfeed ======= */}
              <Tab.Screen
                name='Newsfeed '
                component={NewsfeedNavigator}
                options={({ route }) => ({
                  left: { display: 'none' },
                  tabBarStyle: {
                    display: getRouteName(route) ? getRouteName(route) : 'none'
                  }
                })}
              />

              {/* ======= Notifications ======= */}
              <Tab.Screen name='Notifications ' component={Notifications} />

              {/* ======= Profile ======= */}
              <Tab.Screen
                name='Profile '
                component={Profile}
                tabBarOptions={{
                  display: 'none'
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </AppProvider>
    </ThemeProvider>
  )
}

const getRouteName = route => {
  const routeName = getFocusedRouteNameFromRoute(route)
  console.log(routeName)
  if (
    routeName?.includes('Login') ||
    routeName?.includes('Signup') ||
    routeName?.includes('AccountApprovalPending')
  ) {
    return 'none'
  } else if (routeName == undefined) {
    return 'none'
  }
  return 'flex'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
