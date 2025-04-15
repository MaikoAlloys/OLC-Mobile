import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import api from "./api";

export default function StudentRegister() {
  const [form, setForm] = useState({ username: "", first_name: "", last_name: "", email: "", phone: "", password: "" });
  const router = useRouter();

  const handleRegister = async () => {
    // Validate phone number (must be 10 digits)
    if (!/^\d{10}$/.test(form.phone)) {
      Alert.alert("Error", "Phone number must be exactly 10 digits.");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      await api.post("/auth/student/register", form);
      Alert.alert("Success", "Registration successful. Wait for admin approval.");
      router.push("/student-login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Student Registration</Text>
        <Text style={styles.subtitle}>Create your account</Text>
        
        <TextInput 
          placeholder="Username"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          onChangeText={(value) => setForm({ ...form, username: value })}
        />
        <TextInput 
          placeholder="First Name"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          onChangeText={(value) => setForm({ ...form, first_name: value })}
        />
        <TextInput 
          placeholder="Last Name"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          onChangeText={(value) => setForm({ ...form, last_name: value })}
        />
        <TextInput 
          placeholder="Email"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <TextInput 
          placeholder="Phone (10 digits)"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(value) => setForm({ ...form, phone: value })}
        />
        <TextInput 
          placeholder="Password"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          secureTextEntry
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => router.push("/student-login")}
        >
          <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
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
  card: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 25,
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
    marginBottom: 25
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 15,
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