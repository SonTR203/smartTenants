import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { ThemeProvider } from "./ThemeContext";
import AppLoading from "expo-app-loading";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Marketplace from "./Screens/Marketplace/Marketplace";
import { AppProvider } from "./Context/AppContext";
import Splashscreen from "./Screens/Splashscreen/Splashscreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  NewsfeedNavigator,
  ProfileNavigator,
  NotificationNavigator,
} from "./Screens/customNavigator.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader from "./components/ScreenHeader";

const Tab = createBottomTabNavigator();

export default function App() {
  const [showSplashscreen, setShowSplashscreen] = useState(true);

  let [fontLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <AppContainer
      showSplashscreen={showSplashscreen}
      setShowSplashscreen={setShowSplashscreen}
    />
  );
}

function AppContainer({ showSplashscreen, setShowSplashscreen }) {
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplashscreen(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider>
      <AppProvider>
        {showSplashscreen ? (
          <Splashscreen />
        ) : (
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Newsfeed "
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                  let iconName;
                  let color;
                  if (route.name === "Marketplace ") {
                    iconName = "store";
                    color = focused ? "#395E66" : "#395E6654";
                  } else if (route.name === "Newsfeed ") {
                    iconName = "newspaper";
                    color = focused ? "#395E66" : "#395E6654";
                  } else if (route.name === "Notifications ") {
                    iconName = "bell";
                    color = focused ? "#395E66" : "#395E6654";
                  } else if (route.name === "Profile ") {
                    iconName = "account";
                    color = focused ? "#395E66" : "#395E6654";
                  }
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={28}
                      color={color}
                    />
                  );
                },
                headerShown: false,
                tabBarActiveTintColor: "#395E66",
              })}
            >
              {/* ======= Marketplace ======= */}
              <Tab.Screen
                name="Marketplace "
                component={Marketplace}
                options={{
                  headerShown: true,
                  header: () => <ScreenHeader title={"Marketplace"} />,
                }}
              />

              {/* ======= Newsfeed ======= */}
              <Tab.Screen
                name="Newsfeed "
                component={NewsfeedNavigator}
                options={({ route }) => ({
                  left: { display: "none" },
                  tabBarStyle: {
                    display: getRouteName(route) ? getRouteName(route) : "none",
                  },
                })}
              />

              {/* ======= Notifications ======= */}
              <Tab.Screen
                name="Notifications "
                component={NotificationNavigator}
              />

              {/* ======= Profile ======= */}
              <Tab.Screen
                name="Profile "
                component={ProfileNavigator}
                options={{ headerShown: false }}
                tabBarOptions={{
                  display: "none",
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </AppProvider>
    </ThemeProvider>
  );
}

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName?.includes("Login") ||
    routeName?.includes("Signup") ||
    routeName?.includes("AccountApprovalPending") ||
    routeName?.includes("ForgotPassword")
  ) {
    return "none";
  } else if (routeName == undefined) {
    return "none";
  }
  return "flex";
};
