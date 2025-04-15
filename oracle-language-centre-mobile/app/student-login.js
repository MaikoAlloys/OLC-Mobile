import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Send login request to the server
      const response = await api.post("/auth/student/login", {
        username,
        password,
      });

      // Extract student data and token from the response
      const studentData = {
        id: response.data.student.id,
        username: response.data.student.username,
        token: response.data.token, // Ensure the token is included
      };

      // Store student data (including token) in AsyncStorage
      await AsyncStorage.setItem("studentToken", JSON.stringify(studentData));
      console.log("Stored Student Token:", studentData); // Debugging

      // Set the token in Axios headers for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${studentData.token}`;

      // Show success message and navigate to the dashboard
      Alert.alert("Success", "Login successful!");
      router.push("/dashboard");
    } catch (error) {
      // Handle errors based on the response status
      const status = error.response?.status;
      const message = error.response?.data?.message || "Login failed";

      if (status === 400) {
        Alert.alert("Error", "User not found. Please check your username.");
      } else if (status === 403) {
        Alert.alert("Account Not Approved", "Your account is not approved. Please wait for admin approval.");
      } else if (status === 401) {
        Alert.alert("Error", "Invalid credentials. Please try again.");
      } else if (status === 500) {
        Alert.alert("Server Error", "Something went wrong. Please try again later.");
      } else {
        Alert.alert("Error", message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Student Portal</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        <TextInput
          placeholder="Username"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.linkContainer} 
          onPress={() => router.push("/student-register")}
        >
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Register</Text></Text>
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
    backgroundColor: "#f8f9fa",
  },
  loginCard: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#34495e",
    textAlign: "center",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 20,
    fontSize: 16,
    color: "#34495e"
  },
  button: {
    backgroundColor: "#34495e",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#34495e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center"
  },
  linkText: {
    color: "#7f8c8d",
    fontSize: 14
  },
  linkHighlight: {
    color: "#34495e",
    fontWeight: "600"
  }
});