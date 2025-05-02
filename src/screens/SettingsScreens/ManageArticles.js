import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { supabase } from "../../dataBase/supabase"
import RNPickerSelect from "react-native-picker-select"
import { createArticle } from "../../dataBase/createArticle"
import { updateArticle } from "../../dataBase/updateArticle"
import { deleteArticle } from "../../dataBase/deleteArticle"
import { LinearGradient } from "expo-linear-gradient"

const ALLOWED_CATEGORIES = ["Guías", "Medio Ambiente", "Consejos", "Información"]

const formatDate = (date) => {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) throw new Error("Invalid Date");
    return parsedDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  } catch {
    return new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  }
};

export default function ManageArticles() {
  const navigation = useNavigation()
  const route = useRoute()
  const articleToEdit = route.params?.articleToEdit
  const isEditing = !!articleToEdit

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [articleData, setArticleData] = useState({
    title: articleToEdit?.title || "",
    description: articleToEdit?.description || "",
    imageUrl: articleToEdit?.imageUrl || "",
    content: articleToEdit?.content || "",
    category: articleToEdit?.category || "",
    featured: articleToEdit?.featured || false,
    is_new: articleToEdit?.isNew || false,
    date: formatDate(articleToEdit?.date || new Date()),
  })

  useEffect(() => {
    const verifyAdminAndFetchUsers = async () => {
      try {
        setLoading(true)

        const { data: session, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !session?.session?.user?.id) {
          navigation.replace("Main")
          return
        }

        const userId = session.session.user.id

        const { data: userInfo, error: infoError } = await supabase
          .from("users")
          .select("role")
          .eq("id", userId)
          .single()

        if (infoError || !userInfo || userInfo.role !== "admin") {
          Alert.alert("Acceso denegado", "No tienes permisos para acceder a esta sección.")
          navigation.replace("Main")
          return
        }
      } catch (error) {
        console.error("Error verifying admin:", error)
        Alert.alert("Error", error.message || "Ocurrió un error inesperado.")
        navigation.replace("Main")
      } finally {
        setLoading(false)
      }
    }
    verifyAdminAndFetchUsers()
  }, [navigation])

  const handleSave = async () => {
    if (
      !articleData.title?.trim() ||
      !articleData.content?.trim() ||
      !articleData.category?.trim() ||
      !articleData.imageUrl?.trim() ||
      !articleData.date?.trim()
    ) {
      Alert.alert("Error", "Título, Contenido, Categoría, URL de Imagen y Fecha son obligatorios")
      return
    }

    try {
      setSaving(true)
      const finalImageUrl = articleData.imageUrl.trim()

      const articlePayload = {
        title: articleData.title.trim(),
        description: articleData.description?.trim() || null,
        image_url: finalImageUrl,
        content: articleData.content.trim(),
        category: articleData.category.trim(),
        featured: articleData.featured,
        is_new: articleData.is_new,
        date: articleData.date.trim(),
      }

      let result
      if (isEditing) {
        result = await updateArticle(articleToEdit.id, articlePayload)
      } else {
        result = await createArticle(articlePayload)
      }

      if (result.success) {
        Alert.alert("Éxito", `Artículo ${isEditing ? "actualizado" : "creado"} correctamente`, [
          {
            text: "OK",
            onPress: () => navigation.pop(isEditing ? 2 : 1),
          },
        ])
      } else {
        const errorMessage = result.error?.message || `No se pudo ${isEditing ? "actualizar" : "guardar"} el artículo.`
        Alert.alert("Error", errorMessage)
      }
    } catch (error) {
      console.error(`Unexpected error in handleSave (${isEditing ? "update" : "create"}):`, error)
      Alert.alert("Error", "Ocurrió un error inesperado.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditing) return

    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setSaving(true)
            try {
              const result = await deleteArticle(articleToEdit.id)
              if (result.success) {
                Alert.alert("Éxito", "Artículo eliminado correctamente", [
                  { text: "OK", onPress: () => navigation.pop(2) },
                ])
              } else {
                const errorMessage = result.error?.message || "No se pudo eliminar el artículo."
                Alert.alert("Error", errorMessage)
              }
            } catch (error) {
              console.error("Unexpected error in handleDelete:", error)
              Alert.alert("Error", "Ocurrió un error inesperado al eliminar.")
            } finally {
              setSaving(false)
            }
          },
        },
      ],
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    )
  }

  const isValidUrl = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://"))
  }

  const pickerItems = ALLOWED_CATEGORIES.map((cat) => ({ label: cat, value: cat }))

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? "Editar Artículo" : "Crear Artículo"}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          

        <View style={styles.formContainer}>
          <View style={styles.section}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons
              name={isEditing ? "file-document-edit" : "file-plus-outline"}
              size={48}
              color="#FF0000"
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>
              {isEditing ? "Actualiza la información del artículo" : "Crea un nuevo artículo"}
            </Text>
          </View>
          </View>
          
          <View style={styles.section}>
            
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="image" size={24} color="#FF0000" />
              <Text style={styles.sectionTitle}>Imagen</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>URL de la Imagen</Text>
              <View style={[styles.inputContainer, { alignItems: "center", flexDirection: "row", flex: 1 }]}> 
                <MaterialCommunityIcons name="link-variant" size={20} color="#FF0000" />
                <TextInput
                  style={[styles.input, { flex: 1, maxWidth: "100%" }]} 
                  value={articleData.imageUrl}
                  onChangeText={(text) => setArticleData((prev) => ({ ...prev, imageUrl: text }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  placeholderTextColor="#999"
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.imagePreviewContainer}>
              <Text style={styles.previewLabel}>Vista Previa</Text>
              <Image
                source={isValidUrl(articleData.imageUrl) ? { uri: articleData.imageUrl } : null}
                style={styles.articleImage}
                onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="text" size={24} color="#FF0000" />
              <Text style={styles.sectionTitle}>Contenido</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título</Text>
              <View style={[styles.inputContainer, { alignItems: "center" }]}>
                <MaterialCommunityIcons name="format-title" size={20} color="#FF0000" />
                <TextInput
                  style={styles.input}
                  value={articleData.title}
                  onChangeText={(text) => setArticleData((prev) => ({ ...prev, title: text }))}
                  placeholder="Título del artículo"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción Corta</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, { alignItems: "center" }]}>
                <MaterialCommunityIcons name="card-text-outline" size={20} color="#FF0000" />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={articleData.description}
                  onChangeText={(text) => setArticleData((prev) => ({ ...prev, description: text }))}
                  placeholder="Una breve descripción..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contenido Completo</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, { height: 150 }]}>
                <MaterialCommunityIcons name="file-document-outline" size={20} color="#FF0000" />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={articleData.content}
                  onChangeText={(text) => setArticleData((prev) => ({ ...prev, content: text }))}
                  placeholder="Escribe el contenido completo aquí..."
                  placeholderTextColor="#999"
                  multiline
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="tag-multiple" size={24} color="#FF0000" />
              <Text style={styles.sectionTitle}>Clasificación</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="calendar" size={20} color="#FF0000" />
                <Text style={styles.nonEditableText}>{articleData.date}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoría</Text>
              <TouchableOpacity style={styles.categoryContainer} activeOpacity={0.7}>
                <MaterialCommunityIcons name="shape" size={20} color="#FF0000" />
                <View style={styles.pickerWrapper}>
                  <RNPickerSelect
                    onValueChange={(value) => setArticleData((prev) => ({ ...prev, category: value }))}
                    items={pickerItems}
                    style={pickerSelectStyles}
                    value={articleData.category}
                    placeholder={{ label: "Selecciona una categoría...", value: null }}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                      return <MaterialCommunityIcons name="chevron-down" size={24} color="#FF0000" />
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.switchesContainer}>
              <TouchableOpacity
                style={styles.switchItem}
                activeOpacity={0.7}
                onPress={() => setArticleData((prev) => ({ ...prev, featured: !prev.featured }))}
              >
                <View style={styles.switchLabel}>
                  <MaterialCommunityIcons name="star" size={20} color="#FF0000" />
                  <Text style={styles.switchText}>Destacado</Text>
                </View>
                <Switch
                  trackColor={{ false: "#e0e0e0", true: "#f3a7ba" }}
                  thumbColor={articleData.featured ? "#FF0000" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                  onValueChange={(value) => setArticleData((prev) => ({ ...prev, featured: value }))}
                  value={articleData.featured}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchItem}
                activeOpacity={0.7}
                onPress={() => setArticleData((prev) => ({ ...prev, is_new: !prev.is_new }))}
              >
                <View style={styles.switchLabel}>
                  <MaterialCommunityIcons name="new-box" size={20} color="#FFD700" />
                  <Text style={styles.switchText}>Nuevo</Text>
                </View>
                <Switch
                  trackColor={{ false: "#e0e0e0", true: "#fef08a" }}
                  thumbColor={articleData.is_new ? "#FFD700" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                  onValueChange={(value) => setArticleData((prev) => ({ ...prev, is_new: value }))}
                  value={articleData.is_new}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                  <Text style={styles.buttonText}>{isEditing ? "Actualizar Artículo" : "Guardar Artículo"}</Text>
                </>
              )}
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Eliminar Artículo</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    alignItems: "center",
    padding: 16,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  formContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    paddingBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222222",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    minHeight: 50,
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 8,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 12,
  },
  textArea: {
    height: "100%",
    textAlignVertical: "top",
    color: "#fff",
  },
  imagePreviewContainer: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  articleImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#333333",
    resizeMode: "cover",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222222",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    minHeight: 50,
    paddingHorizontal: 12,
    gap: 10,
  },
  pickerWrapper: {
    flex: 1,
    height: 50,
    justifyContent: "center",
  },
  switchesContainer: {
    marginTop: 16,
  },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  buttonsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#34D399",
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#f44336",
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  nonEditableText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
    flex: 1, // Ensures the text takes up available space without centering
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: "#fff",
    paddingRight: 30,
    height: 50,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: 8,
    color: "#fff",
    paddingRight: 30,
    height: 50,
  },
  placeholder: {
    color: "#999",
  },
  iconContainer: {
    top: 12,
    right: 0,
  },
})
