import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function StudentDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-250))[0];

  // Fetch Courses from Backend
  useEffect(() => {
    axios.get("http://192.168.100.25:5000/courses")
      .then(response => {
        setCourses(response.data);
        setFilteredCourses(response.data);
      })
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  // Toggle Sidebar with Animation
  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  // Logout Function using AsyncStorage
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("studentToken");
      router.push("/student-login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Search Functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course =>
        course.name.toLowerCase().includes(query.toLowerCase())
      ));
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sidebarMenu}>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/dashboard"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/profile"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/courses"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/applications"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Applications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/student-active-course"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Active Course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/fees"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Fees</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/certificates"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Certificates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/about"); toggleSidebar(); }}>
            <Text style={styles.navItem}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/contacts"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => { router.push("/help"); toggleSidebar(); }}>
            <Text style={styles.navItem}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.navItem, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Courses</Text>
          <View style={styles.headerRight}></View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Courses List */}
        <View style={styles.content}>
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => router.push(`/course-details?id=${item.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.courseName}>{item.name}</Text>
                </View>
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{item.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fee:</Text>
                    <Text style={styles.detailValue}>Kshs {item.fee}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => router.push(`/course-details?id=${item.id}`)}
                >
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No courses found</Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#4a6da7",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  headerRight: {
    width: 30, // For balance
  },
  menuButton: {
    padding: 5,
  },
  menuText: {
    fontSize: 24,
    color: "white",
  },
  sidebar: {
    position: "absolute",
    left: -250,
    width: 250,
    height: "100%",
    backgroundColor: "#2c3e50",
    paddingTop: 50,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  sidebarTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    color: "white",
    fontSize: 18,
  },
  sidebarMenu: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  navButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  navItem: {
    color: "#ecf0f1",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#e74c3c",
    fontWeight: "600",
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "#f0f2f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 15,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  cardDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  detailValue: {
    color: "#2c3e50",
    fontSize: 14,
    fontWeight: "500",
  },
  viewButton: {
    backgroundColor: "#4a6da7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});