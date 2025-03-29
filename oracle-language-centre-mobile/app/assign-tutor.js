import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Updated import
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api";

export default function AssignTutor() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchTutors();
  }, []);

  // ✅ Fetch Approved Students
  const fetchStudents = async () => {
    try {
      const hodToken = await AsyncStorage.getItem("hodToken");
      if (!hodToken) {
        Alert.alert("Error", "You need to log in.");
        return router.push("/hod-login");
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
      Alert.alert("Error", "Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Tutors (Fixed API URL)
  const fetchTutors = async () => {
    try {
      const response = await api.get("/tutors/all");
      console.log("✅ Tutors API Response:", response.data); // Debugging

      if (Array.isArray(response.data)) {
        setTutors(response.data);
      } else {
        setTutors([]);
      }
    } catch (error) {
      console.error("❌ Error fetching tutors:", error);
      Alert.alert("Error", "Failed to fetch tutors.");
    }
  };

  // ✅ Assign Tutor to Student
  const assignTutor = async () => {
    if (!selectedStudent || !selectedTutor) {
      return Alert.alert("Error", "Please select a student and a tutor.");
    }

    try {
      const hodToken = await AsyncStorage.getItem("hodToken");
      const tokenData = JSON.parse(hodToken);

      console.log("Sending request with:", { student_id: selectedStudent, tutor_id: selectedTutor }); // Debugging

      const response = await api.post(
        "/hod/assign-tutor",
        { student_id: selectedStudent, tutor_id: selectedTutor },
        { headers: { Authorization: `Bearer ${tokenData.token}` } }
      );

      Alert.alert("Success", response.data.message);

      // ✅ Remove assigned student from list
      setStudents(prevStudents => prevStudents.filter(student => student.student_id !== selectedStudent));

      setSelectedStudent(null);
      setSelectedTutor(null);
    } catch (error) {
      console.error("❌ Error assigning tutor:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to assign tutor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Tutor</Text>

      {/* Select Student */}
      <Text style={styles.label}>Select Student:</Text>
      <Picker
        selectedValue={selectedStudent}
        onValueChange={(itemValue) => setSelectedStudent(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Student" value={null} />
        {students.length > 0 ? (
          students.map((student) => (
            <Picker.Item key={student.student_id} label={`${student.first_name} ${student.last_name} - ${student.course_name}`} value={student.student_id} />
          ))
        ) : (
          <Picker.Item label="No students found" value={null} />
        )}
      </Picker>

      {/* Select Tutor */}
      <Text style={styles.label}>Select Tutor:</Text>
      <Picker
        selectedValue={selectedTutor}
        onValueChange={(itemValue) => setSelectedTutor(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Tutor" value={null} />
        {tutors.length > 0 ? (
          tutors.map((tutor) => (
            <Picker.Item key={tutor.id} label={`${tutor.firstname} ${tutor.lastname}`} value={tutor.id} />
          ))
        ) : (
          <Picker.Item label="No tutors found" value={null} />
        )}
      </Picker>

      {/* Assign Tutor Button */}
      <TouchableOpacity style={styles.assignButton} onPress={assignTutor}>
        <Text style={styles.buttonText}>Assign Tutor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  label: { fontSize: 18, marginBottom: 5 },
  picker: { height: 50, backgroundColor: "#fff", marginBottom: 10 },
  assignButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16 },
});