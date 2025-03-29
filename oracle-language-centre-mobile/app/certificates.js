import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView, Platform } from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import api from "./api";

export default function Certificates() {
    const router = useRouter();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const [certificateDetails, setCertificateDetails] = useState(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const certificateRef = useRef();

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

                const response = await api.get(
                    `/payments/certificate-eligibility/${studentData.id}`,
                    { headers: { Authorization: `Bearer ${studentData.token}` } }
                );
                setCertificates(response.data);
            } catch (error) {
                console.error("Error fetching certificates:", error);
                Alert.alert("Error", error.response?.data?.message || "Failed to fetch certificates");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const fetchCertificateDetails = async (courseId) => {
        setGenerating(true);
        try {
            const studentToken = await AsyncStorage.getItem("studentToken");
            const { token } = JSON.parse(studentToken);

            const response = await api.get(
                `/payments/certificate-details/${studentId}/${courseId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Generate a certificate ID using studentId, courseId and current timestamp
            const certificateId = `OLC-${studentId}-${courseId}-${Date.now()}`;
            
            setCertificateDetails({
                ...response.data,
                certificateId,
                completionDate: response.data.issueDate // Using issueDate as completion date
            });
            setShowCertificate(true);
        } catch (error) {
            console.error("Error fetching certificate details:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to fetch certificate details");
        } finally {
            setGenerating(false);
        }
    };

    const saveToGallery = async (uri) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission required", "Please allow access to your photos to save certificates");
                return;
            }
            
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('Certificates', asset, false);
            Alert.alert("Success", "Certificate saved to your gallery!");
        } catch (error) {
            console.error("Error saving to gallery:", error);
            Alert.alert("Error", "Failed to save certificate to gallery");
        }
    };

    const handlePrintCertificate = async () => {
        try {
            const uri = await captureRef(certificateRef, {
                format: 'png',
                quality: 1,
            });

            Alert.alert(
                "Save Certificate",
                "Would you like to save or share your certificate?",
                [
                    {
                        text: "Save to Gallery",
                        onPress: () => saveToGallery(uri)
                    },
                    {
                        text: "Share",
                        onPress: () => Sharing.shareAsync(uri, {
                            mimeType: 'image/png',
                            dialogTitle: 'Share Certificate',
                        })
                    },
                    {
                        text: "Cancel",
                        style: "cancel"
                    }
                ]
            );
        } catch (error) {
            console.error("Error capturing certificate:", error);
            Alert.alert("Error", "Failed to save certificate image");
        }
    };

    const CertificateCard = ({ details }) => (
        <View ref={certificateRef} style={styles.certificateContainer}>
            <View style={styles.certificateHeader}>
                <Text style={styles.certificateTitle}>Certificate of Completion</Text>
                <Text style={styles.certificateSubtitle}>Oracle Language Centre</Text>
            </View>
            
            <View style={styles.certificateBody}>
                <Text style={styles.certificateText}>This is to certify that</Text>
                <Text style={styles.certificateName}>{details.studentName}</Text>
                <Text style={styles.certificateText}>has successfully completed the course</Text>
                <Text style={styles.certificateCourse}>{details.courseName}</Text>
                
                <View style={styles.signatureContainer}>
                    <View style={styles.signatureImage}>
                        <Text style={styles.signatureText}>Oracle Language Centre</Text>
                    </View>
                    <View style={styles.signatureLine}></View>
                    <Text style={styles.signatureLabel}>Authorized Signature</Text>
                </View>
                
                <View style={styles.detailsContainer}>
                    <Text style={styles.certificateDetail}>
                        Issued on: {new Date(details.completionDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </Text>
                    <Text style={styles.certificateDetail}>
                        Certificate ID: {details.certificateId}
                    </Text>
                </View>
            </View>
            
            <View style={styles.certificateFooter}>
                <Text style={styles.footerText}>Verified by Oracle Language Centre</Text>
            </View>
        </View>
    );

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
                <>
                    {certificates.map((cert, index) => (
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
                                            onPress={() => fetchCertificateDetails(cert.course_id)}
                                            disabled={generating}
                                        >
                                            {generating ? (
                                                <ActivityIndicator color="white" size="small" />
                                            ) : (
                                                <>
                                                    <AntDesign name="download" size={16} color="white" />
                                                    <Text style={styles.buttonText}>View Certificate</Text>
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
                    ))}

                    {showCertificate && certificateDetails && (
                        <View style={styles.certificateWrapper}>
                            <CertificateCard details={certificateDetails} />
                            <TouchableOpacity 
                                style={styles.printButton}
                                onPress={handlePrintCertificate}
                            >
                                <AntDesign name="save" size={20} color="white" />
                                <Text style={styles.printButtonText}>Save/Share Certificate</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
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
    certificateWrapper: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center',
    },
    certificateContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    certificateHeader: {
        backgroundColor: '#4CAF50',
        padding: 25,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#3d8b40',
    },
    certificateTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
    },
    certificateSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
        fontStyle: 'italic',
    },
    certificateBody: {
        padding: 30,
        alignItems: 'center',
    },
    certificateText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
        textAlign: 'center',
    },
    certificateName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginVertical: 20,
        textDecorationLine: 'underline',
        textDecorationColor: '#4CAF50',
    },
    certificateCourse: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginVertical: 20,
        textAlign: 'center',
    },
    signatureContainer: {
        marginVertical: 30,
        alignItems: 'center',
        width: '100%',
    },
    signatureImage: {
        marginBottom: 10,
    },
    signatureText: {
        fontSize: 24,
        color: '#333',
        fontFamily: 'serif',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
    signatureLine: {
        width: 200,
        height: 1,
        backgroundColor: '#333',
        marginBottom: 5,
    },
    signatureLabel: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    detailsContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    certificateDetail: {
        fontSize: 14,
        color: '#555',
        marginVertical: 5,
        textAlign: 'center',
    },
    certificateFooter: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerText: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
    },
    printButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    printButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
        fontSize: 16,
    },
});