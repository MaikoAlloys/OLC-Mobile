import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ApplyCourse() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [location, setLocation] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [courseFee, setCourseFee] = useState(0);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.100.25:5000/courses/${id}`);
        setCourseFee(response.data.fee);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch course details");
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      return Alert.alert("Error", "Select the mode of payment");
    }
    if (!referenceCode || !location || !birthYear || !idNumber || !amountPaid) {
      return Alert.alert("Error", "All fields are required.");
    }

    if (paymentMethod === "mpesa" && referenceCode.length !== 10) {
      return Alert.alert("Error", "Mpesa reference must be 10 characters.");
    }
    if (paymentMethod === "bank" && referenceCode.length !== 14) {
      return Alert.alert("Error", "Bank reference must be 14 digits.");
    }
    if (idNumber.length !== 8) {
      return Alert.alert("Error", "ID Number must be exactly 8 digits.");
    }

    const halfFee = courseFee / 2;
    if (parseFloat(amountPaid) < halfFee) {
      return Alert.alert("Error", `Minimum amount required is Ksh ${halfFee.toFixed(2)}`);
    }

    try {
      await axios.post("http://192.168.100.25:5000/payments", {
        course_id: id,
        payment_method: paymentMethod,
        reference_code: referenceCode,
        location,
        birth_year: birthYear,
        id_number: idNumber,
        amount_paid: amountPaid,
      });

      Alert.alert("Success", "Payment submitted. Pending approval.");
      router.push("/dashboard");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleReferenceCodeChange = (text) => {
    setReferenceCode(text.toUpperCase());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Course Application</Text>
          <Text style={styles.subtitle}>Complete your application</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.infoText}>Important: 50% of the fee ({courseFee / 2} Ksh) must be paid to proceed.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              onPress={() => setPaymentMethod("mpesa")} 
              style={[
                styles.methodButton, 
                paymentMethod === "mpesa" && styles.selectedMethod
              ]}
            >
              <Text style={styles.methodButtonText}>M-Pesa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setPaymentMethod("bank")} 
              style={[
                styles.methodButton, 
                paymentMethod === "bank" && styles.selectedMethod
              ]}
            >
              <Text style={styles.methodButtonText}>Bank</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference Code</Text>
            <TextInput 
              style={styles.input} 
              placeholder={paymentMethod === "mpesa" ? "10-digit M-Pesa code" : "14-digit bank reference"} 
              value={referenceCode} 
              onChangeText={handleReferenceCodeChange}
              keyboardType="default" // Changed from "numeric" to "default"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount Paid (Ksh)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amountPaid}
              onChangeText={setAmountPaid}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Your current location" 
              value={location} 
              onChangeText={setLocation} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year of Birth</Text>
            <TextInput 
              style={styles.input} 
              placeholder="YYYY" 
              keyboardType="numeric" 
              value={birthYear} 
              onChangeText={setBirthYear} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              placeholder="8-digit ID number"
              keyboardType="numeric"
              maxLength={8}
              value={idNumber}
              onChangeText={setIdNumber}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 15,
    color: "#e74c3c",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  methodButton: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedMethod: {
    backgroundColor: "#3498db",
  },
  methodButtonText: {
    color: "#2c3e50",
    fontWeight: "500",
  },
  selectedMethodText: {
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#2c3e50",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});