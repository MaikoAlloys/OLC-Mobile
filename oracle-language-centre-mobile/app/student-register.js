import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

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
      await axios.post("http://192.168.100.25:5000/auth/student/register", form);
      Alert.alert("Success", "Registration successful. Wait for admin approval.");
      router.push("/student-login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Registration</Text>
      <TextInput placeholder="Username" style={styles.input} onChangeText={(value) => setForm({ ...form, username: value })} />
      <TextInput placeholder="First Name" style={styles.input} onChangeText={(value) => setForm({ ...form, first_name: value })} />
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={(value) => setForm({ ...form, last_name: value })} />
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" onChangeText={(value) => setForm({ ...form, email: value })} />
      <TextInput placeholder="Phone (10 digits)" style={styles.input} keyboardType="numeric" maxLength={10} onChangeText={(value) => setForm({ ...form, phone: value })} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={(value) => setForm({ ...form, password: value })} />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/student-login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#007bff", padding: 15, width: "80%", alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
  linkText: { color: "#007bff", marginTop: 10 },
});
