import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LibrarianLogin() {
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
      const response = await axios.post("http://192.168.100.25:5000/auth/librarian/login", { username, password });

      // Extract librarian data and token from the response
      const librarianData = {
        id: response.data.librarian.id,
        username: response.data.librarian.username,
        token: response.data.token,
      };

      // Store librarian data (including token) in AsyncStorage
      await AsyncStorage.setItem("librarianToken", JSON.stringify(librarianData));
      console.log("Stored Librarian Token:", librarianData); // Debugging

      // Set the token in Axios headers for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${librarianData.token}`;

      // Show success message and navigate to the librarian dashboard
      Alert.alert("Success", "Login successful!");
      router.push("/librarian-dashboard");
    } catch (error) {
      console.error("❌ Librarian Login Error:", error.response?.data || error.message);

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
      <Text style={styles.title}>Librarian Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
  button: { backgroundColor: "#28a745", padding: 15, width: "80%", alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
});
