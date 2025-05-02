import {
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Vibration,
  Pressable,
  StatusBar,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../Styles/Styles";
import { logIn } from "../dataBase/Login";
import { Checkbox, Modal } from "react-native-paper";
import { useScaleAnimation } from "../components/BotonesAnim";
import LottieView from "lottie-react-native";
import successAnimation from "../../assets/Animation/checkAnim.json";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const LoginScreen = ({ navigation }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [sessionUserData, setSessionUserData] = useState(null); // Nuevo estado para datos temporales

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
    ]).start();
  }, [sessionUserData]);

  const handleRegister = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Correo inválido");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Contraseña inválida o correo incorrecto");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) {
      Vibration.vibrate();
      shakeForm();
      return;
    }

    try {
      const result = await logIn(email, password);

      if (!result.success) {
        alert(`Error: ${result.message}`);
        Vibration.vibrate();
        return;
      }

      setShowSuccessAnimation(true);
      setModalVisible(true);

      if (checked) {
        await AsyncStorage.setItem("isLogged", "true");
      } else {
        setSessionUserData(result.user); // Guardar en estado local
      }

      setIsLogged(true);

      setTimeout(() => {
        setShowSuccessAnimation(false);
        setModalVisible(false);
        navigation.replace("Main");
      }, 2000);
    } catch (error) {
      alert(`Error: ${error.message}`);
      Vibration.vibrate();
    }
  };

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
    ]).start();
  };

  const googleButtonAnim = useScaleAnimation();
  const loginButtonAnim = useScaleAnimation();
  const ForgotAnim = useScaleAnimation();
  const SignUpAnim = useScaleAnimation();
  const showAnim = useScaleAnimation();

  return (
    <View style={loginStyles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#000000", "#1a0000", "#FF0000"]}
        style={loginStyles.backgroundGradient}
      />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={loginStyles.scrollViewContent}
            >
              {/* Header animado */}
              <Animated.View 
                style={[
                  loginStyles.headerContainer,
                  { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }] 
                  }
                ]}
              >
                <Text style={loginStyles.welcomeBack}>Bienvenido de nuevo</Text>
                <Text style={loginStyles.loginTitle}>Inicio de Sesión</Text>
              </Animated.View>

              {/* Logo */}
              <Animated.View 
                style={[
                  loginStyles.logoContainer,
                  { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }] 
                  }
                ]}
              >
                <Image
                  style={loginStyles.logo}
                  source={require("../../assets/logo.png")}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* Formulario */}
              <Animated.View
                style={[
                  styles.container,
                  { 
                    transform: [
                      { translateX: shakeAnimation },
                      { translateY: formSlide }
                    ],
                    opacity: formOpacity
                  },
                ]}
              >
                <View style={loginStyles.inputContainer}>
                  <MaterialCommunityIcons name="email-outline" size={24} color="#FF0000" style={loginStyles.inputIcon} />
                  <TextInput
                    style={loginStyles.textInput}
                    placeholder="Correo Electrónico"
                    keyboardType="email-address"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    onChangeText={setEmail}
                    value={email}
                    returnKeyType="next"
                  />
                </View>
                <View>
                  {emailError ? (
                    <Text style={loginStyles.errorText}>{emailError}</Text>
                  ) : null}
                </View>
                
                <View style={loginStyles.inputContainer}>
                  <MaterialCommunityIcons name="lock-outline" size={24} color="#FF0000" style={loginStyles.inputIcon} />
                  <TextInput
                    style={loginStyles.textInput}
                    placeholder="Contraseña"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                    returnKeyType="next"
                  />
                  <Animated.View
                    style={[{ transform: [{ scale: showAnim.scaleAnim }] }]}
                  >
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
                  {passwordError ? (
                    <Text style={loginStyles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>
              </Animated.View>
              
              {/* Opciones adicionales */}
              <Animated.View
                style={[
                  loginStyles.optionsContainer,
                  { 
                    opacity: formOpacity,
                    transform: [{ translateY: formSlide }] 
                  }
                ]}
              >
                <View style={loginStyles.rememberContainer}>
                  <Checkbox
                    status={checked ? "checked" : "unchecked"}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                    color={checked ? "#FF0000" : "rgba(255, 255, 255, 0.5)"}
                    uncheckedColor="rgba(255, 255, 255, 0.5)"
                  />
                  <Text style={loginStyles.rememberText}>Recuérdame</Text>
                </View>
                
                <Animated.View
                  style={[{ transform: [{ scale: ForgotAnim.scaleAnim }] }]}
                >
                  <Pressable
                    onPress={() => alert("Recuperar contraseña")}
                    onPressIn={ForgotAnim.handlePressIn}
                    onPressOut={ForgotAnim.handlePressOut}
                  >
                    <Text style={loginStyles.forgotPassword}>
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Pressable>
                </Animated.View>
              </Animated.View>
              
              {/* Botón de inicio de sesión */}
              <Animated.View
                style={[
                  { 
                    transform: [{ scale: loginButtonAnim.scaleAnim }],
                    opacity: formOpacity 
                  },
                  loginStyles.loginButton,
                ]}
              >
                <Pressable
                  onPress={handleRegister}
                  onPressIn={loginButtonAnim.handlePressIn}
                  onPressOut={loginButtonAnim.handlePressOut}
                  style={loginStyles.buttonInner}
                >
                  <MaterialCommunityIcons name="login" size={20} color="#fff" style={loginStyles.buttonIcon} />
                  <Text style={loginStyles.buttonText}>Iniciar Sesión</Text>
                </Pressable>
              </Animated.View>
              
              {/* Link para registrarse */}
              <Animated.View
                style={[
                  { 
                    transform: [{ scale: SignUpAnim.scaleAnim }],
                    opacity: formOpacity 
                  },
                  loginStyles.signupLinkContainer
                ]}
              >
                <Pressable
                  onPress={() => navigation.replace("Register")}
                  onPressIn={SignUpAnim.handlePressIn}
                  onPressOut={SignUpAnim.handlePressOut}
                >
                  <Text style={loginStyles.signupText}>¿No tienes cuenta? <Text style={loginStyles.signupTextBold}>Regístrate</Text></Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Modal de éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={loginStyles.modalContainer}>
          {showSuccessAnimation && (
            <LottieView
              source={successAnimation}
              autoPlay
              loop={false}
              style={{ width: width * 1, height: height * 1 }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const loginStyles = StyleSheet.create({
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
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeBack: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  logoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderRadius: width * 0.2,
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
    marginVertical: 10,
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
    marginTop: 5,
  },
  optionsContainer: {
    width: width * 0.85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  forgotPassword: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#FF0000",
    width: width * 0.85,
    height: 55,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
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
  signupLinkContainer: {
    marginTop: 10,
  },
  signupText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  signupTextBold: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});