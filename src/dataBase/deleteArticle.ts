import { supabase } from "./supabase";

// Function to delete an article from the Supabase 'articles' table
export async function deleteArticle(id: string | number): Promise<{ success: boolean; error?: any }> {
  if (!id) {
    console.error("Delete error: Article ID is required.");
    return { success: false, error: new Error("Article ID is required.") };
  }

  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id); // Match the specific article ID

    if (error) {
      console.error("Supabase error deleting article:", error);
      throw error;
    }

    return { success: true };

  } catch (error) {
    console.error("Error in deleteArticle function:", error);
    return { success: false, error: error };
  }
}
