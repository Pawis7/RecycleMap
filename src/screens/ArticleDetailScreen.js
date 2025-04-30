import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRoute, useNavigation } from "@react-navigation/native"
import { getArticles } from "../dataBase/getArticles";
import { supabase } from "../dataBase/supabase"; // Import supabase for auth check

const { width, height } = Dimensions.get("window")

export const ArticleDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { article: initialArticle } = route.params

  // Ensure initialArticle uses camelCase if passed from MainScreen
  const [article, setArticle] = useState(initialArticle)
  const [loading, setLoading] = useState(false)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [isAdmin, setIsAdmin] = useState(false); // State for admin status

  useEffect(() => {
    // fetchArticleDetails might not be needed if full object is passed
    // fetchArticleDetails()
    fetchRelatedArticles()
    checkAdminStatus(); // Check admin status on load
    // Reset related articles when the main article changes (due to navigation.push)
    return () => setRelatedArticles([]);
  }, [article.id]) // Re-run fetchRelatedArticles if article.id changes

  const checkAdminStatus = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user?.id) {
        setIsAdmin(false);
        return;
      }
      const userId = sessionData.session.user.id;
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        setIsAdmin(false);
      } else {
        setIsAdmin(userData.role === 'admin');
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };


  // fetchArticleDetails remains largely the same for now, assuming full object passed
  const fetchArticleDetails = async () => {
    // En una implementación real, aquí obtendrías los detalles completos del artículo
    // Por ahora, usamos los datos que ya tenemos
    setLoading(true)
    try {
      // Simulación de carga
      setTimeout(() => {
        setLoading(false)
      }, 500)

      // Ejemplo de cómo sería con Supabase:
      /*
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', initialArticle.id)
        .single();
        
      if (error) throw error;
      if (data) setArticle(data);
      */
    } catch (error) {
      console.error("Error fetching article details:", error)
      setLoading(false)
    }
  }

  const fetchRelatedArticles = async () => {
    if (!article || !article.category || !article.id) return; // Need category and id

    const result = await getArticles({
      category: article.category,
      excludeId: article.id,
      limit: 3, // Fetch 3 related articles
      orderBy: 'date',
      ascending: false
    });

    if (result.success && result.data) {
      setRelatedArticles(result.data);
    } else {
      console.error("Error fetching related articles:", result.error);
      setRelatedArticles([]); // Set empty on error
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Echa un vistazo a este artículo: ${article.title} - EcoApp`,
        url: "https://ecoapp.com/articles/" + article.id, // URL ficticia
      })
    } catch (error) {
      console.error("Error sharing article:", error)
    }
  }

  // navigateToRelatedArticle needs to ensure the passed article object uses camelCase
  const navigateToRelatedArticle = (relatedArticle) => {
    // The relatedArticle fetched from getArticles already uses camelCase
    navigation.push("ArticleDetail", { article: relatedArticle })
  }

  const navigateToEditArticle = () => {
    // Pass the current article data to the ManageArticles screen for editing
    navigation.navigate("ManageArticles", { articleToEdit: article });
  }


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    )
  }

  // The rendering part should already use camelCase props (article.imageUrl, article.isNew, etc.)
  // Double-check if any part was missed.
  return (
    <ScrollView style={styles.container}>
      {/* Imagen de cabecera */}
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: article.imageUrl }} style={styles.headerImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
        </TouchableOpacity>
        {/* Add Edit Button for Admins */}
        {isAdmin && (
          <TouchableOpacity style={styles.editButton} onPress={navigateToEditArticle}>
            <MaterialCommunityIcons name="pencil" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido del artículo */}
      <View style={styles.contentContainer}>
        {/* Encabezado */}
        <View style={styles.articleHeader}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar" size={16} color="#666" />
              <Text style={styles.metaText}>{article.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="eye-outline" size={16} color="#666" />
              {/* Display views if available, otherwise maybe hide */}
              {article.views !== undefined && <Text style={styles.metaText}>{article.views} vistas</Text>}
            </View>
          </View>
        </View>

        {/* Cuerpo del artículo */}
        <View style={styles.articleBody}>
          <Text style={styles.articleContent}>
            {article.content /* Use fetched content */}
          </Text>
        </View>

        {/* Artículos relacionados */}
        {relatedArticles.length > 0 && (
          <View style={styles.relatedArticlesSection}>
            <Text style={styles.relatedTitle}>Artículos Relacionados</Text>
            <View style={styles.relatedList}>
              {relatedArticles.map((relatedArticle) => (
                <TouchableOpacity
                  key={relatedArticle.id}
                  style={styles.relatedItem}
                  onPress={() => navigateToRelatedArticle(relatedArticle)}
                >
                  {/* Ensure relatedArticle uses camelCase */}
                  <Image source={{ uri: relatedArticle.imageUrl }} style={styles.relatedImage} />
                  <View style={styles.relatedContent}>
                    <Text style={styles.relatedItemTitle} numberOfLines={2}>
                      {relatedArticle.title}
                    </Text>
                    <Text style={styles.relatedItemCategory}>{relatedArticle.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerImageContainer: {
    position: "relative",
    height: height * 0.4,
    width: "100%",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    position: "absolute",
    top: 40,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: { // Style for the edit button
    position: "absolute",
    top: 40,
    right: 65, // Position it next to the share button
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  articleHeader: {
    marginBottom: 20,
  },
  category: {
    fontSize: 14,
    color: "#34D399",
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  articleBody: {
    marginBottom: 24,
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  relatedArticlesSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  relatedList: {
    marginHorizontal: -8,
  },
  relatedItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
  },
  relatedImage: {
    width: 80,
    height: 80,
  },
  relatedContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  relatedItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  relatedItemCategory: {
    fontSize: 12,
    color: "#666",
  },
})

export default ArticleDetailScreen
