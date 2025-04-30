import { supabase } from "./supabase";

export async function signUp(email: string, password: string, nombre: string) {
  try {
    console.log("Registrando en Supabase Auth:", email, password);

    // 🔹 Registrar usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("Respuesta de Supabase Auth:", data, error);

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: "No se pudo registrar el usuario." };
    }

    console.log("Guardando en la tabla 'users'...", nombre);

    const { data: insertedData, error: dbError } = await supabase.from("users").insert([
      {
        id: data.user.id, // Ensure this matches the ID from Supabase Auth
        nombre: nombre,
        email: email,
        avatar: null, // Initialize avatar as null
      },
    ]).select(); // Use `.select()` to return the inserted data for verification

    if (dbError) {
      console.error("Error al insertar en la tabla 'users':", dbError);
      console.error("Datos enviados a la tabla 'users':", {
        id: data.user.id,
        nombre: nombre,
        email: email,
      });
      return { success: false, message: "Usuario creado, pero no guardado en la BD." };
    }

    console.log("Datos insertados en la tabla 'users':", insertedData); // Log the inserted data for verification

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Error inesperado durante el registro:", err); // Log unexpected errors
    return { success: false, message: "Ocurrió un error inesperado." };
  }
}