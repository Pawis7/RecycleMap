import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Animated,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

const SearchModal = ({ visible, onClose, articles, onSelectArticle }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  // Animación para la entrada y salida del modal
  const slideAnim = useRef(new Animated.Value(visible ? 0 : height)).current
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current
  const inputRef = useRef(null)

  // Manejar la visibilidad del modal
  useEffect(() => {
    if (visible) {
      // Reset animation values before showing the modal
      slideAnim.setValue(height);
      opacityAnim.setValue(0);

      // Show the modal with animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Focus the input after the animation ends
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });

      // Reset states
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    } else {
      // Hide the modal with animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible])

  // Manejar el botón de retroceso en Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (visible) {
        if (Keyboard.isVisible()) {
          Keyboard.dismiss();
          setTimeout(() => inputRef.current?.blur(), 100); // Ensure TextInput loses focus after keyboard dismiss
          return true;
        }
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simular un pequeño retraso para mostrar el indicador de carga
    const timer = setTimeout(() => {
      const filteredResults = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filteredResults)
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, articles])

  const handleSearch = () => {
    Keyboard.dismiss()
    if (searchQuery.trim() !== "") {
      // Guardar en búsquedas recientes
      const updatedRecentSearches = [searchQuery, ...recentSearches.filter((item) => item !== searchQuery)].slice(0, 5)
      setRecentSearches(updatedRecentSearches)
    }
  }

  const handleSelectArticle = (article) => {
    onSelectArticle(article)
    onClose()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const handleSelectRecentSearch = (query) => {
    setSearchQuery(query)
  }

  // Si el modal no es visible, no renderizamos nada
  if (!visible) return null

  // Always render the modal but control its visibility with opacity and position
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton} onPress={onClose}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                  </TouchableOpacity>
                  <View style={styles.searchInputContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                      ref={inputRef}
                      style={styles.searchInput}
                      placeholder="Buscar artículos..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      returnKeyType="search"
                      onSubmitEditing={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
                        <MaterialCommunityIcons name="close-circle" size={16} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.content}>
                  {isSearching ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#34D399" />
                      <Text style={styles.loadingText}>Buscando...</Text>
                    </View>
                  ) : searchQuery.trim() === "" ? (
                    <View style={styles.emptyStateContainer}>
                      {recentSearches.length > 0 ? (
                        <View style={styles.recentSearchesContainer}>
                          <View style={styles.recentSearchesHeader}>
                            <Text style={styles.recentSearchesTitle}>Búsquedas recientes</Text>
                            <TouchableOpacity onPress={() => setRecentSearches([])}>
                              <Text style={styles.clearAllText}>Borrar todo</Text>
                            </TouchableOpacity>
                          </View>
                          {recentSearches.map((query, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.recentSearchItem}
                              onPress={() => handleSelectRecentSearch(query)}
                            >
                              <MaterialCommunityIcons name="history" size={18} color="#666" />
                              <Text style={styles.recentSearchText}>{query}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ) : (
                        <View style={styles.initialStateContainer}>
                          <MaterialCommunityIcons name="magnify" size={64} color="#ddd" />
                          <Text style={styles.initialStateText}>
                            Busca artículos por título, descripción o categoría
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : searchResults.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                      <MaterialCommunityIcons name="file-search-outline" size={64} color="#ddd" />
                      <Text style={styles.noResultsText}>No se encontraron resultados para "{searchQuery}"</Text>
                      <Text style={styles.noResultsSubtext}>Intenta con otra búsqueda</Text>
                    </View>
                  ) : (
                    <FlatList
                      data={searchResults}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectArticle(item)}>
                          <View style={styles.resultImageContainer}>
                            {item.imageUrl && (
                              <Image source={{ uri: item.imageUrl }} style={styles.resultImage} resizeMode="cover" />
                            )}
                          </View>
                          <View style={styles.resultContent}>
                            <Text style={styles.resultCategory}>{item.category}</Text>
                            <Text style={styles.resultTitle} numberOfLines={1}>
                              {item.title}
                            </Text>
                            <Text style={styles.resultDescription} numberOfLines={2}>
                              {item.description || ""}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.resultsList}
                    />
                  )}
                </View>
              </View>
            </SafeAreaView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark overlay
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#111111", // Dark background
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#111111", // Dark background
  },
  container: {
    flex: 1,
    backgroundColor: "#111111", // Dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222222", // Dark border
  },
  backButton: {
    padding: 10,
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222222", // Dark input background
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
    color: "#999", // Light gray icon
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff", // White text
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999", // Light gray text
  },
  emptyStateContainer: {
    flex: 1,
    padding: 16,
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  initialStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999", // Light gray text
    textAlign: "center",
    lineHeight: 22,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#fff", // White text
    textAlign: "center",
  },
  noResultsSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#999", // Light gray text
    textAlign: "center",
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#222222", // Dark card background
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333", // Dark border
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#333333", // Dark placeholder
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  resultContent: {
    flex: 1,
    padding: 12,
  },
  resultCategory: {
    fontSize: 12,
    color: "#34D399", // Green text
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff", // White text
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: "#999", // Light gray text
    lineHeight: 18,
  },
  recentSearchesContainer: {
    marginTop: 16,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff", // White text
  },
  clearAllText: {
    fontSize: 14,
    color: "#34D399", // Green text
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333", // Dark border
  },
  recentSearchText: {
    fontSize: 16,
    color: "#fff", // White text
    marginLeft: 12,
  },
})

export default SearchModal