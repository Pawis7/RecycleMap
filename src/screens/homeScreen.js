import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useScaleAnimation } from "../components/BotonesAnim";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const SignUpAnim = useScaleAnimation();
  const LinkTextAnim = useScaleAnimation();
  const scrollRef = useRef(null);
  const [role, setRole] = React.useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setRole(userData.role); // Obtener el rol del usuario
      }
    };
    fetchRole();
  }, []);
  
  // Animaciones para entrada de elementos
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(30)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  
  // Animaciones para iconos flotantes
  const icon1Y = useRef(new Animated.Value(0)).current;
  const icon2Y = useRef(new Animated.Value(0)).current;
  const icon3Y = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animación de entrada secuencial
    Animated.sequence([
      // Logo y contenedor principal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      
      // Texto de bienvenida
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Nombre de la app
      Animated.timing(appNameOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Eslogan
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Botones
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      
      // Footer
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animación continua para los iconos flotantes
    const createFloatingAnimation = (animatedValue, duration) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -15,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    createFloatingAnimation(icon1Y, 4000);
    createFloatingAnimation(icon2Y, 5000);
    createFloatingAnimation(icon3Y, 4500);
    
  }, []);

  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor="#111111" barStyle="light-content" />
      <LinearGradient
        colors={["#000000", "#1a0000", "#FF0000"]}
        style={styles.backgroundGradient}
      />
      
      {/* Elementos decorativos flotantes */}
      <View style={styles.decorativeElements}>
        <Animated.View 
          style={[
            styles.floatingIcon, 
            { 
              top: height * 0.1, 
              left: width * 0.1,
              transform: [{ translateY: icon1Y }]
            }
          ]}
        >
          <MaterialCommunityIcons name="recycle" size={30} color="rgba(255,255,255,0.3)" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.floatingIcon, 
            { 
              top: height * 0.2, 
              right: width * 0.15,
              transform: [{ translateY: icon2Y }]
            }
          ]}
        >
          <MaterialCommunityIcons name="leaf" size={24} color="rgba(255,255,255,0.25)" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.floatingIcon, 
            { 
              bottom: height * 0.25, 
              left: width * 0.2,
              transform: [{ translateY: icon3Y }]
            }
          ]}
        >
          <MaterialCommunityIcons name="water-outline" size={28} color="rgba(255,255,255,0.2)" />
        </Animated.View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Logo y título con animación */}
          <Animated.View 
            style={[
              styles.headerContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require("../../assets/HomeLogo.png")}
                resizeMode="contain"
              />
            </View>
            
            <Animated.Text 
              style={[
                styles.welcomeText,
                { opacity: welcomeOpacity }
              ]}
            >
              Bienvenido a
            </Animated.Text>
            
            <Animated.Text 
              style={[
                styles.appName,
                { opacity: appNameOpacity }
              ]}
            >
              Recycle Map
            </Animated.Text>
            
            <Animated.Text 
              style={[
                styles.tagline,
                { opacity: taglineOpacity }
              ]}
            >
              Juntos por un Cucei más verde
            </Animated.Text>
          </Animated.View>

          {/* Botones de acción - Manteniendo el botón original */}
          <Animated.View 
            style={[
              styles.actionContainer,
              {
                opacity: buttonsOpacity,
                transform: [{ translateY: buttonsSlide }]
              }
            ]}
          >
            {/* Botón para crear cuenta */}
            <Animated.View
              style={[
                { transform: [{ scale: SignUpAnim.scaleAnim }] },
                styles.signupButton,
              ]}
            >
              <Pressable
                onPress={() => navigation.navigate("Register")}
                onPressIn={SignUpAnim.handlePressIn}
                onPressOut={SignUpAnim.handlePressOut}
                style={styles.buttonInner}
              >
                <MaterialCommunityIcons name="account-plus" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.signupButtonText}>Crear Cuenta</Text>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[{ transform: [{ scale: LinkTextAnim.scaleAnim }] }]}
            >
              <Pressable
                style={styles.loginLink}
                onPress={() => navigation.navigate("Login")}
                onPressIn={LinkTextAnim.handlePressIn}
                onPressOut={LinkTextAnim.handlePressOut}
              >
                <Text style={styles.loginLinkText}>¿Ya tienes una cuenta? </Text>
                <Text style={styles.loginLinkTextBold}>Inicia Sesión</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
          
          {/* Footer con información adicional */}
          <Animated.View 
            style={[
              styles.footer,
              { opacity: footerOpacity }
            ]}
          >
            <Text style={styles.footerText}>Versión 1.0.0</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  decorativeElements: {
    position: "absolute",
    width: width,
    height: height,
  },
  floatingIcon: {
    position: "absolute",
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: "center",
    width: width,
    paddingTop: height * 0.08,
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(255, 0, 0, 0.15)",
    padding: 15,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.25,
  },
  welcomeText: {
    fontSize: 22,
    color: "#ffffff",
    marginBottom: 5,
    fontWeight: "300",
  },
  appName: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 40,
    fontStyle: "italic",
  },
  actionContainer: {
    width: width * 0.85,
    alignItems: "center",
    marginTop: 20,
  },
  signupButton: {
    width: "100%",
    backgroundColor: "#FF0000",
    borderRadius: 12,
    paddingVertical: 15,
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
  },
  buttonIcon: {
    marginRight: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
  },
  loginLinkText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  loginLinkTextBold: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
  },
});

export default HomeScreen;