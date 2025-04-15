import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function HODLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/hod/login", { username, password });
      const { token, hod } = response.data;
      await AsyncStorage.setItem("hodToken", JSON.stringify({ token, id: hod.id, username: hod.username }));
      Alert.alert("Success", "Login successful!");
      router.push("/hod-dashboard"); // Redirect to HOD Dashboard
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Head of Department</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Username"
            placeholderTextColor="#95a5a6"
            style={styles.input}
            onChangeText={setUsername}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Password"
            placeholderTextColor="#95a5a6"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
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
  inputContainer: {
    marginBottom: 20
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
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
  }
});