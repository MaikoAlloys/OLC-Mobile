import { View, Text, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "./api";

export default function TutorProfile() {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tutorToken = await AsyncStorage.getItem("tutorToken");
        if (!tutorToken) {
          Alert.alert("Error", "You need to log in first.");
          return;
        }

        const tutorData = JSON.parse(tutorToken);
        const response = await api.get(`/tutors/${tutorData.id}`);
        setTutor(response.data);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        Alert.alert("Error", "Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Profile</Text>

      {tutor ? (
        <View style={styles.profileCard}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{tutor.firstname} {tutor.lastname}</Text>

          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{tutor.username}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{tutor.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{tutor.phone}</Text>
        </View>
      ) : (
        <Text style={styles.loading}>Loading profile...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  profileCard: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%", elevation: 3 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#333" },
  loading: { fontSize: 16, marginTop: 20, color: "gray" },
});
