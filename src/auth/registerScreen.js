import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Vibration,
  Pressable,
  StatusBar,
} from "react-native"
import { useRef, useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import styles from "../Styles/Styles"
import { Checkbox } from "react-native-paper"
import { signUp } from "../dataBase/SignUp"
import { useScaleAnimation } from "../components/BotonesAnim"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

const validName = (name) => {
  return name !== ""
}

const validateEmail = (email) => {
  const regex = /^[^\s@]+@alumnos\.udg\.mx$/; // Updated regex to allow only @alumnos.udg.mx
  return regex.test(email)
}

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword
}

export const RegisterScreen = ({ navigation }) => {
  const [checked, setChecked] = useState(false)
  const shakeAnimation = useRef(new Animated.Value(0)).current
  const scrollRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)

  // Estados para los inputs
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Estados para los mensajes de error
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [ToSError, setToSError] = useState("")

  // Nuevas animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const formOpacity = useRef(new Animated.Value(0)).current
  const formSlide = useRef(new Animated.Value(50)).current

  useEffect(() => {
    // Animación de entrada
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  const handleRegister = async () => {
    let valid = true

    if (!validName(name)) {
      setNameError("Nombre inválido")
      valid = false
    } else {
      setNameError("")
    }

    if (!validateEmail(email)) {
      setEmailError("Correo inválido")
      valid = false
    } else {
      setEmailError("")
    }

    if (!validatePassword(password)) {
      setPasswordError("Debe tener MAXIMO 8 caracteres, 1 mayúscula, 1 número y 1 símbolo")
      valid = false
    } else {
      setPasswordError("")
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError("Las contraseñas no coinciden")
      valid = false
    } else {
      setConfirmPasswordError("")
    }

    if (checked === false) {
      setToSError("Acepta los términos y condiciones")
      valid = false
    } else {
      setToSError("")
    }
    if (!valid) {
      Vibration.vibrate()
      shakeForm()
      return
    }
    if (valid) {
      try {
        const result = await signUp(email, password, name)

        if (!result.success) {
          alert(`Error: ${result.message}`)
          Vibration.vibrate()
          return
        }
        navigation.replace("Login")
      } catch (error) {
        alert(`Error: ${error.message}`)
        Vibration.vibrate()
      }
    }
  }

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const googleButtonAnim = useScaleAnimation()
  const SignUpButtonAnim = useScaleAnimation()
  const LinkTextAnim = useScaleAnimation()
  const showAnim = useScaleAnimation()

  return (
    <View style={registerStyles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#000000", "#1a0000", "#FF0000"]} style={registerStyles.backgroundGradient} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={registerStyles.scrollViewContent}
          >
            {/* Header animado */}
            <Animated.View
              style={[
                registerStyles.headerContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={registerStyles.welcomeText}>Únete a nosotros</Text>
              <Text style={registerStyles.registerTitle}>¡Regístrate!</Text>
            </Animated.View>

            {/* Logo */}
            <Animated.View
              style={[
                registerStyles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Image style={registerStyles.logo} source={require("../../assets/logo.png")} resizeMode="contain" />
            </Animated.View>

            {/* Formulario */}
            <Animated.View
              style={[
                styles.container,
                {
                  transform: [{ translateX: shakeAnimation }, { translateY: formSlide }],
                  opacity: formOpacity,
                  alignItems: "center", // Centrar todos los elementos
                },
              ]}
            >
              {/* Input de nombre */}
              <View style={registerStyles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color="#FF0000"
                  style={registerStyles.inputIcon}
                />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="Nombre"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  onChangeText={setName}
                  value={name}
                  onFocus={() => scrollRef.current?.scrollTo({ y: 100, animated: true })}
                  returnKeyType="next"
                />
              </View>
              <View>{nameError ? <Text style={registerStyles.errorText}>{nameError}</Text> : null}</View>

              {/* Input de email */}
              <View style={registerStyles.inputContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color="#FF0000"
                  style={registerStyles.inputIcon}
                />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="Correo Electrónico"
                  keyboardType="email-address"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  onChangeText={setEmail}
                  value={email}
                  returnKeyType="next"
                  autoCompleteType="email"
                />
              </View>
              <View>{emailError ? <Text style={registerStyles.errorText}>{emailError}</Text> : null}</View>

              {/* Input de contraseña */}
              <View style={registerStyles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={24}
                  color="#FF0000"
                  style={registerStyles.inputIcon}
                />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="Contraseña"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                  returnKeyType="next"
                />
              </View>
              <View>
                {passwordError ? (
                  <Text style={registerStyles.errorText}>{passwordError}</Text>
                ) : (
                  <Text style={registerStyles.passwordRequirements}>
                    Debe incluir 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
                  </Text>
                )}
              </View>

              {/* Input de confirmar contraseña */}
              <View style={registerStyles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-check-outline"
                  size={24}
                  color="#FF0000"
                  style={registerStyles.inputIcon}
                />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="Confirma Contraseña"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  secureTextEntry={!showPassword}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  returnKeyType="done"
                />
                <Animated.View style={[{ transform: [{ scale: showAnim.scaleAnim }] }]}>
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    onPressIn={showAnim.handlePressIn}
                    onPressOut={showAnim.handlePressOut}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="rgba(255, 255, 255, 0.8)"
                    />
                  </Pressable>
                </Animated.View>
              </View>
              <View>
                {confirmPasswordError ? <Text style={registerStyles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* Términos y condiciones */}
              <View style={registerStyles.tosContainer}>
                <Checkbox
                  status={checked ? "checked" : "unchecked"}
                  onPress={() => setChecked(!checked)}
                  color={checked ? "#FF0000" : "rgba(255, 255, 255, 0.5)"}
                  uncheckedColor="rgba(255, 255, 255, 0.5)"
                />
                <Text style={registerStyles.tosText}>He Leido y Acepto </Text>
                <Pressable>
                  <Text style={registerStyles.tosLink}>Términos y Condiciones</Text>
                </Pressable>
              </View>
              <View>{ToSError ? <Text style={registerStyles.errorText}>{ToSError}</Text> : null}</View>
            </Animated.View>

            {/* Botón de registro */}
            <Animated.View
              style={[
                {
                  transform: [{ scale: SignUpButtonAnim.scaleAnim }],
                  opacity: formOpacity,
                },
                registerStyles.registerButton,
              ]}
            >
              <Pressable
                onPress={handleRegister}
                onPressIn={SignUpButtonAnim.handlePressIn}
                onPressOut={SignUpButtonAnim.handlePressOut}
                style={registerStyles.buttonInner}
              >
                <MaterialCommunityIcons name="account-plus" size={20} color="#fff" style={registerStyles.buttonIcon} />
                <Text style={registerStyles.buttonText}>Crear Cuenta</Text>
              </Pressable>
            </Animated.View>

            {/* Link para iniciar sesión */}
            <Animated.View
              style={[
                {
                  transform: [{ scale: LinkTextAnim.scaleAnim }],
                  opacity: formOpacity,
                },
                registerStyles.loginLinkContainer,
              ]}
            >
              <Pressable
                onPress={() => navigation.replace("Login")}
                onPressIn={LinkTextAnim.handlePressIn}
                onPressOut={LinkTextAnim.handlePressOut}
              >
                <Text style={registerStyles.loginText}>
                  ¿Ya tienes una cuenta? <Text style={registerStyles.loginTextBold}>Inicia Sesión</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  registerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  logoContainer: {
    width: width * 0.35,
    height: width * 0.35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: width * 0.175,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    width: width * 0.85,
    height: 55,
    borderRadius: 12,
    marginVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginLeft: 15,
    marginTop: 3,
    marginBottom: 3,
  },
  passwordRequirements: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    marginLeft: 15,
    marginTop: 3,
    marginBottom: 3,
  },
  tosContainer: {
    width: width * 0.85, // Mismo ancho que los inputs
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 5, // Pequeño padding para alinear con el texto de los inputs
  },
  tosText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  tosLink: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  registerButton: {
    backgroundColor: "#FF0000",
    width: width * 0.85, // Mismo ancho que los inputs
    height: 55,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    width: width * 0.85, // Mismo ancho que los inputs
    alignItems: "center", // Centrar el texto
    marginTop: 5,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  loginTextBold: {
    color: "#ffffff",
    fontWeight: "bold",
  },
})
