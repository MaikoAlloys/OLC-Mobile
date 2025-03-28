import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import generateCertificate from "../utils/generateCertificate";

export default function Certificates() {
    const router = useRouter();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const studentToken = await AsyncStorage.getItem("studentToken");
                if (!studentToken) {
                    Alert.alert("Error", "You need to be logged in.");
                    return router.push("/student-login");
                }

                const studentData = JSON.parse(studentToken);
                setStudentId(studentData.id);

                const response = await axios.get(
                    `http://192.168.100.25:5000/payments/certificate-eligibility/${studentData.id}`,
                    {
                        headers: { Authorization: `Bearer ${studentData.token}` },
                    }
                );
                setCertificates(response.data);
            } catch (error) {
                console.error("Error fetching certificates:", error);
                Alert.alert("Error", "Failed to fetch certificates");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const downloadCertificate = async (courseId, courseName) => {
        setGenerating(true);
        try {
            if (!studentId) {
                throw new Error("Student information not available");
            }
            
            Alert.alert("Generating", "Preparing your certificate...");
            
            const savedFilePath = await generateCertificate(
                studentId,
                courseId,
                courseName
            );

            Alert.alert("Success", `Certificate saved at: ${savedFilePath}`);
            
        } catch (error) {
            console.error("Certificate generation error:", error);
            Alert.alert("Error", error.message || "Failed to generate certificate");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>My Certificates</Text>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading your certificates...</Text>
                </View>
            ) : certificates.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <AntDesign name="filetext1" size={60} color="#cccccc" />
                    <Text style={styles.emptyText}>No certificates available yet</Text>
                </View>
            ) : (
                certificates.map((cert, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.courseName}>{cert.course_name}</Text>
                        <View style={styles.statusContainer}>
                            {cert.eligible_for_certificate ? (
                                <>
                                    <View style={styles.eligibleBadge}>
                                        <AntDesign name="checkcircle" size={16} color="#4CAF50" />
                                        <Text style={styles.eligibleText}>Eligible</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={[styles.downloadButton, generating && styles.disabledButton]}
                                        onPress={() => downloadCertificate(cert.course_id, cert.course_name)}
                                        disabled={generating}
                                    >
                                        {generating ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <>
                                                <AntDesign name="download" size={16} color="white" />
                                                <Text style={styles.buttonText}>Download</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.notEligibleBadge}>
                                    <AntDesign name="clockcircle" size={16} color="#FF9800" />
                                    <Text style={styles.notEligibleText}>Not Eligible Yet</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 25,
        color: "#333",
        textAlign: "center",
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
        elevation: 3,
    },
    courseName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    eligibleBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    eligibleText: {
        marginLeft: 6,
        color: "#2E7D32",
        fontWeight: "500",
    },
    notEligibleBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3E0",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    notEligibleText: {
        marginLeft: 6,
        color: "#EF6C00",
        fontWeight: "500",
    },
    downloadButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    disabledButton: {
        backgroundColor: "#A5D6A7",
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        padding: 20,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});