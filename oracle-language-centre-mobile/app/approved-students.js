import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";


export default function ApprovedStudents() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedStudents = async () => {
    try {
      // ✅ Retrieve stored token
      const financeToken = await AsyncStorage.getItem("financeToken");

      if (!financeToken) {
        Alert.alert("Error", "You need to log in.");
        return router.push("/finance-login");
      }

      const tokenData = JSON.parse(financeToken);

      if (!tokenData?.token) {
        Alert.alert("Error", "Authentication error. Please log in again.");
        return router.push("/finance-login");
      }

      console.log("✅ Parsed Finance Token:", tokenData.token);

      // ✅ Make API request with token
      const response = await api.get("/finance/approved-students", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      console.log("✅ API Response:", response.data);

      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("❌ Error fetching approved students:", error);

      if (error.response) {
        console.log("❌ API Error Response:", error.response.data);
      }

      if (error.response?.status === 401) {
        Alert.alert("Error", "Your session has expired. Please log in again.");
        router.push("/finance-login");
      } else {
        Alert.alert("Error", "Failed to fetch approved students. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedStudents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approved Students</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : students.length === 0 ? (
        <Text style={styles.noRecords}>No approved students found.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.courseName}>{item.course_name}</Text>
              <Text>👤 Name: {item.first_name} {item.last_name}</Text>
              <Text>    Course: {item.course_name}</Text>
              <Text>    Amount Paid: Ksh {item.amount_paid}</Text>
              <Text>🟢 Status: {item.status}</Text>
            </View>
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
  courseName: { fontSize: 18 },
});
