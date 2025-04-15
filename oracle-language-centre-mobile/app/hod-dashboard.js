import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function HODDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-250))[0];

  const fetchApprovedStudents = async () => {
    try {
      const hodToken = await AsyncStorage.getItem("hodToken");
      if (!hodToken) {
        // If no token is found, simply return without showing an alert
        return;
      }

      const tokenData = JSON.parse(hodToken);
      const response = await api.get("/hod/approved-students", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("❌ Error fetching approved students:", error);
      Alert.alert("Error", "Failed to fetch approved students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedStudents();
  }, []);

  const assignTutor = (studentId) => {
    router.push(`/assign-tutor?studentId=${studentId}`);
  };

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    AsyncStorage.removeItem("hodToken");
    router.push("/");
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <View style={styles.sidebarMenu}>
          <TouchableOpacity onPress={() => router.push("/hod-dashboard")}>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/hod-profile")}>
            <Text style={styles.navItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/hod-assigned-students")}>
            <Text style={styles.navItem}>Assigned Students</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/hod-feedbacks")}>
            <Text style={styles.navItem}>Feedbacks</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.navItem, styles.logout]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sidebar Toggle Button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <Text style={styles.title}>HOD Dashboard</Text>

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
              <Text>👤 Name: {item.first_name} {item.last_name}</Text>
              <Text>📜 Course: {item.course_name}</Text>

              {!item.tutor_id ? (
                <TouchableOpacity style={styles.assignButton} onPress={() => assignTutor(item.student_id)}>
                  <Text style={styles.buttonText}>Assign Tutor</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.assignedText}>✅ Assigned</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  sidebar: { position: "absolute", left: -250, width: 250, height: "100%", backgroundColor: "#222", padding: 20, zIndex: 10 },
  closeButton: { alignSelf: "flex-end", marginBottom: 20 },
  closeText: { color: "white", fontSize: 18 },
  sidebarMenu: { marginTop: 10 },
  navItem: { color: "white", fontSize: 18, marginBottom: 20 },
  logout: { color: "red" },
  menuButton: { position: "absolute", top: 20, left: 20, zIndex: 20 },
  menuText: { fontSize: 24, color: "black" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 5, elevation: 2 },
  assignButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  assignedText: { color: "green", fontSize: 16, fontWeight: "bold", marginTop: 10 }
});