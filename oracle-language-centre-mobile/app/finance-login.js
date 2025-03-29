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
      <Text style={styles.title}>Finance Login</Text>
      <TextInput placeholder="Username" style={styles.input} onChangeText={setUsername} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#28a745", padding: 15, width: "80%", alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
});
