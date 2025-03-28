import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState(null);

  // Fetch Course Details from Backend
  useEffect(() => {
    axios.get(`http://192.168.100.25:5000/courses/${id}`)
      .then(response => setCourse(response.data))
      .catch(error => console.error("Error fetching course details:", error));
  }, [id]);

  // Handle Course Application
  const handleApply = () => {
    router.push(`/apply-course?id=${id}`); // Redirect to Apply Page
  };

  if (!course) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.detail}>Duration: {course.duration}</Text>
      <Text style={styles.detail}>Fee: Kshs {course.fee}</Text>
      <Text style={styles.description}>{course.description}</Text>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  detail: { fontSize: 18, marginBottom: 5 },
  description: { fontSize: 16, marginTop: 10, textAlign: "center" },
  applyButton: { backgroundColor: "green", padding: 15, marginTop: 20, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
  loading: { fontSize: 18, textAlign: "center", marginTop: 20 },
});
