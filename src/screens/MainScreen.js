import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import MapZoomableView from "../components/MapZoomableView"
import { getUserName } from "../Hooks/userUtils"
import { getArticles } from "../dataBase/getArticles" // Import the fetch function
import SearchModal from "../components/SearchModal" // Ensure SearchModal is imported if not already

const { width, height } = Dimensions.get("window")

export const MainScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([])
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [categories, setCategories] = useState(["Todos"]) // Initialize with "Todos"
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [searchModalKey, setSearchModalKey] = useState(0) // Añadir esta línea
  const [userName, setUserName] = useState("Usuario")

  useEffect(() => {
    fetchInitialData() // Renamed function for clarity
    fetchUserName()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const result = await getArticles({ orderBy: "date", ascending: false }) // Fetch all articles sorted by date
      if (result.success && result.data) {
        // Apply custom sorting: isNew > featured > date
        const fetchedArticles = result.data.sort(sortArticlesByPriority)
        setArticles(fetchedArticles)

        // Set featured articles (still apply the same sorting within featured)
        const featured = fetchedArticles.filter((article) => article.featured).sort(sortArticlesByPriority)
        setFeaturedArticles(featured)

        // Set categories dynamically
        const uniqueCategories = [...new Set(fetchedArticles.map((article) => article.category))]
        setCategories(["Todos", ...uniqueCategories])
      } else {
        console.error("Error fetching articles:", result.error)
        Alert.alert("Error", "No se pudieron cargar los artículos.")
        // Keep existing state or set to empty arrays
        setArticles([])
        setFeaturedArticles([])
        setCategories(["Todos"])
      }
    } catch (error) {
      console.error("Error in fetchInitialData:", error)
      Alert.alert("Error", "Ocurrió un error al cargar los artículos.")
    } finally {
      setLoading(false)
      setRefreshing(false) // Also reset refreshing state if applicable
    }
  }

  const fetchUserName = async () => {
    try {
      const name = await getUserName()
      setUserName(name || "Usuario")
    } catch (error) {
      console.error("Error fetching user name:", error)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchInitialData() // Fetch data again on refresh
  }

  const handleArticlePress = (article) => {
    // Ensure the full article object (with camelCase names) is passed
    navigation.navigate("ArticleDetail", { article })
  }

  // Enhanced helper function to parse Spanish format dates (e.g., "23 ABR 2025")
  const parseSpanishDate = (dateStr) => {
    if (!dateStr) return new Date(0); // Handle empty dates

    try {
      if (dateStr.includes('-')) {
        return new Date(dateStr);
      }

      // Spanish month abbreviations to numbers (including lowercase variants)
      const monthMap = {
        'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
        'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11,
        'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
      };

      // Split the date string
      const parts = dateStr.split(' ');

      // Check if we have the expected format
      if (parts.length !== 3) {
        return new Date(dateStr); // Fallback to standard parsing
      }

      const day = parseInt(parts[0], 10);
      const month = monthMap[parts[1].toUpperCase()] || monthMap[parts[1].toLowerCase()];
      const year = parseInt(parts[2], 10);

      if (isNaN(day) || month === undefined || isNaN(year)) {
        return new Date(0);
      }

 
      // Return a proper Date object
      return new Date(year, month, day);
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return new Date(0); // Return oldest possible date on error
    }
  };

  // Improved helper function to sort articles by isNew, featured and date
  const sortArticlesByPriority = (a, b) => {
    // First priority: isNew (new items first)
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    // Second priority: featured (featured items first)
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Third priority: date (newer items first)
    try {
      // Parse dates properly using our custom function
      const dateA = parseSpanishDate(a.date);
      const dateB = parseSpanishDate(b.date);

      // Log the comparison for debugging
      if (a.date && b.date) {
      }

      // Sort by time value (newer dates first)
      return dateB.getTime() - dateA.getTime();
    } catch (error) {
      console.error("Error comparing dates:", error);
      return 0; // No change in order if there's an error
    }
  };

  const filterArticlesByCategory = () => {
    // Apply the same sorting to filtered results
    if (selectedCategory === "Todos") {
      return [...articles]; // Return a copy to avoid modifying the original
    }
    return articles
      .filter((article) => article.category === selectedCategory)
      .sort(sortArticlesByPriority);
  }

  const handleOpenSearch = () => {
    setSearchModalKey((prevKey) => prevKey + 1) // Incrementar la key para forzar re-renderizado
    setSearchModalVisible(true)
  }

  const handleCloseSearch = () => {
    setSearchModalVisible(false)
  }

  // Add the missing renderGridItem function
  const renderGridItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.gridItem, { marginLeft: index % 2 === 0 ? 20 : 10, marginRight: index % 2 === 0 ? 10 : 20 }]}
      activeOpacity={0.9}
      onPress={() => handleArticlePress(item)}
    >
      <View style={styles.gridImageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.gridImage} resizeMode="cover" />
        {item.isNew && (
          <View style={styles.gridNewBadge}>
            <Text style={styles.gridNewText}>NUEVO</Text>
          </View>
        )}
      </View>
      <View style={styles.gridContent}>
        <View style={styles.gridCategoryContainer}>
          <Text style={styles.gridCategory}>{item.category}</Text>
        </View>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.gridMeta}>
          <MaterialCommunityIcons name="calendar" size={12} color="#999" />
          <Text style={styles.gridMetaText}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />

      {/* Header personalizado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#FF0000" />
              <Text style={styles.location}>CUCEI, UdeG</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleOpenSearch}>
            <MaterialCommunityIcons name="magnify" size={22} color="#ff0000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF0000"]} />}
      >
        {/* Mapa con zoom por pellizco */}
        <View style={styles.mapContainer}>
          <MapZoomableView mapSource={require("../../assets/mapa.png")} />
        </View>

        {/* Sección de artículos destacados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Artículos Destacados</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF0000" style={styles.loader} />
        ) : (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }}
            >
              {featuredArticles.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No hay artículos destacados disponibles</Text>
                </View>
              ) : (
                featuredArticles.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 15 }]}
                    activeOpacity={0.9}
                    onPress={() => handleArticlePress(item)}
                  >
                    <ImageBackground
                      source={{ uri: item.imageUrl }}
                      style={styles.featuredImage}
                      imageStyle={styles.featuredImageStyle}
                    >
                      <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.featuredGradient}>
                        <View style={styles.featuredContent}>
                          <View style={styles.featuredCategoryContainer}>
                            <Text style={styles.featuredCategory}>{item.category}</Text>
                          </View>
                          <Text style={styles.featuredTitle} numberOfLines={2}>
                            {item.title}
                          </Text>
                          <View style={styles.featuredMeta}>
                            <MaterialCommunityIcons name="calendar-outline" size={14} color="#fff" />
                            <Text style={styles.featuredMetaText}>{item.date}</Text>
                            <MaterialCommunityIcons name="eye-outline" size={14} color="#fff" style={{ marginLeft: 10 }} />
                            <Text style={styles.featuredMetaText}>{item.views}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                      {item.isNew && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>Nuevo</Text>
                        </View>
                      )}
                    </ImageBackground>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* Filtro por categorías */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                  { marginLeft: index === 0 ? 0 : 10 },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[styles.categoryButtonText, selectedCategory === category && styles.categoryButtonTextActive]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de todos los artículos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explora Artículos</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF0000" style={styles.loader} />
        ) : (
          <FlatList
            data={filterArticlesByCategory()}
            keyExtractor={(item) => item.id}
            renderItem={renderGridItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay artículos disponibles</Text>
              </View>
            }
          />
        )}
      </ScrollView>

      {/* Modal de búsqueda */}
      <SearchModal
        key={searchModalKey} // Añadir esta prop
        visible={searchModalVisible}
        onClose={handleCloseSearch}
        articles={articles}
        onSelectArticle={handleArticlePress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Fondo negro
  },
  header: {
    backgroundColor: "#111111", // Fondo negro
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff", // Texto blanco
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: "#FF0000", // Texto rojo
    marginLeft: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(211, 52, 52, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapContainer: {
    margin: 20,
    marginBottom: 25,
    borderRadius: 16,
    overflow: "hidden",
    height: height * 0.3, // Aumentar la altura para aprovechar mejor el espacio
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#111111", // Fondo negro
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff", // Texto blanco
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF0000", // Texto rojo
    fontWeight: "600",
  },
  featuredCard: {
    width: width * 0.75,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredImageStyle: {
    borderRadius: 16,
  },
  featuredGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    justifyContent: "flex-end",
    borderRadius: 16,
  },
  featuredContent: {
    padding: 15,
  },
  featuredCategoryContainer: {
    backgroundColor: "#FF0000", // Fondo rojo
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  featuredCategory: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredMetaText: {
    color: "#fff", // Texto blanco
    fontSize: 12,
    marginLeft: 4,
  },
  newBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    color: "#333",
    fontSize: 10,
    fontWeight: "700",
  },
  categoriesContainer: {
    marginVertical: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#222222", // Fondo oscuro
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryButtonActive: {
    backgroundColor: "#FF0000", // Fondo rojo
    borderColor: "#FF0000",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#aaaaaa", // Texto gris claro
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#ffffff", // Texto blanco
    fontWeight: "600",
  },
  gridItem: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#111111", // Fondo negro
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  gridImageContainer: {
    height: 120,
    width: "100%",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridNewBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFD700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridNewText: {
    color: "#333",
    fontSize: 8,
    fontWeight: "700",
  },
  gridContent: {
    padding: 12,
  },
  gridCategoryContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  gridCategory: {
    color: "#FF0000", // Texto rojo
    fontSize: 10,
    fontWeight: "600",
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff", // Texto blanco
    marginBottom: 4,
    lineHeight: 18,
  },
  gridMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  gridMetaText: {
    fontSize: 12,
    color: "#aaaaaa", // Texto gris claro
    marginLeft: 4,
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    width: width - 40,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
})

export default MainScreen
