import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import api from "./api";

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses"); // ✅ Fetch Courses
        if (response.data.length === 0) {
          setCourses([]);
        } else {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
        Alert.alert("Error", "Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Courses</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : courses.length === 0 ? (
        <Text style={styles.noCourses}>No courses available.</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.courseItem}
              onPress={() => router.push(`/course-details?id=${item.id}`)}
            >
              <Text style={styles.courseText}>{index + 1}. {item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noCourses: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  courseItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  courseText: { fontSize: 18, fontWeight: "bold" },
});
