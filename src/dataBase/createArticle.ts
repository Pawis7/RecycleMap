import { supabase } from "./supabase";

// Interface defining the structure of the article data to be saved
interface ArticlePayload {
  title: string;
  description: string | null;
  image_url: string;
  content: string;
  category: string;
  featured: boolean;
  is_new: boolean;
  date: string; // Add date field
  // Note: id, views are handled by the database
}

// Function to insert a new article into the Supabase 'articles' table
export async function createArticle(payload: ArticlePayload): Promise<{ success: boolean; error?: any }> {
  try {
    // The payload now includes the date field
    const { data, error } = await supabase
      .from('articles')
      .insert([payload]) // Insert the provided payload (including date)
      .select();

    if (error) {
      console.error("Supabase error creating article:", error);
      // Re-throw the specific Supabase error for detailed handling
      throw error;
    }

    return { success: true };

  } catch (error) {
    console.error("Error in createArticle function:", error);
    // Return a generic failure state with the error object
    return { success: false, error: error };
  }
}
