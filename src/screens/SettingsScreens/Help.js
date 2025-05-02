import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function Help() {
  const navigation = useNavigation()
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [sending, setSending] = useState(false)

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("No se pudo cargar la página", err))
  }

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(index)
    }
  }

  const handleSendMessage = async () => {
    // Validación básica
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido")
      return
    }

    setSending(true)

    try {
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Limpiar formulario
      setContactName("")
      setContactEmail("")
      setContactMessage("")

      Alert.alert("Mensaje Enviado", "Gracias por contactarnos. Responderemos a tu mensaje lo antes posible.", [
        { text: "OK" },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el mensaje. Por favor intenta de nuevo más tarde.")
    } finally {
      setSending(false)
    }
  }

  const faqs = [
    {
      question: "¿Cómo encuentro un punto de reciclaje?",
      answer:
        "Navega a la pantalla principal y utiliza el mapa interactivo para localizar los contenedores más cercanos. Puedes hacer zoom en el mapa para ver con más detalle.",
    },
    {
      question: "¿Qué tipo de materiales puedo reciclar?",
      answer:
        "En los puntos de reciclaje del campus puedes depositar papel, cartón, plástico (PET, HDPE), vidrio, aluminio y electrónicos pequeños. Consulta la sección de 'Guías' o los artículos informativos para obtener detalles específicos sobre cada material.",
    },
    {
      question: "¿Cómo puedo contribuir al proyecto?",
      answer:
        "Puedes contribuir utilizando la aplicación, reportando nuevos puntos de reciclaje, compartiendo artículos informativos y participando en eventos de reciclaje organizados por la comunidad.",
    },
    {
      question: "¿La aplicación funciona fuera del campus?",
      answer:
        "Actualmente, la aplicación está optimizada para el campus universitario de CUCEI, pero estamos trabajando para expandir la cobertura a otras áreas. Puedes consultar los artículos informativos y guías de reciclaje desde cualquier ubicación.",
    },
    {
      question: "¿Cómo reporto un problema con la aplicación?",
      answer:
        "Puedes reportar problemas técnicos a través del formulario de contacto en esta pantalla o enviando un correo directamente a soporte@recyclemap.com con los detalles del problema y capturas de pantalla si es posible.",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes (FAQ)</Text>

          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.faqItem, expandedFaq === index && styles.faqItemExpanded]}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <MaterialCommunityIcons
                  name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#ffffff"
                />
              </View>
              {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </TouchableOpacity>
          ))}

          
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginTop: 10,
  },
  faqItem: {
    marginBottom: 12,
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqItemExpanded: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 15,
    color: "#ddd",
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactInfo: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactLink: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "500",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textAreaContainer: {
    height: 120,
    paddingTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  textArea: {
    textAlignVertical: "top",
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
})
