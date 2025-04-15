import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export default function TutorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return Alert.alert("Error", "Username and password cannot be blank.");
    }

    setLoading(true);
    try {
      // Send login request
      const response = await api.post("/auth/tutors/login", { username, password });

      // Extract tutor data and token from the response
      const tutorData = {
        id: response.data.tutor.id,
        username: response.data.tutor.username,
        token: response.data.token,
      };

      // Store tutor data (including token) in AsyncStorage
      await AsyncStorage.setItem("tutorToken", JSON.stringify(tutorData));
      console.log("Stored Tutor Token:", tutorData); // Debugging

      // Set the token in Axios headers for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${tutorData.token}`;

      // Show success message and navigate to the tutor dashboard
      Alert.alert("Success", "Login successful!");
      router.push("/tutor-dashboard");
    } catch (error) {
      // console.error("❌ Tutor Login Error:", error.response?.data || error.message);

      // Handle errors based on response status
      const status = error.response?.status;
      const message = error.response?.data?.message || "Login failed.";

      if (status === 400) {
        Alert.alert("Error", "User not found. Please check your username.");
      } else if (status === 401) {
        Alert.alert("Error", "Invalid credentials. Please try again.");
      } else if (status === 403) {
        Alert.alert("Account Not Approved", "Your account is not approved. Contact admin.");
      } else if (status === 500) {
        Alert.alert("Server Error", "Something went wrong. Try again later.");
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Tutor Login</Text>
        
        <TextInput
          placeholder="Username"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f8f9fa" 
  },
  loginCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  title: { 
    fontSize: 22, 
    fontWeight: "600",
    marginBottom: 25,
    color: "#34495e",
    textAlign: "center",
    letterSpacing: 0.5
  },
  input: { 
    width: "100%", 
    padding: 14,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#34495e"
  },
  button: { 
    backgroundColor: "#34495e",
    padding: 16,
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#34495e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5
  }
});