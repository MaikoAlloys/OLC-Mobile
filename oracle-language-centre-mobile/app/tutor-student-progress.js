import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function TutorStudentProgress() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentsInProgress();
  }, []);

  // ✅ Fetch Students In Progress
  const fetchStudentsInProgress = async () => {
    try {
      const tutorToken = await AsyncStorage.getItem("tutorToken");
      if (!tutorToken) {
        Alert.alert("Error", "You need to log in.");
        return router.push("/tutor-login");
      }
      
      const tokenData = JSON.parse(tutorToken);
      const response = await api.get("/tutors/students-in-progress", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      setStudents(response.data);
    } catch (error) {
      console.error("❌ Error fetching students in progress:", error);
      Alert.alert("Error", "Failed to fetch students in progress.");
      setStudents([]); // Reset list on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students Learning In Progress</Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : students.length === 0 ? (
        <Text style={styles.noRecords}>No students in progress.</Text>
      ) : (
        students.map((student) => (
          <View key={student.id} style={styles.card}>
            <Text>👤 Name: {student.first_name} {student.last_name}</Text>
            <Text> Email: {student.email}</Text>
            <Text> Phone: {student.phone}</Text>
            <Text> Assigned Tutor: {student.tutor_firstname} {student.tutor_lastname}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 5, elevation: 2 },
});