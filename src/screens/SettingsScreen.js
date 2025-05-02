import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator, TextInput, Modal, Pressable } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "../dataBase/supabase"
import { getUserName } from "../Hooks/userUtils"

export default function SettingsScreen() {
  const navigation = useNavigation()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [targetScreen, setTargetScreen] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        const name = await getUserName()

        const userDataString = await AsyncStorage.getItem("userData")
        let parsedUserData = {
          nombre: name || "Usuario",
          email: "usuario@ejemplo.com",
          role: "user",
        }

        if (userDataString) {
          const storedUserData = JSON.parse(userDataString)
          parsedUserData = {
            ...parsedUserData,
            ...storedUserData,
          }
          setIsAdmin(storedUserData.role === "admin")
        }

        setUserData(parsedUserData)
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        Alert.alert("Error", "No se pudieron cargar los datos del usuario")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar sesión",
        onPress: async () => {
          try {
            await supabase.auth.signOut() 
            await AsyncStorage.removeItem("userData")
            await AsyncStorage.removeItem("isLogged")

            navigation.navigate("Home") 
            console.log("Sesión cerrada correctamente.")
          } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión.")
          }
        },
      },
    ])
  }

  const navigateTo = (screen) => {
    navigation.navigate(screen)
  }

  const verifyPasswordBeforeNavigation = async (screen) => {
    setTargetScreen(screen);
    setPasswordModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: passwordInput,
      });
      if (error) {
        Alert.alert("Error", "Contraseña incorrecta.");
        return;
      }
      setPasswordModalVisible(false);
      setPasswordInput("");
      navigateTo(targetScreen);
    } catch (err) {
      Alert.alert("Error", "No se pudo verificar la contraseña.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setPasswordModalVisible(false)}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="shield-lock-outline" size={32} color="#FF0000" />
              <Text style={styles.modalTitle}>Verificación de Seguridad</Text>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Por favor, ingresa tu contraseña para continuar
            </Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#666" />
              <TextInput
                style={styles.modalInput}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handlePasswordSubmit}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setPasswordInput("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView style={styles.scrollContainer}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={userData?.avatar 
              ? { uri: userData.avatar } 
              : require('../../assets/logo.png')} 
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>
          {userData?.nombre || 'Usuario'} 
        </Text>
        <Text style={styles.userEmail}>
          {userData?.email ? userData.email.replace(/(.{2}).+(@.+)/, "$1***$2") : 'Sin correo'}
        </Text>
      </View>
        {/* Sección de cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => verifyPasswordBeforeNavigation("EditProfile")}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#FF0000" />
            <Text style={styles.settingText}>Editar perfil</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("ChangePassword")}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="#FF0000" />
            <Text style={styles.settingText}>Cambiar contraseña</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

         {/* <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("Notifications")}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#FF0000" />
            <Text style={styles.settingText}>Notificaciones</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity> */}
        </View>

        {/* Opciones solo para administradores */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opciones de Administrador</Text>

            <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("ManageUsers")}>
              <MaterialCommunityIcons name="account-cog-outline" size={24} color="#FF0000" />
              <Text style={styles.settingText}>Gestionar Usuarios</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>

            {/* Updated navigation target */}
            <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("ManageArticles")}>
              <MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#FF0000" />
              <Text style={styles.settingText}>Crear Artículos</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}

        {/* Sección de información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>

          {/* Corrected navigation target for "Acerca de" if it was wrong */}
          <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("About")}> 
            <MaterialCommunityIcons name="information-outline" size={24} color="#FF0000" />
            <Text style={styles.settingText}>Acerca de</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("Help")}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color="#FF0000" />
            <Text style={styles.settingText}>Ayuda</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigateTo("PrivacyPolicy")}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#FF0000" />
            <Text style={styles.settingText}>Política de privacidad</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111111',
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF0000',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  section: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    color: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF0000",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  versionText: {
    color: "#666",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  modalInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#222222",
  },
  confirmButton: {
    backgroundColor: "#FF0000",
  },
  cancelButtonText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})