import { supabase } from "./supabase";

export async function signUp(email: string, password: string, nombre: string) {
  try {
    console.log("Registering in Supabase Auth:", email, password);

    // 🔹 Register the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("Supabase Auth response:", data, error);

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: "User registration failed." };
    }

    console.log("Saving to the 'users' table...", nombre);

    // Insert user details into the 'users' table
    const { data: insertedData, error: dbError } = await supabase.from("users").insert([
      {
        id: data.user.id, // User ID from Supabase Auth
        nombre: nombre, // User's name
        email: email, // User's email
        avatar: null, // Avatar is initialized as null
      },
    ]).select(); // Use `.select()` to retrieve the inserted data for verification

    if (dbError) {
      console.error("Error inserting into the 'users' table:", dbError);
      console.error("Data sent to the 'users' table:", {
        id: data.user.id,
        nombre: nombre,
        email: email,
      });
      return { success: false, message: "User created, but not saved in the database." };
    }

    console.log("Data inserted into the 'users' table:", insertedData); // Log the inserted data for verification

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Unexpected error during registration:", err); // Log unexpected errors
    return { success: false, message: "An unexpected error occurred." };
  }
}