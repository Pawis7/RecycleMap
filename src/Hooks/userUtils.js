import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserName = async () => {
  try {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData?.nombre || null;
    }
  } catch (error) {
    console.error("Error fetching user name:", error);
    return null;
  }
};
