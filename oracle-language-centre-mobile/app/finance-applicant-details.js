import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export default function FinanceApplicantDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get payment_id from URL
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const financeToken = await AsyncStorage.getItem("financeToken");
        if (!financeToken) {
          Alert.alert("Error", "You need to be logged in.");
          return router.push("/finance-login");
        }

        const tokenData = JSON.parse(financeToken);
        const response = await api.get(`/finance/applicant-details/${id}`, {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });

        setApplicant(response.data);
      } catch (error) {
        console.error("❌ Error fetching applicant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetails();
  }, [id]);

  // ✅ Approve Payment
  const approvePayment = async () => {
    try {
      const financeToken = await AsyncStorage.getItem("financeToken");
      if (!financeToken) {
        Alert.alert("Error", "You need to be logged in.");
        return router.push("/finance-login");
      }

      const tokenData = JSON.parse(financeToken);
      await api.put(`/finance/approve-payment/${id}`, {}, {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      Alert.alert("Success", "Payment approved successfully!");
      router.push("/finance-dashboard"); // ✅ Redirect back to dashboard
    } catch (error) {
      console.error("❌ Error approving payment:", error);
      Alert.alert("Error", "Failed to approve payment.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Applicant Details</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : !applicant ? (
        <Text style={styles.noRecords}>Applicant not found.</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.name}>{applicant.first_name} {applicant.last_name}</Text>
          <Text>Email: {applicant.email}</Text>
          <Text>Phone: {applicant.phone}</Text>
          <Text>Course: {applicant.course_name}</Text>
          <Text>Total Fee: Ksh {applicant.total_fee}</Text>
          <Text>Amount Paid: Ksh {applicant.amount_paid}</Text>
          <Text>Balance: Ksh {applicant.balance}</Text>
          <Text>Latest Payment: Ksh {applicant.latest_amount_paid}</Text>
          <Text>Payment Method: {applicant.latest_payment_method}</Text>
          <Text>Reference Code: {applicant.latest_reference_code}</Text>
          <Text>Status: {applicant.latest_status}</Text>

          {/* ✅ Approve Payment Button */}
          {applicant.latest_status === "pending" && (
            <TouchableOpacity style={styles.approveButton} onPress={approvePayment}>
              <Text style={styles.buttonText}>Approve Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 10 },
  loading: { textAlign: "center", marginTop: 20 },
  noRecords: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 18 },
  approveButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});
