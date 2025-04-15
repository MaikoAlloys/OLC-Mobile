import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function FinanceLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // ✅ Finance Login Function
  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/finance/login", { username, password });
      
      const { token, financeManager } = response.data;

      console.log("✅ Finance Login Success:", token); // Debugging

      // ✅ Store Token in AsyncStorage
      await AsyncStorage.setItem("financeToken", JSON.stringify({ token, id: financeManager.id, username: financeManager.username }));

      Alert.alert("Success", "Login successful!");
      router.push("/finance-dashboard"); // ✅ Redirect to Finance Dashboard
    
    } catch (error) {
      console.error("❌ Finance Login Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Finance Login</Text>
        <TextInput 
          placeholder="Username" 
          placeholderTextColor="#95a5a6"
          style={styles.input} 
          onChangeText={setUsername} 
        />
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#95a5a6"
          style={styles.input} 
          secureTextEntry 
          onChangeText={setPassword} 
        />
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
    backgroundColor: "#ecf0f1" 
  },
  card: {
    width: "85%",
    backgroundColor: "white",
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
  },
});