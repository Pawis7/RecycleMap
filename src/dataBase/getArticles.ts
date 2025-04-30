import { supabase } from "./supabase";

// Interface for the expected structure of fetched article data
// Matches the component props (camelCase) after mapping
export interface Article {
  id: string | number; // Supabase ID might be number or string depending on config
  title: string;
  description: string | null;
  imageUrl: string; // Mapped from image_url
  date: string;
  views: number;
  featured: boolean;
  isNew: boolean; // Mapped from is_new
  content: string;
  category: string;
}

interface FetchArticlesParams {
  limit?: number;
  category?: string;
  excludeId?: string | number;
  featuredOnly?: boolean;
  orderBy?: string;
  ascending?: boolean;
}

// Function to fetch articles from Supabase with optional filters and sorting
export async function getArticles(params: FetchArticlesParams = {}): Promise<{ success: boolean; data?: Article[]; error?: any }> {
  try {
    let query = supabase
      .from('articles')
      .select('id, title, description, image_url, date, views, featured, is_new, content, category'); // Select snake_case columns

    // Apply filters
    if (params.category) {
      query = query.eq('category', params.category);
    }
    if (params.excludeId) {
      query = query.neq('id', params.excludeId);
    }
    if (params.featuredOnly) {
      query = query.eq('featured', true);
    }

    // Apply sorting (default: date descending)
    const orderByField = params.orderBy || 'date'; // Assuming 'date' can be sorted directly or is a timestamp
    const ascendingOrder = params.ascending || false;
    query = query.order(orderByField, { ascending: ascendingOrder });

    // Apply limit
    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching articles:", error);
      throw error;
    }

    // Map snake_case to camelCase for component compatibility
    const mappedData: Article[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url, // Map image_url
      date: item.date,
      views: item.views,
      featured: item.featured,
      isNew: item.is_new, // Map is_new
      content: item.content,
      category: item.category,
    }));

    return { success: true, data: mappedData };

  } catch (error) {
    console.error("Error in getArticles function:", error);
    return { success: false, error: error };
  }
}
