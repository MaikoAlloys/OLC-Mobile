import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";
import { Ionicons } from "@expo/vector-icons"; // Import icons

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
              activeOpacity={0.7} // Adds nice press effect
            >
              <View style={styles.cardHeader}>
                <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
              <Text style={styles.courseText}>{item.course_name}</Text>
              <Text style={styles.detailText}>Tutor: {item.tutor_firstname} {item.tutor_lastname}</Text>
              <Text style={styles.detailText}>Assigned: {new Date(item.assigned_at).toLocaleString()}</Text>
              <Text style={styles.viewDetailsText}>View details</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { 
    fontSize: 24, 
    fontWeight: '600',
    textAlign: "center", 
    marginBottom: 20,
    color: '#333'
  },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db', // Adds a colored accent to the card
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#2c3e50'
  },
  courseText: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 4,
    fontWeight: '500'
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  viewDetailsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#3498db',
    textAlign: 'right',
    fontStyle: 'italic'
  }
});