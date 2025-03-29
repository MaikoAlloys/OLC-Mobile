import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Button } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import api from "./api";

export default function StudentActiveCourse() {
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchActiveCourse = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) {
          throw new Error("You need to log in first");
        }

        const studentData = JSON.parse(studentToken);
        if (!studentData?.id) {
          throw new Error("Invalid student token");
        }

        console.log("Fetching active course for student_id:", studentData.id);

        const response = await api.get(
          `/students/active-course/${studentData.id}`
        );

        if (response.data) {
          console.log("Received Active Course Data:", response.data);
          setActiveCourse(response.data);
        } else {
          console.log("No active course found.");
          setActiveCourse(null);
        }
      } catch (error) {
        console.error("Error fetching active course:", error.message);
        setError(error.message);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCourse();
  }, []);

  const handleSignAttendance = async () => {
    try {
      const studentToken = await AsyncStorage.getItem("studentToken");
      if (!studentToken) {
        throw new Error("You need to log in first");
      }

      const studentData = JSON.parse(studentToken);
      const { id: studentId } = studentData;
      const { tutor_id: tutorId, course_id: courseId } = activeCourse;

      // Convert IDs to numbers explicitly
      const payload = {
        studentId: Number(studentId),
        tutorId: Number(tutorId),
        courseId: Number(courseId)
      };

      console.log("Sending attendance payload:", payload);

      const response = await api.post(
        "/students/mark-attendance", 
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Attendance response:", response.data);

      if (response.data.success) {
        setAttendanceMarked(true);
        setAttendanceData(response.data);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      let errorMessage = "Failed to mark attendance";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                       error.response.statusText || 
                       `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from server";
      }
      Alert.alert("Error", errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Course</Text>

      {activeCourse ? (
        <TouchableOpacity
          style={styles.courseCard}
          onPress={() => {
            router.push({
              pathname: "/course-resources",
              params: {
                student_id: String(activeCourse.student_id),
                course_id: String(activeCourse.course_id),
              },
            });
          }}
        >
          <Text style={styles.label}>Course Name:</Text>
          <Text style={styles.value}>{activeCourse.course_name}</Text>

          <Text style={styles.label}>Tutor:</Text>
          <Text style={styles.value}>
            {activeCourse.tutor_first_name} {activeCourse.tutor_last_name}
          </Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>Learning in progress</Text>

          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {new Date(activeCourse.assigned_at).toDateString()}
          </Text>

          <Text style={styles.clickableText}>Click to view</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noCourse}>No active course enrolled</Text>
      )}

      {activeCourse && !attendanceMarked ? (
        <View style={styles.attendanceForm}>
          <Text style={styles.attendanceText}>Attendance for: {activeCourse.course_name}</Text>
          <Text style={styles.attendanceText}>Attendance is active</Text>
          <Button 
            title="Sign Attendance" 
            onPress={handleSignAttendance} 
            color="#4CAF50"
          />
        </View>
      ) : attendanceMarked && attendanceData ? (
        <View style={styles.attendanceSuccess}>
          <Text style={styles.attendanceSuccessText}>
            Attendance for {attendanceData.courseName} marked successfully!
          </Text>
          <Text style={styles.attendanceTime}>
            Signed at: {new Date(attendanceData.timestamp).toLocaleString()}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  courseCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  label: { fontSize: 16, marginTop: 10, fontWeight: "bold" },
  value: { fontSize: 16, color: "#333", marginBottom: 10 },
  clickableText: {
    marginTop: 10,
    fontSize: 14,
    color: "blue",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  noCourse: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  attendanceForm: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
  },
  attendanceText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  attendanceSuccess: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  attendanceSuccessText: {
    fontSize: 16,
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  attendanceTime: {
    fontSize: 14,
    color: "#2E7D32",
    textAlign: "center",
    fontStyle: "italic",
  },
});