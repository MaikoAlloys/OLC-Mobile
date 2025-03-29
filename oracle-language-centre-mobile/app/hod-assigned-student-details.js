import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ FIX: Import AsyncStorage
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "./api";

export default function HODAssignedStudentDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ✅ Get student assignment ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Invalid student selection.");
      return router.push("/hod-assigned-students");
    }
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const hodToken = await AsyncStorage.getItem("hodToken");
      if (!hodToken) {
        Alert.alert("Error", "You need to log in.");
        return router.push("/hod-login");
      }

      const tokenData = JSON.parse(hodToken);
      const response = await api.get(`/hod/assigned-student/${id}`, {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      if (response.data) {
        setStudent(response.data);
      } else {
        setStudent(null);
      }
    } catch (error) {
      console.error("❌ Error fetching student details:", error);
      Alert.alert("Error", "Failed to fetch student details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Student Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : student ? (
        <View style={styles.card}>
          <Text style={styles.label}>👤 Student Name:</Text>
          <Text style={styles.value}>{student.first_name} {student.last_name}</Text>

          <Text style={styles.label}>📜 Course:</Text>
          <Text style={styles.value}>{student.course_name}</Text>

          <Text style={styles.label}>👨‍🏫 Assigned Tutor:</Text>
          <Text style={styles.value}>{student.tutor_firstname} {student.tutor_lastname}</Text>

          <Text style={styles.label}>📅 Assigned On:</Text>
          <Text style={styles.value}>{new Date(student.assigned_at).toLocaleString()}</Text>
        </View>
      ) : (
        <Text style={styles.error}>No student details found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 5, elevation: 2 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 10 },
  error: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
});
