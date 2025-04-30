import { supabase } from "./supabase";

// Interface defining the structure of the article data to be updated
// It's similar to create, but might not require all fields if only some are updated
// For simplicity, we'll use a similar structure, assuming most fields can change.
interface ArticleUpdatePayload {
  title?: string;
  description?: string | null;
  image_url?: string;
  content?: string;
  category?: string;
  featured?: boolean;
  is_new?: boolean;
  date?: string;
}

// Function to update an existing article in the Supabase 'articles' table
export async function updateArticle(id: string | number, payload: ArticleUpdatePayload): Promise<{ success: boolean; error?: any }> {
  if (!id) {
    console.error("Update error: Article ID is required.");
    return { success: false, error: new Error("Article ID is required.") };
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .update(payload) // Update with the provided payload
      .eq('id', id);   // Match the specific article ID

    if (error) {
      console.error("Supabase error updating article:", error);
      throw error;
    }

    return { success: true };

  } catch (error) {
    console.error("Error in updateArticle function:", error);
    return { success: false, error: error };
  }
}
