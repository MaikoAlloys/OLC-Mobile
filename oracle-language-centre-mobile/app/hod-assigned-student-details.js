import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "./api";

export default function HODAssignedStudentDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
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
        <ActivityIndicator size="large" color="#3498db" />
      ) : student ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.studentName}>{student.first_name} {student.last_name}</Text>
            <Text style={styles.courseBadge}>{student.course_name}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Assignment Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tutor:</Text>
              <Text style={styles.detailValue}>{student.tutor_firstname} {student.tutor_lastname}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned On:</Text>
              <Text style={styles.detailValue}>{new Date(student.assigned_at).toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusText}>Active Assignment</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.error}>No student details found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f8f9fa" 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '600',
    textAlign: "center", 
    marginBottom: 25,
    color: '#2c3e50'
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea'
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  courseBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500'
  },
  detailSection: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 6
  },
  detailLabel: {
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '500',
    width: '35%'
  },
  detailValue: {
    fontSize: 15,
    color: '#34495e',
    fontWeight: '500',
    width: '65%',
    textAlign: 'right'
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  statusText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500'
  },
  error: { 
    fontSize: 16, 
    color: "#e74c3c", 
    textAlign: "center", 
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fdecea',
    borderRadius: 8
  }
});