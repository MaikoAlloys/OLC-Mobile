import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

export default function Fees() {
  const router = useRouter();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentFullName, setStudentFullName] = useState("");
  const receiptRefs = useRef({});

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) {
          Alert.alert("Error", "You need to be logged in.");
          return router.push("/student-login");
        }

        const studentData = JSON.parse(studentToken);

        const profileResponse = await axios.get(`http://192.168.100.25:5000/students/${studentData.id}`, {
          headers: { Authorization: `Bearer ${studentData.token}` },
        });

        if (profileResponse.data) {
          setStudentFullName(`${profileResponse.data.first_name} ${profileResponse.data.last_name}`);
        }

        const feesResponse = await axios.get(`http://192.168.100.25:5000/payments/fees/${studentData.id}`, {
          headers: { Authorization: `Bearer ${studentData.token}` },
        });

        setFees(feesResponse.data.message ? [] : feesResponse.data);
      } catch (error) {
        console.error("Error fetching fees:", error);
        Alert.alert("Error", "Failed to fetch fee records");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const captureReceipt = async (index) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Permission Denied", "You need to grant permission to save images.");
      }

      const uri = await captureRef(receiptRefs.current[index], {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Receipt Saved", "Your receipt has been saved to your gallery.");
    } catch (error) {
      console.error("Error capturing receipt:", error);
      Alert.alert("Error", "Failed to capture receipt.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fees Payment</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : fees.length === 0 ? (
        <Text style={styles.noRecords}>No fee records found.</Text>
      ) : (
        <FlatList
          data={fees}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.feeItemContainer}>
              <View 
                style={styles.receiptContainer} 
                ref={(ref) => (receiptRefs.current[index] = ref)}
                collapsable={false} 
              >
                <Text style={styles.receiptHeader}>Oracle Language Center</Text>
                <Text style={styles.receiptSubHeader}>Fee Statement</Text>
                <Text style={styles.studentName}>👤 Name: {studentFullName}</Text>
                <View style={styles.card}>
                  <Text style={styles.courseName}>{item.course_name}</Text>
                  <Text>Total Fee: Ksh {item.total_fee}</Text>
                  <Text>Amount Paid: Ksh {item.amount_paid}</Text>
                  <Text>Balance: Ksh {item.balance}</Text>
                  <Text>Latest Payment: Ksh {item.latest_amount_paid}</Text>
                  <Text>Payment Method: {item.latest_payment_method}</Text>
                  <Text>Reference Code: {item.latest_reference_code}</Text>
                  <Text>Status: {item.status}</Text>
                  <Text>Payment Date: {new Date(item.latest_payment_date).toDateString()}</Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.printButton} 
                  onPress={() => captureReceipt(index)}
                >
                  <Text style={styles.buttonText}>Download Receipt</Text>
                </TouchableOpacity>

                {item.balance > 0 && (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => router.push({ 
                      pathname: "/make-payment", 
                      params: { 
                        course_id: item.course_id, 
                        balance: item.balance 
                      } 
                    })}
                  >
                    <Text style={styles.buttonText}>Make Payment</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f5f5f5" 
  },
  title: { 
    fontSize: 24, 
    textAlign: "center", 
    marginBottom: 20 
  },
  loading: { 
    textAlign: "center", 
    marginTop: 20 
  },
  noRecords: { 
    textAlign: "center", 
    fontSize: 16, 
    color: "red", 
    marginTop: 20 
  },
  feeItemContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    elevation: 2,
  },
  courseName: { 
    fontSize: 18, 
    marginBottom: 5 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  printButton: { 
    backgroundColor: "#333", 
    padding: 10, 
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center" 
  },
  payButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center"
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16 
  },
  receiptContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    elevation: 3,
  },
  receiptHeader: { 
    fontSize: 22, 
    textAlign: "center", 
    color: "#222" 
  },
  receiptSubHeader: { 
    fontSize: 18, 
    textAlign: "center", 
    marginVertical: 5 
  },
  studentName: { 
    fontSize: 16, 
    textAlign: "center", 
    marginBottom: 10 
  },
});
