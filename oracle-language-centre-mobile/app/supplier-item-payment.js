import React, { useState, useEffect, useRef } from "react";
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
  Platform,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

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
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const receiptRef = useRef(null);

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
        setPayments(response.data);
      } else {
        setError("Unexpected data format received");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const showPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const confirmPayment = async () => {
    if (!selectedPayment) return;
    
    setConfirming(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "You must log in again.");
        return;
      }

      const response = await api.put(
        `/supplier/payments/confirm/${selectedPayment.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Payment confirmed successfully.") {
        // Update local state to reflect the change
        setPayments(payments.map(p => 
          p.id === selectedPayment.id ? { ...p, status: 'confirmed' } : p
        ));
        setIsModalVisible(false);
        setIsReceiptVisible(true);
      } else {
        Alert.alert("Error", response.data.message || "Failed to confirm payment");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to confirm payment");
    } finally {
      setConfirming(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsReceiptVisible(false);
    setSelectedPayment(null);
  };

  const downloadReceipt = async () => {
    try {
      if (Platform.OS === 'android') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission required", "Please allow access to save receipts to your gallery");
          return;
        }
      }

      if (!receiptRef.current) {
        throw new Error("Receipt reference not available");
      }

      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Receipts', asset, false);
      
      Alert.alert("Success", "Receipt saved to your gallery!");
    } catch (error) {
      console.error("Error saving receipt:", error);
      Alert.alert("Error", "Failed to save receipt to gallery");
    }
  };

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.paymentItem}
      onPress={() => showPaymentDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.paymentContent}>
        <View>
          <Text style={styles.paymentText}>Payment ID: {item.id}</Text>
          <Text style={styles.paymentAmount}>Amount: Ksh {item.total_cost}</Text>
          <Text style={styles.paymentDate}>
            Date: {new Date(item.payment_date).toLocaleDateString()}
          </Text>
          {item.status && (
            <View style={[
              styles.statusBadge,
              item.status === 'confirmed' ? styles.confirmedBadge : styles.paidBadge
            ]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={styles.clickIndicator}>
          <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
          <Text style={styles.viewDetailsText}>View details</Text>
        </View>
      </View>
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
              <Text style={styles.modalTitle}>Payment Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment ID:</Text>
                <Text style={styles.detailValue}>{selectedPayment.id}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={styles.detailValue}>Ksh {selectedPayment.total_cost}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[
                  styles.detailValue,
                  selectedPayment.status === 'confirmed' ? styles.confirmedText : styles.paidText
                ]}>
                  {selectedPayment.status || 'pending'}
                </Text>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                {selectedPayment.status !== 'confirmed' && (
                  <TouchableOpacity 
                    style={[styles.button, styles.confirmButton]}
                    onPress={confirmPayment}
                    disabled={confirming}
                  >
                    {confirming ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Confirm Payment</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Receipt Modal */}
      <Modal visible={isReceiptVisible} animationType="slide">
        <View style={styles.receiptContainer} ref={receiptRef} collapsable={false}>
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
              
              <Text style={styles.receiptStatus}>
                Status: <Text style={styles.confirmedText}>CONFIRMED</Text>
              </Text>
              
              <Text style={styles.receiptFooter}>Thank you for your supply!</Text>
              
              <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={downloadReceipt}
              >
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.downloadButtonText}> Save Receipt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.closeButton]} 
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
  paymentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  paymentDate: {
    fontSize: 14,
    color: '#495057',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  paidBadge: {
    backgroundColor: '#e3f2fd',
  },
  confirmedBadge: {
    backgroundColor: '#e6f7ee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clickIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#7f8c8d',
    fontSize: 14,
    marginLeft: 4,
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
    flexDirection: 'row',
    justifyContent: 'center',
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
    fontSize: 16,
  },
  receiptDetailLabel: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 16,
  },
  detailValue: {
    color: '#212529',
    fontSize: 16,
  },
  confirmedText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  paidText: {
    color: '#1565c0',
    fontWeight: 'bold',
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
  receiptStatus: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
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
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#495057',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#495057',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 16,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  closeButtonText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SupplierPayment;