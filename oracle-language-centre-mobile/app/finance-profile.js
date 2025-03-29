import { View, Text, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function FinanceProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceProfile = async () => {
      try {
        const financeToken = await AsyncStorage.getItem("financeToken");
        if (!financeToken) {
          Alert.alert("Error", "You need to be logged in.");
          return router.push("/finance-login");
        }

        const financeData = JSON.parse(financeToken);
        const response = await api.get(`/finance/${financeData.id}`);

        if (response.data.message) {
          setProfile(null);
        } else {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching finance profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Manager Profile</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : profile ? (
        <View style={styles.card}>
          <Text style={styles.label}>👤 Username:</Text>
          <Text style={styles.value}>{profile.username}</Text>

          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{profile.firstname} {profile.lastname}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{profile.phone}</Text>
        </View>
      ) : (
        <Text style={styles.noRecords}>Profile not found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 10 },
});
