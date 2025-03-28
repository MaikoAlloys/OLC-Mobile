import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) {
          console.error("User not logged in");
          return;
        }

        const studentData = JSON.parse(studentToken);
        const studentId = studentData.id;

        const response = await axios.get(`http://192.168.100.25:5000/applications/${studentId}`);
        const fetchedApplications = response.data;

        if (Array.isArray(fetchedApplications) && fetchedApplications.length > 0) {
          setApplications(fetchedApplications);
        } else {
          setApplications([]); // ✅ Ensure it's an empty array if no data
        }
      } catch (error) {
        console.error("❌ Error fetching applications:", error);
        setApplications([]); // ✅ Prevents errors from breaking UI
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : applications.length === 0 ? ( // ✅ Now properly checking for no records
        <Text style={styles.noRecords}>No application record found.</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.courseName}>{item.course_name}</Text>
              <Text>Fee: Ksh {item.fee}</Text>
              <Text>Fee Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  noRecords: { fontSize: 18, color: "gray", textAlign: "center", marginTop: 20 }, // ✅ Styled message
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 5, elevation: 2 },
  courseName: { fontSize: 18, fontWeight: "bold" },
});
