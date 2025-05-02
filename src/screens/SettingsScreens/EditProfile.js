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
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from 'expo-image-picker';
import { updateUserName } from "../../dataBase/UpdateUserName";
import { supabase } from "../../dataBase/supabase"; 

export default function EditProfile() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userDataString = await AsyncStorage.getItem("userData");

        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;

      setUserData((prevState) => ({ ...prevState, avatar: selectedImageUri }));

      try {
        const storedUserData = JSON.parse(await AsyncStorage.getItem("userData")) || {};
        const updatedUserData = { ...storedUserData, avatar: selectedImageUri };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      } catch (error) {
      }
    }
  };

  const handleSave = async () => {
    if (!userData?.nombre?.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    try {
      setSaving(true);

      const updateResult = await updateUserName(userData.nombre, userData.avatar);
      if (!updateResult.success) {
        Alert.alert("Error", updateResult.message || "No se pudo actualizar el nombre y el avatar en la base de datos");
        return;
      }

      try {
        const storedUserData = JSON.parse(await AsyncStorage.getItem("userData")) || {};
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({ ...storedUserData, nombre: userData.nombre, avatar: userData.avatar })
        );
        
      } catch (error) {
      }
      Alert.alert("Éxito", "Perfil actualizado correctamente", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Main" }], 
            });
          },
        },
      ]);
      
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={userData.avatar ? { uri: userData.avatar } : require("../../../assets/logo.png")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
            <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color="#FF0000" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={userData.nombre}
                onChangeText={(text) => setUserData((prevState) => ({ ...prevState, nombre: text }))}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={20} color="#FF0000" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: "#999" }]}
                value={userData.email}
                editable={false}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#999"
              />
            </View>
            <Text style={styles.helperText}>El correo electrónico no se puede cambiar</Text>
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
    </KeyboardAvoidingView>
  );
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
  avatarContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FF0000",
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF0000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  changePhotoText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  formContainer: {
    padding: 16,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    height: 50,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#FF0000",
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
