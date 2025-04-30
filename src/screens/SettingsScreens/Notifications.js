import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Notifications() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    newArticles: true,
    recyclingReminders: true,
    eventNotifications: true,
    appUpdates: false,
    marketingEmails: false,
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        const savedSettings = await AsyncStorage.getItem("notificationSettings")

        if (savedSettings) {
          setNotificationSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error("Error loading notification settings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleToggle = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Simular una operación de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Guardar en AsyncStorage
      await AsyncStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))

      Alert.alert("Éxito", "Configuración de notificaciones actualizada", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      Alert.alert("Error", "No se pudieron guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración General</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#34D399" />
              <Text style={styles.settingText}>Notificaciones push</Text>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.pushEnabled ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("pushEnabled")}
              value={notificationSettings.pushEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#34D399" />
              <Text style={styles.settingText}>Notificaciones por correo</Text>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.emailEnabled ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("emailEnabled")}
              value={notificationSettings.emailEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Notificaciones</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#34D399" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Nuevos artículos</Text>
                <Text style={styles.settingDescription}>
                  Recibe notificaciones cuando se publiquen nuevos artículos
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.newArticles ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("newArticles")}
              value={notificationSettings.newArticles}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="recycle" size={24} color="#34D399" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Recordatorios de reciclaje</Text>
                <Text style={styles.settingDescription}>Recibe recordatorios para reciclar regularmente</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.recyclingReminders ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("recyclingReminders")}
              value={notificationSettings.recyclingReminders}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#34D399" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Eventos</Text>
                <Text style={styles.settingDescription}>Recibe notificaciones sobre eventos de reciclaje cercanos</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.eventNotifications ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("eventNotifications")}
              value={notificationSettings.eventNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="update" size={24} color="#34D399" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Actualizaciones de la app</Text>
                <Text style={styles.settingDescription}>Recibe notificaciones sobre nuevas funciones y mejoras</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.appUpdates ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("appUpdates")}
              value={notificationSettings.appUpdates}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="tag-outline" size={24} color="#34D399" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Correos de marketing</Text>
                <Text style={styles.settingDescription}>Recibe ofertas y promociones relacionadas con reciclaje</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#9fe7d7" }}
              thumbColor={notificationSettings.marketingEmails ? "#34D399" : "#f4f3f4"}
              onValueChange={() => handleToggle("marketingEmails")}
              value={notificationSettings.marketingEmails}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
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
    color: "#333",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#34D399",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})
