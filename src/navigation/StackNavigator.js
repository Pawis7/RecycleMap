import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screens/homeScreen";
import { LoginScreen } from "../auth/LoginScreen";
import { RegisterScreen } from "../auth/registerScreen";
import { supabase } from "../dataBase/supabase";
import BottomTabs from "./BottomTabs";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import SearchModal from "../components/SearchModal";
import EditProfile from "../screens/SettingsScreens/EditProfile";
import ChangePassword from "../screens/SettingsScreens/ChangePassword";
import Notifications from "../screens/SettingsScreens/Notifications";
import ManageUsers from "../screens/SettingsScreens/ManageUsers";
import ManageArticles from "../screens/SettingsScreens/ManageArticles";
// Import the new screens
import About from "../screens/SettingsScreens/About";
import Help from "../screens/SettingsScreens/Help";
import PrivacyPolicy from "../screens/SettingsScreens/PrivacyPolicy";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("isLogged");

        if (loggedIn === "true") {
          const userData = await AsyncStorage.getItem("userData");

          if (!userData) {
            await AsyncStorage.removeItem("isLogged");
            setIsLogged(false);
            return;
          }

          const { refresh_token } = JSON.parse(userData);

          if (!supabase || !supabase.auth) {
            await AsyncStorage.removeItem("isLogged");
            setIsLogged(false);
            return;
          }

          const { data, error } = await supabase.auth.refreshSession({
            refresh_token,
          });

          if (error) {
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("isLogged");
            setIsLogged(false);
            return;
          }

          const { data: userInfo, error: userError } = await supabase
            .from("users")
            .select("nombre, role, avatar") // Include the avatar field
            .eq("id", data.user.id)
            .single();

          if (userError) {
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("isLogged");
            setIsLogged(false);
            return;
          }

          await AsyncStorage.setItem(
            "userData",
            JSON.stringify({
              email: data.user.email,
              id: data.user.id,
              nombre: userInfo.nombre,
              role: userInfo.role, // Save the user's role
              avatar: userInfo.avatar, // Save the avatar URL
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          );

          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLogged === null) {
    return null; // O un loading spinner si quieres
  }

  // Determine initial route based on login status
  const initialRouteName = isLogged ? "Main" : "Home";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchModal"
        component={SearchModal}
        options={{
          headerShown: false,
          presentation: "modal",
          animationTypeForReplace: "fade",
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageArticles"
        component={ManageArticles}
        options={{ headerShown: false }}
      />
      {/* Add the new screens */}
      <Stack.Screen
        name="About"
        component={About}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
