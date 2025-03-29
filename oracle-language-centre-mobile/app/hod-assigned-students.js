import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function HODAssignedStudents() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedStudents();
  }, []);

  const fetchAssignedStudents = async () => {
    try {
      const hodToken = await AsyncStorage.getItem("hodToken");
      if (!hodToken) {
        Alert.alert("Error", "You need to log in.");
        return router.push("/hod-login");
      }

      const tokenData = JSON.parse(hodToken);
      const response = await api.get("/hod/assigned-students", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      setStudents(response.data);
    } catch (error) {
      console.error("❌ Error fetching assigned students:", error);
      Alert.alert("Error", "Failed to fetch assigned students.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Students</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : students.length === 0 ? (
        <Text style={styles.noRecords}>No assigned students found.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.assignment_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => router.push(`/hod-assigned-student-details?id=${item.assignment_id}`)}
            >
              <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
              <Text> {item.course_name}</Text>
              <Text> Tutor: {item.tutor_firstname} {item.tutor_lastname}</Text>
              <Text> Assigned: {new Date(item.assigned_at).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
        />
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
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  studentName: { fontSize: 18, fontWeight: "bold" },
});
