import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import * as Clipboard from "expo-clipboard" // Added Clipboard import

export default function PrivacyPolicy() {
  const navigation = useNavigation()

  const copyToClipboard = () => {
    Clipboard.setStringAsync("saul.arciniega777@gmail.com") // Copies the email to clipboard
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["rgba(211, 52, 60, 0.2)", "rgba(211, 52, 52, 0.05)"]} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="shield-check" size={48} color="#FF0000" style={styles.headerIcon} />
            <Text style={styles.headerText}>Tu privacidad es importante para nosotros</Text>
            <Text style={styles.lastUpdated}>Última actualización: 30 de Abril de 2025</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="information-outline" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>1. Introducción</Text>
            </View>
            <Text style={styles.paragraph}>
              Bienvenido a Recycle Map. Nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica
              cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando utilizas nuestra aplicación
              móvil.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="database" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>2. Información que Recopilamos</Text>
            </View>
            <Text style={styles.paragraph}>
              Podemos recopilar información sobre ti de varias maneras. La información que podemos recopilar a través de
              la Aplicación incluye:
            </Text>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color="#FF0000" />
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Datos Personales:</Text> Información de identificación personal, como tu
                nombre, dirección de correo electrónico, que nos proporcionas voluntariamente cuando te registras en la
                Aplicación.
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color="#FF0000" />
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Datos de Uso:</Text> Información que nuestra aplicación recopila
                automáticamente cuando accedes y utilizas la Aplicación, como tus acciones dentro de la app (artículos
                vistos, etc.).
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clipboard-text" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>3. Uso de tu Información</Text>
            </View>
            <Text style={styles.paragraph}>
              Tener información precisa sobre ti nos permite ofrecerte una experiencia fluida, eficiente y
              personalizada. Específicamente, podemos usar la información recopilada sobre ti a través de la Aplicación
              para:
            </Text>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="check" size={20} color="#FF0000" />
              <Text style={styles.bulletText}>Crear y gestionar tu cuenta.</Text>
            </View>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="check" size={20} color="#FF0000" />
              <Text style={styles.bulletText}>Enviarte correos electrónicos administrativos.</Text>
            </View>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="check" size={20} color="#FF0000" />
              <Text style={styles.bulletText}>Mejorar la eficiencia y el funcionamiento de la Aplicación.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="share-variant" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>4. Divulgación de tu Información</Text>
            </View>
            <Text style={styles.paragraph}>
              Podemos compartir información que hemos recopilado sobre ti en ciertas situaciones. Tu información puede
              ser divulgada de la siguiente manera:
            </Text>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color="#FF0000" />
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Cumplimiento Legal:</Text> Podemos divulgar tu información cuando sea
                requerido por ley o en respuesta a solicitudes legales válidas.
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color="#FF0000" />
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Terceros Proveedores de Servicios:</Text> Podemos compartir tu información con
                terceros que realizan servicios para nosotros o en nuestro nombre.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="shield-lock" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>5. Seguridad de tu Información</Text>
            </View>
            <Text style={styles.paragraph}>
              Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger tu información
              personal. Si bien hemos tomado medidas razonables para asegurar la información que nos proporcionas, ten
              en cuenta que ningún sistema de seguridad es impenetrable y no podemos garantizar la seguridad de nuestras
              bases de datos, ni podemos garantizar que la información que nos proporcionas no será interceptada
              mientras se nos transmite a través de Internet.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-check" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>6. Tus Derechos de Privacidad</Text>
            </View>
            <Text style={styles.paragraph}>
              Dependiendo de tu ubicación, puedes tener ciertos derechos con respecto a tu información, como el derecho
              a acceder, actualizar o eliminar la información que tenemos sobre ti.
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="copyright" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>7. Imagenes y derechos de autor</Text>
            </View>
            <Text style={styles.paragraph}>
              Esta Aplacion no recopila imagenes en las base de datos, recopila la url de donde se encuentra la imagen,
              ademas no buscamos lucrar con esta aplicacion, de cualquier manera si una imagen es de tu propiedad y no
              aceptas que se use en esta aplicacion, por favor contactanos y la eliminaremos de inmediato.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="email" size={24} color="#FF0000" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>8. Contacto</Text>
            </View>
            <Text style={styles.paragraph}>
              Si tienes preguntas o comentarios sobre esta Política de Privacidad, por favor contáctanos en:
            </Text>
            <TouchableOpacity style={styles.contactButton} onPress={copyToClipboard}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#fff" />
              <Text style={styles.contactButtonText}>saul.arciniega777@gmail.com</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons name="copyright" size={14} color="#666" />
            <Text style={styles.footerText}>2025 Recycle Map. Casi todos los derechos reservados.</Text>
          </View>
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
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#111111",
  },
  headerContent: {
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#aaa",
    fontStyle: "italic",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  paragraph: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 22,
    marginBottom: 12,
    textAlign: "justify",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: "#ccc",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    alignSelf: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 14,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
})
