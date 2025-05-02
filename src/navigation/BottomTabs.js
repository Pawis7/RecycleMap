import { useRef, useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TouchableOpacity, View, StatusBar, Platform, Dimensions, StyleSheet, Animated } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { MainScreen } from "../screens/MainScreen"
import SettingsScreen from "../screens/SettingsScreen"

const Tab = createBottomTabNavigator()
const { width, height } = Dimensions.get("window")

// Componente para el botón de tab personalizado
function CustomTabBarButton({ children, onPress, accessibilityState }) {
  const focused = accessibilityState.selected

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.tabButton, focused ? styles.tabButtonActive : {}]}>{children}</View>
      {focused && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  )
}

// Componente para el botón flotante del chatbot
function ChatbotButton() {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])

    Animated.loop(pulse).start()
  }, [])

  return (
    <Animated.View style={[styles.chatbotContainer, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => alert("¡Chatbot activado! Aquí puedes implementar tu lógica de chatbot.")}
        activeOpacity={0.8}
      >
        <LinearGradient colors={["#FF0000", "#ff0000"]} style={styles.chatbotGradient}>
          <MaterialCommunityIcons name="chat-processing" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function BottomTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: "#111111",
            height: Platform.OS === "ios" ? 90 : 60,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
            color: "#fff",
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size, focused }) => {
            let iconName
            if (route.name === "Inicio") {
              iconName = "home"
            } else if (route.name === "Configuración") {
              iconName = "cog"
            }
            return <MaterialCommunityIcons name={iconName} size={24} color={focused ? "#FF0000" : "#666"} />
          },
          tabBarActiveTintColor: "#FF0000",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: {
            height: Platform.OS === "ios" ? height * 0.1 : height * 0.08,
            backgroundColor: "#111111",
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            paddingBottom: Platform.OS === "ios" ? 25 : 8,
            paddingTop: 8,
          },
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 2,
            fontWeight: "500",
          },
        })}
      >
        <Tab.Screen
          name="Inicio"
          component={MainScreen}
          options={{
            headerShown: false,
            headerTitle: "Inicio",
            tabBarLabel: "Inicio",
          }}
        />
        <Tab.Screen
          name="Configuración"
          component={SettingsScreen}
          options={{
            headerShown: true,
            headerTitle: "Configuración",
            tabBarLabel: "Ajustes",
          }}
        />
      </Tab.Navigator>

      {/* Botón flotante del chatbot */}
      <ChatbotButton />
    </View>
  )
}

const styles = StyleSheet.create({
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  tabButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  tabIndicator: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 22 : 5,
    height: 3,
    width: 20,
    backgroundColor: "#FF0000",
    borderRadius: 10,
  },
  chatbotContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? height * 0.12 : height * 0.1,
    right: 20,
    zIndex: 999,
  },
  chatbotButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  chatbotGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
})
