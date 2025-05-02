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
import { getArticles } from "../dataBase/getArticles"
import { supabase } from "../dataBase/supabase"

const { width, height } = Dimensions.get("window")

export const ArticleDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { article: initialArticle } = route.params

  const [article, setArticle] = useState(initialArticle)
  const [loading, setLoading] = useState(false)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchRelatedArticles()
    checkAdminStatus()
    return () => setRelatedArticles([])
  }, [article.id])

  const checkAdminStatus = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData?.session?.user?.id) {
        setIsAdmin(false)
        return
      }
      const userId = sessionData.session.user.id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      setIsAdmin(!userError && userData?.role === 'admin')
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    }
  }

  const fetchRelatedArticles = async () => {
    if (!article || !article.category || !article.id) return

    const result = await getArticles({
      category: article.category,
      excludeId: article.id,
      limit: 3,
      orderBy: 'date',
      ascending: false
    })

    if (result.success && result.data) {
      setRelatedArticles(result.data)
    } else {
      console.error("Error fetching related articles:", result.error)
      setRelatedArticles([])
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Echa un vistazo a este artículo: ${article.title} - EcoApp`,
        url: "https://ecoapp.com/articles/" + article.id,
      })
    } catch (error) {
      console.error("Error sharing article:", error)
    }
  }

  const navigateToRelatedArticle = (relatedArticle) => {
    navigation.push("ArticleDetail", { article: relatedArticle })
  }

  const navigateToEditArticle = () => {
    navigation.navigate("ManageArticles", { articleToEdit: article })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: article.imageUrl }} style={styles.headerImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity style={styles.editButton} onPress={navigateToEditArticle}>
            <MaterialCommunityIcons name="pencil" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.articleHeader}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar" size={16} color="#aaa" />
              <Text style={styles.metaText}>{article.date}</Text>
            </View>
            {article.views !== undefined && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="eye-outline" size={16} color="#aaa" />
                <Text style={styles.metaText}>{article.views} vistas</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.articleBody}>
          <Text style={styles.articleContent}>{article.content}</Text>
        </View>

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
    backgroundColor: "#111111",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
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
  editButton: {
    position: "absolute",
    top: 40,
    right: 65,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#111111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  articleHeader: {
    marginBottom: 20,
  },
  category: {
    fontSize: 14,
    color: "#FF0000",
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
    color: "#aaa",
    marginLeft: 4,
  },
  articleBody: {
    marginBottom: 24,
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ddd",
  },
  relatedArticlesSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  relatedList: {
    marginHorizontal: -8,
  },
  relatedItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#1a1a1a",
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
    color: "#fff",
    marginBottom: 4,
  },
  relatedItemCategory: {
    fontSize: 12,
    color: "#FF0000",
  },
})

export default ArticleDetailScreen
