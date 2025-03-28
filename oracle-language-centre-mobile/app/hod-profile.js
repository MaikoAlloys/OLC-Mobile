import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HODProfile() {
  const [hod, setHOD] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHODProfile();
  }, []);

  const fetchHODProfile = async () => {
    try {
      const hodToken = await AsyncStorage.getItem("hodToken");
      if (!hodToken) {
        return; // No alert, just return
      }

      const tokenData = JSON.parse(hodToken);
      const response = await axios.get("http://192.168.100.25:5000/hod/profile", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      setHOD(response.data);
    } catch (error) {
      console.error("❌ Error fetching HOD profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOD Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : hod ? (
        <View style={styles.card}>
          <Text style={styles.label}>👤 Username:</Text>
          <Text style={styles.value}>{hod.username}</Text>

          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{hod.firstname} {hod.lastname}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{hod.email}</Text>

          <Text style={styles.label}>📞 Phone:</Text>
          <Text style={styles.value}>{hod.phone}</Text>
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
