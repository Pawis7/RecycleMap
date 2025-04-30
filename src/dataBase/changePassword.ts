import { supabase } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Cambia la contraseña del usuario autenticado.
 * @param {string} currentPassword - La contraseña actual del usuario.
 * @param {string} newPassword - La nueva contraseña que se desea establecer.
 * @returns {Promise<{ success: boolean, message?: string }>} - Resultado de la operación.
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const userDataString = await AsyncStorage.getItem("userData");
    if (!userDataString) {
      return { success: false, message: "No se encontró información del usuario localmente" };
    }

    const userData = JSON.parse(userDataString);
    const email = userData.email;

    if (!email) {
      return { success: false, message: "El correo del usuario es inválido. Intente iniciar sesión nuevamente." };
    }

    // Intentar iniciar sesión para verificar la contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, message: "La contraseña actual es incorrecta." };
    }

    // Actualizar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { success: false, message: "No se pudo actualizar la contraseña." };
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: "Ocurrió un error inesperado." };
  }
}