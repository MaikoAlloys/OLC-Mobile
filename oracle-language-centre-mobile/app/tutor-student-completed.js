import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const TutorStudentProgress = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState({
        fetch: true,
        action: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(prev => ({ ...prev, fetch: true }));
            setError("");
            setSuccess("");
            
            // Get tutor token from storage
            const tutorToken = await AsyncStorage.getItem("tutorToken");
            if (!tutorToken) {
                throw new Error("Tutor not authenticated");
            }
            
            const tutorData = JSON.parse(tutorToken);
            const tutorId = tutorData.id;

            const response = await api.get(
                `/tutors/in-progress-students/${tutorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${tutorData.token}`
                    }
                }
            );

            setStudents(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error fetching students");
            console.error("Fetch Error:", err);
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    const markCompleted = async (studentId) => {
        try {
            setLoading(prev => ({ ...prev, action: true }));
            setError("");
            setSuccess("");
            
            // Get tutor token from storage
            const tutorToken = await AsyncStorage.getItem("tutorToken");
            if (!tutorToken) {
                throw new Error("Tutor not authenticated");
            }
            
            const tutorData = JSON.parse(tutorToken);

            const response = await api.put(
                `/tutors/mark-completed/${studentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tutorData.token}`
                    }
                }
            );

            setSuccess(response.data.message);
            
            // Update local state to remove the completed student
            setStudents(prevStudents => 
                prevStudents.filter(student => student.student_id !== studentId)
            );
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                           err.message || 
                           "Error updating student status";
            setError(errorMsg);
            console.error("Action Error:", err);
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(prev => ({ ...prev, action: false }));
        }
    };

    if (loading.fetch) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading students...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Students in Progress</Text>
            
            {/* Status Messages */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}
            
            {success ? (
                <View style={styles.successContainer}>
                    <Text style={styles.successText}>{success}</Text>
                </View>
            ) : null}

            {students.length > 0 ? (
                students.map(student => (
                    <View key={`${student.student_id}-${student.assignment_id}`} style={styles.studentCard}>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>
                                <Text style={styles.bold}>{student.first_name} {student.last_name}</Text>
                            </Text>
                            <Text style={styles.courseName}>Course: {student.course_name}</Text>
                            <Text style={styles.dateText}>
                                Started: {new Date(student.assigned_at).toLocaleDateString()}
                            </Text>
                        </View>
                        
                        <TouchableOpacity
                            style={[styles.button, loading.action && styles.buttonDisabled]}
                            onPress={() => markCompleted(student.student_id)}
                            disabled={loading.action}
                        >
                            {loading.action ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.buttonText}>Mark Completed</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No students currently in progress</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#666',
    },
    studentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    studentInfo: {
        marginBottom: 12,
    },
    studentName: {
        fontSize: 18,
        marginBottom: 8,
    },
    courseName: {
        fontSize: 16,
        color: '#555',
        marginBottom: 6,
    },
    dateText: {
        fontSize: 14,
        color: '#777',
        fontStyle: 'italic',
    },
    bold: {
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorText: {
        color: '#c62828',
    },
    successContainer: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    successText: {
        color: '#2e7d32',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});

export default TutorStudentProgress;