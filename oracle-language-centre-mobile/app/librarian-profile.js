import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export default function LibrarianProfile() {
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibrarianProfile();
  }, []);

  const fetchLibrarianProfile = async () => {
    try {
      const librarianToken = await AsyncStorage.getItem("librarianToken");
      if (!librarianToken) {
        return; // No token found, do nothing
      }

      const tokenData = JSON.parse(librarianToken);
      const response = await api.get("/librarian/profile", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      setLibrarian(response.data);
    } catch (error) {
      console.error("❌ Error fetching Librarian profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Librarian Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : librarian ? (
        <View style={styles.card}>
          <Text style={styles.label}>👤 Username:</Text>
          <Text style={styles.value}>{librarian.username}</Text>

          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{librarian.first_name} {librarian.last_name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{librarian.email}</Text>
        </View>
      ) : (
        <Text style={styles.noRecords}>Failed to load profile.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    elevation: 2,
    marginTop: 10,
    marginHorizontal: 10,
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 10 },
});
