import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

const StudentRegister = ({ navigation }) => {
  const [form, setForm] = useState({ username: "", first_name: "", last_name: "", email: "", phone: "", password: "" });

  const handleRegister = async () => {
    try {
      await axios.post("http://192.168.100.25:5000/auth/student/register", form);
      Alert.alert("Success", "Registration successful. Wait for admin approval.");
      navigation.navigate("StudentLogin");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Registration</Text>
      {Object.keys(form).map((key) => (
        <TextInput key={key} placeholder={key.replace("_", " ")} style={styles.input} onChangeText={(value) => setForm({ ...form, [key]: value })} />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#007bff", padding: 15, width: "80%", alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
});

export default StudentRegister;
