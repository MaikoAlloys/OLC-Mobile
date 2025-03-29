import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "./api";

const CourseResourcesScreen = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const params = useLocalSearchParams();
  const router = useRouter();
  const courseId = params.course_id || null;

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) throw new Error("Student ID not found. Please log in again.");
        const studentData = JSON.parse(studentToken);
        setStudentId(studentData.id);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStudentId();
  }, []);

  const fetchResources = () => {
    if (!studentId || !courseId) return;
    setLoading(true);
    api.get(`/students/course-resources/${studentId}/${courseId}`)
      .then(response => {
        setResources(response.data.map(resource => ({
          ...resource,
          status: resource.status || 'available',
          student_confirmed: resource.student_confirmed || 0,
          librarian_submitted: resource.librarian_submitted || 0
        })));
      })
      .catch(err => setError(err.message || "Failed to fetch resources"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResources(); }, [studentId, courseId]);

  const handleRequestResource = (resourceId) => {
    api.post(`/students/resource-request/${studentId}/${courseId}/${resourceId}`)
      .then(() => {
        Alert.alert("Request Sent", "Your request has been submitted successfully.");
        fetchResources();
      })
      .catch(error => {
        if (error.response?.status === 400) {
          Alert.alert("Request Exists", "You've already requested this resource.");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  const renderButton = (item) => {
    if (item.student_confirmed === 1) return null;
    return (
      <View style={styles.buttonContainer}>
        {item.status === "available" && (
          <TouchableOpacity style={styles.requestButton} onPress={() => handleRequestResource(item.id)}>
            <Text style={styles.buttonText}>Request Resource</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.viewButton} onPress={() => router.push(`/resource-requests-details?id=${item.id}`)}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Resources</Text>
      {loading ? <ActivityIndicator size="large" color="#007bff" /> :
        error ? <Text style={styles.errorText}>{error}</Text> :
          resources.length === 0 ? <Text>No resources available.</Text> :
            <FlatList
              data={resources}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.resourceTitle}>{item.name}</Text>
                  <Text style={styles.resourceDate}>Added: {new Date(item.added).toLocaleDateString()}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                  {renderButton(item)}
                </View>
              )}
            />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  card: { borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' },
  resourceTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  resourceDate: { fontSize: 14, color: '#666', marginBottom: 5 },
  status: { fontSize: 14, marginBottom: 10, color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  requestButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  viewButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center' },
  buttonText: { color: 'white', textAlign: 'center' }
});

export default CourseResourcesScreen;
