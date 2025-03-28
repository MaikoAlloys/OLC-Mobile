import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function TutorDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Track sidebar state
  const sidebarAnim = useRef(new Animated.Value(-250)).current; // Sidebar Animation Ref

  useEffect(() => {
    fetchAssignedStudents();
  }, []);

  // ✅ Fetch Assigned Students
  const fetchAssignedStudents = async () => {
    try {
      const tutorToken = await AsyncStorage.getItem("tutorToken");
      if (!tutorToken) {
        Alert.alert("Error", "You need to log in.");
        return router.push("/tutor-login");
      }

      const tokenData = JSON.parse(tutorToken);
      const response = await axios.get("http://192.168.100.25:5000/tutors/assigned-students", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      setStudents(response.data);
    } catch (error) {
      console.error("❌ Error fetching assigned students:", error);
      Alert.alert("Error", "Failed to fetch assigned students.");
      setStudents([]); // Reset students on error
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark Learning in Progress (Fixed)
  const markInProgress = async (studentId) => {
    try {
      const tutorToken = await AsyncStorage.getItem("tutorToken");
      const tokenData = JSON.parse(tutorToken);

      const response = await axios.put(
        `http://192.168.100.25:5000/tutors/mark-in-progress/${studentId}`,
        {},
        { headers: { Authorization: `Bearer ${tokenData.token}` } }
      );

      Alert.alert("Success", response.data.message);
      fetchAssignedStudents(); // Refresh list
    } catch (error) {
      console.error("❌ Error marking student in progress:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update status.");
    }
  };

  // ✅ Toggle Sidebar
  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen); // Update sidebar state
  };

  // ✅ Handle Logout
  const handleLogout = async () => {
    // await AsyncStorage.removeItem("tutorToken"); // Clear token
    router.push("/tutor-login"); // Redirect to login
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <View style={styles.sidebarMenu}>
          <TouchableOpacity onPress={() => router.push("/tutor-dashboard")}>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tutor-profile")}>
            <Text style={styles.navItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tutor-dashboard")}>
            <Text style={styles.navItem}>Students Assigned</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tutor-student-progress")}>
            <Text style={styles.navItem}>Students Learning in Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tutor-student-completed")}>
            <Text style={styles.navItem}>Students Completed Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.navItem, styles.logout]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Menu Button to Open Sidebar */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tutor Dashboard</Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : students.length === 0 ? (
        <Text style={styles.noRecords}>No assigned students.</Text>
      ) : (
        students.map((student) => (
          <View key={student.student_id} style={styles.card}>
            <Text>👤 Name: {student.first_name} {student.last_name}</Text>
            <Text>📜 Course: {student.course_name}</Text>
            <TouchableOpacity style={styles.button} onPress={() => markInProgress(student.student_id)}>
              <Text style={styles.buttonText}>Mark Learning In Progress</Text>
            </TouchableOpacity>
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
  button: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  menuButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  menuText: { fontSize: 30 },
  sidebar: { position: "absolute", left: -250, top: 0, bottom: 0, width: 250, backgroundColor: "#333", paddingTop: 50, paddingLeft: 20, zIndex: 20 },
  closeButton: { position: "absolute", top: 10, right: 10 },
  closeText: { fontSize: 20, color: "#fff" },
  sidebarMenu: { marginTop: 20 },
  navItem: { fontSize: 18, color: "#fff", marginBottom: 15 },
  logout: { color: "red" },
});
