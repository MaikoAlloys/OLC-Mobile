import React, { useState, useEffect } from "react";
import api from "./api";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureRef } from 'react-native-view-shot';

// Simple JWT decoder (no library needed)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const SupplierPayment = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const receiptRef = React.useRef();

  useEffect(() => {
    const getSupplierId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = decodeJWT(token);
          if (decoded && decoded.id) {
            setSupplierId(decoded.id);
          }
        }
      } catch (error) {
        console.error("Error getting supplier ID:", error);
      }
    };
    getSupplierId();
  }, []);

  useEffect(() => {
    if (supplierId) {
      fetchPayments();
    }
  }, [supplierId]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "You must log in again.");
        return;
      }

      const response = await api.get(`/supplier/payments/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        console.log("✅ Payments Fetched:", response.data);
        setPayments(response.data);
      } else {
        console.warn("Unexpected response structure:", response.data);
        setError("Unexpected data format received");
      }
    } catch (error) {
      console.error("❌ Error Fetching Payments:", error);
      setError(error.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const showPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const confirmPayment = () => {
    setIsModalVisible(false);
    setIsReceiptVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsReceiptVisible(false);
    setSelectedPayment(null);
  };

  const downloadReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });
      Alert.alert("Success", "Receipt downloaded successfully!");
      console.log("Receipt saved to:", uri);
      // Here you would typically save the image to the device's storage
    } catch (error) {
      console.error("Error capturing receipt:", error);
      Alert.alert("Error", "Failed to download receipt");
    }
  };

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.paymentItem}
      onPress={() => showPaymentDetails(item)}
    >
      <Text style={styles.paymentText}>Payment ID: {item.id}</Text>
      <Text style={styles.paymentAmount}>Amount: Ksh {item.total_cost}</Text>
      <Text style={styles.paymentDate}>
        Date: {new Date(item.payment_date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPayments}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (payments.length === 0 && !loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No payments found</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPayments}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Payments</Text>
      
      <FlatList 
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPaymentItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Confirmation Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedPayment && (
            <>
              <Text style={styles.modalTitle}>Confirm Payment</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment ID:</Text>
                <Text style={styles.detailValue}>{selectedPayment.id}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={styles.detailValue}>Ksh {selectedPayment.total_cost}</Text>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.confirmButton]}
                  onPress={confirmPayment}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Receipt Modal */}
      <Modal visible={isReceiptVisible} animationType="slide">
        <View style={styles.receiptContainer} ref={receiptRef}>
          {selectedPayment && (
            <>
              <Text style={styles.receiptHeader}>PAYMENT RECEIPT</Text>
              <Text style={styles.receiptSubheader}>Oracle Language Centre</Text>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Receipt No:</Text>
                <Text style={styles.receiptDetailValue}>#{selectedPayment.id}</Text>
              </View>
              
              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Date:</Text>
                <Text style={styles.receiptDetailValue}>
                  {new Date(selectedPayment.payment_date).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Payment Method:</Text>
                <Text style={styles.receiptDetailValue}>
                  {selectedPayment.payment_method || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Reference:</Text>
                <Text style={styles.receiptDetailValue}>
                  {selectedPayment.payment_reference || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Amount Paid:</Text>
                <Text style={styles.receiptAmount}>Ksh {selectedPayment.total_cost}</Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <Text style={styles.receiptFooter}>Thank you for your supply!</Text>
              
              <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={downloadReceipt}
              >
                <Text style={styles.downloadButtonText}>Download Receipt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
  },
  listContainer: {
    paddingBottom: 20,
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  paymentAmount: {
    fontSize: 14,
    color: '#2b8a3e',
    marginTop: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: '#495057',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#868e96',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fa5252',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    width: 120,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  receiptContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#343a40',
    textAlign: 'center',
  },
  receiptHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#212529',
    textAlign: 'center',
  },
  receiptSubheader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#495057',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  receiptDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#495057',
  },
  receiptDetailLabel: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 16,
  },
  detailValue: {
    color: '#212529',
  },
  receiptDetailValue: {
    color: '#212529',
    fontSize: 16,
  },
  receiptAmount: {
    color: '#2b8a3e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  receiptDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    marginVertical: 16,
  },
  receiptFooter: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  downloadButton: {
    backgroundColor: '#228be6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  closeButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#212529',
    fontWeight: '600',
  },
});

export default SupplierPayment;