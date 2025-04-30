import { supabase } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function updateUserName(nombre: string, avatar: string | null) {
  try {
    const userDataString = await AsyncStorage.getItem("userData");
    if (!userDataString) {
      return { success: false, message: "No se encontró información del usuario localmente" };
    }

    const userData = JSON.parse(userDataString);

    const userId = userData.id;
    if (!userId) {
      return { success: false, message: "El ID del usuario es inválido. Intente iniciar sesión nuevamente." };
    }

    const { data, error } = await supabase
      .from("users")
      .update({ nombre, avatar }) 
      .eq("id", userId);

    if (error) {
      return { success: false, message: "No se pudo actualizar el nombre y el avatar en la base de datos" };
    }


    await AsyncStorage.setItem("userData", JSON.stringify({ ...userData, nombre, avatar }));

    return { success: true };
  } catch (err) {
    return { success: false, message: "Ocurrió un error inesperado" };
  }
}
