import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Linking } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function About() {
  const navigation = useNavigation()

  const openWebsite = () => {
    Linking.openURL("https://pawstudio.xyz").catch((err) => console.error("No se pudo abrir el enlace", err))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acerca de</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Recycle Map</Text>
          <Text style={styles.version}>Versión 1.0.0</Text>

          <View style={styles.card}>
            <Text style={styles.description}>
              Recycle Map es una aplicación dedicada a promover el reciclaje y la conciencia ambiental dentro de la
              comunidad universitaria de CUCEI.
            </Text>
            <Text style={styles.description}>
              Nuestra misión es facilitar la localización de puntos de reciclaje, proporcionar información útil sobre
              prácticas sostenibles y fomentar la participación activa en la protección del medio ambiente.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Características principales</Text>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <MaterialCommunityIcons name="map-marker" size={24} color="#FF0000" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Mapa Interactivo</Text>
              <Text style={styles.featureDescription}>
                Localiza fácilmente los puntos de reciclaje más cercanos en el campus.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <MaterialCommunityIcons name="newspaper-variant" size={24} color="#FF0000" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Artículos Informativos</Text>
              <Text style={styles.featureDescription}>
                Accede a contenido educativo sobre reciclaje y prácticas sostenibles.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <MaterialCommunityIcons name="account-group" size={24} color="#FF0000" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Comunidad</Text>
              <Text style={styles.featureDescription}>
                Conecta con otros usuarios comprometidos con el medio ambiente.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Desarrollado por:</Text>
          <View style={styles.developerCard}>
            <Text style={styles.developer}>Saul Arciniega, Leonardo Rios</Text>
            <Text style={styles.developerRole}>Universidad de Guadalajara</Text>
            <TouchableOpacity style={styles.websiteButton} onPress={openWebsite}>
              <MaterialCommunityIcons name="web" size={18} color="#fff" />
              <Text style={styles.websiteButtonText}>Visitar sitio web</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.copyright}>© 2025 Recycle Map. Casi Todos los derechos reservados.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 22,
    marginBottom: 12,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(211, 52, 78, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  developerCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    textAlign: "justify",
  },
  developer: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  developerRole: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 16,
  },
  websiteButton: {
    flexDirection: "row",
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  websiteButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
  copyright: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
})