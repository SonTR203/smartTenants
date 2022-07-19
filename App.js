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
import { AppProvider } from "./Context/AppContext";
import Splashscreen from "./Screens/Splashscreen/Splashscreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  NewsfeedNavigator,
  ProfileNavigator,
  NotificationNavigator,
  MarketplaceNavigator,
} from "./Screens/customNavigator.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActionSheetProvider,
  connectActionSheet,
} from "@expo/react-native-action-sheet";
import { View } from "react-native";
import NotificationBadge from "./components/NotificationBadge";

const Tab = createBottomTabNavigator();

function App() {
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
    <ActionSheetProvider>
      <ThemeProvider>
        <AppProvider>
          {showSplashscreen ? (
            <Splashscreen />
          ) : (
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName="NewsfeedNavigator"
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused }) => {
                    let iconName;
                    let color;
                    if (route.name === "MarketplaceNavigator") {
                      iconName = "store";
                      color = focused ? "#395E66" : "#395E6654";
                    } else if (route.name === "NewsfeedNavigator") {
                      iconName = "newspaper";
                      color = focused ? "#395E66" : "#395E6654";
                    } else if (route.name === "NotificationsNavigator") {
                      iconName = "bell";
                      color = focused ? "#395E66" : "#395E6654";
                    } else if (route.name === "ProfileNavigator") {
                      iconName = "account";
                      color = focused ? "#395E66" : "#395E6654";
                    }
                    return (
                      <View>
                        <MaterialCommunityIcons
                          name={iconName}
                          size={28}
                          color={color}
                        />
                        <NotificationBadge screen={route.name} />
                      </View>
                    );
                  },

                  headerShown: false,
                  tabBarActiveTintColor: "#395E66",
                })}
              >
                {/* ======= Marketplace ======= */}
                <Tab.Screen
                  name="MarketplaceNavigator"
                  component={MarketplaceNavigator}
                  options={{
                    title: "Marketplace",
                    headerShown: false,
                    tabBarLabelStyle: {
                      fontSize: 12,
                      paddingBottom: 2,
                    },
                  }}
                />

                {/* ======= Newsfeed ======= */}
                <Tab.Screen
                  name="NewsfeedNavigator"
                  component={NewsfeedNavigator}
                  options={({ route }) => ({
                    title: "Newsfeed",
                    left: { display: "none" },
                    tabBarLabelStyle: {
                      fontSize: 12,
                      paddingBottom: 2,
                    },
                    tabBarStyle: {
                      display: getRouteName(route)
                        ? getRouteName(route)
                        : "none",
                    },
                  })}
                />

                {/* ======= Notifications ======= */}
                <Tab.Screen
                  name="NotificationsNavigator"
                  component={NotificationNavigator}
                  options={{
                    title: "Notifications",
                    tabBarLabelStyle: {
                      fontSize: 12,
                      paddingBottom: 2,
                    },
                  }}
                />

                {/* ======= Profile ======= */}
                <Tab.Screen
                  name="ProfileNavigator"
                  component={ProfileNavigator}
                  options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarLabelStyle: {
                      fontSize: 12,
                      paddingBottom: 2,
                    },
                  }}
                  tabBarOptions={{
                    display: "none",
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          )}
        </AppProvider>
      </ThemeProvider>
    </ActionSheetProvider>
  );
}

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName?.includes("Login") ||
    routeName?.includes("Signup") ||
    routeName?.includes("AccountApprovalPending") ||
    routeName?.includes("ForgotPassword") ||
    routeName?.includes("TermsAndConditions")
  ) {
    return "none";
  } else if (routeName == undefined) {
    return "none";
  }
  return "flex";
};

const ConnectedApp = connectActionSheet(App);

export default ConnectedApp;
