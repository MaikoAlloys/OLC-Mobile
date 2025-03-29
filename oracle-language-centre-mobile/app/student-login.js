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
      <Text style={styles.title}>Student Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/student-register")}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    color: "#007bff",
    marginTop: 10,
  },
});