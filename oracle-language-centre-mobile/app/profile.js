import { View, Text, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Profile() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) {
          Alert.alert("Error", "You need to log in first.");
          return;
        }

        const studentData = JSON.parse(studentToken);
        const response = await axios.get(`http://192.168.100.25:5000/students/${studentData.id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        Alert.alert("Error", "Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Profile</Text>

      {student ? (
        <View style={styles.profileCard}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{student.first_name} {student.last_name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{student.phone}</Text>
        </View>
      ) : (
        <Text style={styles.loading}>Loading profile...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  profileCard: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%", elevation: 3 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#333" },
  loading: { fontSize: 16, marginTop: 20, color: "gray" },
});
