import { supabase } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function logIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.session) {
      return { success: false, message: "Could not log in." };
    }

    // Save session locally
    const { data: userInfo, error: userError } = await supabase
      .from("users")
      .select("nombre, role, avatar") // Include the avatar field
      .eq("id", data.user.id)
      .single();

    if (userError || !userInfo) {
      console.error("Error fetching user information:", userError);
      return { success: false, message: "Error fetching user information." };
    }

    const userData = {
      email: data.user.email,
      id: data.user.id,
      nombre: userInfo.nombre,
      role: userInfo.role, // Save the user's role
      avatar: userInfo.avatar, // Save the avatar URL
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };

    await AsyncStorage.setItem("userData", JSON.stringify(userData));

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, message: "Unexpected error during login." };
  }
}