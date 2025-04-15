import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function SupplierLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/supplier/login", { username, password });

      // Store token & supplier ID
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("supplierId", response.data.supplier.id.toString());

      Alert.alert("Success", "Login successful!");
      router.push("/supplier-dashboard"); // Redirect to supplier dashboard
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Supplier Portal</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={styles.input} 
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#95a5a6"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#95a5a6"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
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
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 30,
    textAlign: "center"
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#34495e",
    marginBottom: 8,
    marginLeft: 5
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5
  }
});