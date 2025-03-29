import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import api from "./api";

export default function MakePayment() {
    const router = useRouter();
    const { course_id, balance } = useLocalSearchParams(); // course_id and balance from params
    
    const [amountPaid, setAmountPaid] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("mpesa");
    const [referenceCode, setReferenceCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            
            // Get and validate token
            const studentToken = await AsyncStorage.getItem("studentToken");
            if (!studentToken) {
                Alert.alert("Error", "You need to be logged in.");
                return router.push("/student-login");
            }

            const studentData = JSON.parse(studentToken);
            if (!studentData?.token || !studentData?.id) {
                Alert.alert("Error", "Invalid session. Please log in again.");
                await AsyncStorage.removeItem("studentToken");
                return router.push("/student-login");
            }

            // Validate inputs
            if (!amountPaid || !paymentMethod || !referenceCode) {
                return Alert.alert("Error", "Please fill all fields");
            }

            const amount = parseFloat(amountPaid);
            if (isNaN(amount) || amount <= 0) {
                return Alert.alert("Error", "Amount must be greater than 0");
            }

            if (amount > parseFloat(balance)) {
                return Alert.alert("Error", `Amount cannot exceed Ksh ${balance}`);
            }

            // Ensure course_id is a valid number
            const courseId = Number(course_id);
            if (isNaN(courseId)) {
                return Alert.alert("Error", "Invalid course ID");
            }

            // Prepare request
            const config = {
                headers: {
                    Authorization: `Bearer ${studentData.token}`,
                    'Content-Type': 'application/json'
                }
            };

            const payload = {
                course_id: courseId,
                student_id: studentData.id, // Add student ID here
                payment_method: paymentMethod,
                reference_code: referenceCode.toUpperCase(),
                amount_paid: amount
            };

            console.log("Sending payment request with:", payload);

            const response = await api.post(
                "/payments/additional",
                payload,
                config
            );

            Alert.alert("Success", response.data.message);
            router.push("/fees");
        } catch (error) {
            console.error("Payment Error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.config?.headers
            });

            // Improved error handling
            if (error.response) {
                console.error("API Error:", error.response.data);
                console.error("Status Code:", error.response.status);
                console.error("Response Headers:", error.response.headers);
            } else {
                console.error("Error:", error.message);
            }

            if (error.response?.status === 401) {
                Alert.alert("Session Expired", "Please log in again");
                await AsyncStorage.removeItem("studentToken");
                router.push("/student-login");
            } else {
                const errorMessage = error.response?.data?.message || "Payment failed. Please try again.";
                Alert.alert("Error", errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Make a Payment</Text>
            <Text>Remaining Balance: Ksh {balance}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amountPaid}
                onChangeText={setAmountPaid}
            />

            <Text style={styles.label}>Select Payment Method</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Mpesa" value="mpesa" />
                    <Picker.Item label="Bank" value="bank" />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Reference Code"
                value={referenceCode}
                onChangeText={(text) => setReferenceCode(text.toUpperCase())}
            />

            <TouchableOpacity 
                style={[styles.button, loading && styles.disabledButton]} 
                onPress={handlePayment}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Submit Payment</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, textAlign: "center", marginBottom: 10 },
    label: { marginTop: 10, fontSize: 16 },
    pickerContainer: { borderWidth: 1, borderRadius: 5, backgroundColor: "#fff", marginBottom: 10 },
    picker: { height: 50, width: "100%" },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, backgroundColor: "#fff", borderRadius: 5 },
    button: { backgroundColor: "#333", padding: 10, borderRadius: 5, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16 },
    disabledButton: { backgroundColor: "#cccccc" }
});
