import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function FinanceDashboard() {
  const router = useRouter();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-250))[0];

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const financeToken = await AsyncStorage.getItem("financeToken");
        if (!financeToken) {
          Alert.alert("Error", "You need to be logged in.");
          return router.push("/finance-login");
        }

        const tokenData = JSON.parse(financeToken);
        const response = await api.get("/finance/new-applicants", {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });

        setApplicants(response.data);
      } catch (error) {
        console.error("❌ Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    router.push("/finance-login");
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}> 
        <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>

        <View style={styles.sidebarMenu}>
          <TouchableOpacity onPress={() => router.push("/finance-dashboard")}>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/finance-profile")}>
            <Text style={styles.navItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/finance-dashboard")}>
            <Text style={styles.navItem}>Pending Students</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/approved-students")}>
            <Text style={styles.navItem}>Approved Students</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/cleared-students")}>
            <Text style={styles.navItem}>Cleared Students</Text>
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
      <Text style={styles.title}>Finance Dashboard</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : applicants.length === 0 ? (
        <Text style={styles.noRecords}>No new applicants found.</Text>
      ) : (
        <FlatList
          data={applicants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.applicantName}>{item.first_name} {item.last_name}</Text>
              <Text>Course: {item.course_name}</Text>
              <Text>Status: {item.status}</Text>

              {/* View Button */}
              <TouchableOpacity 
                style={styles.viewButton} 
                onPress={() => router.push(`/finance-applicant-details?id=${item.payment_id}`)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  sidebar: { position: "absolute", left: -250, width: 250, height: "100%", backgroundColor: "#222", padding: 20, zIndex: 10 },
  closeButton: { alignSelf: "flex-end", marginBottom: 20 },
  closeText: { color: "white", fontSize: 18 },
  sidebarMenu: { marginTop: 10 },
  navItem: { color: "white", fontSize: 18, marginBottom: 20 },
  logout: { color: "red" },
  menuButton: { position: "absolute", top: 20, left: 20, zIndex: 20 },
  menuText: { fontSize: 24, color: "black" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 5, elevation: 2 },
  applicantName: { fontSize: 18, fontWeight: "bold" },
  viewButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});
