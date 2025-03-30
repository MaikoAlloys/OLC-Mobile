import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  FlatList
} from 'react-native';
import api from "./api";

const FinanceSupplierPayments = () => {
    const [requests, setRequests] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentReference, setPaymentReference] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch received requests
    useEffect(() => {
        api.get('/storekeeper/received')
            .then((response) => {
                setRequests(response.data);
            })
            .catch((error) => {
                console.error("Error fetching received requests:", error);
                Alert.alert("Error", "Failed to load requests");
            });
    }, []);

    const handlePayment = () => {
        if (!selectedRequest) {
            Alert.alert("Error", "No request selected");
            return;
        }

        const paymentData = {
            request_id: selectedRequest.request_id,
            total_cost: selectedRequest.total_cost,
            payment_method: paymentMethod,
            payment_reference: paymentReference,
            supplier_id: selectedRequest.supplier_id // Add this line
        };

        console.log("Sending payment data:", paymentData); // Debug log

        api.post('/storekeeper/pay', paymentData)
            .then((response) => {
                Alert.alert("Success", response.data.message);
                setModalVisible(false);
                setPaymentMethod('');
                setPaymentReference('');
            })
            .catch((error) => {
                console.error("Payment error:", error.response?.data);
                Alert.alert("Error", error.response?.data?.message || "Payment failed");
            });
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.supplierCell]}>
                {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.cell}>{item.quantity_requested}</Text>
            <Text style={styles.cell}>
                {new Date(item.requested_at).toLocaleDateString()}
            </Text>
            <Text style={styles.cell}>{item.total_cost}</Text>
            <TouchableOpacity 
                style={styles.payButton}
                onPress={() => {
                    setSelectedRequest(item);
                    setModalVisible(true);
                }}
            >
                <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Finance - Supplier Payments</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 2 }]}>Supplier</Text>
                <Text style={styles.headerCell}>Qty</Text>
                <Text style={styles.headerCell}>Date</Text>
                <Text style={styles.headerCell}>Amount</Text>
                <Text style={styles.headerCell}>Action</Text>
            </View>
            
            {/* Table Content */}
            <FlatList
                data={requests}
                renderItem={renderItem}
                keyExtractor={item => item.request_id.toString()}
                style={styles.tableContainer}
            />

            {/* Payment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>
                            Payment for {selectedRequest?.first_name} {selectedRequest?.last_name}
                        </Text>
                        
                        <Text style={styles.label}>Payment Method</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity 
                                style={[styles.radioButton, paymentMethod === 'mpesa' && styles.radioSelected]}
                                onPress={() => setPaymentMethod('mpesa')}
                            >
                                <Text style={paymentMethod === 'mpesa' ? styles.radioSelectedText : styles.radioText}>MPesa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.radioButton, paymentMethod === 'bank' && styles.radioSelected]}
                                onPress={() => setPaymentMethod('bank')}
                            >
                                <Text style={paymentMethod === 'bank' ? styles.radioSelectedText : styles.radioText}>Bank</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.label}>Payment Reference</Text>
                        <TextInput
                            style={styles.input}
                            value={paymentReference}
                            onChangeText={setPaymentReference}
                            placeholder={
                                paymentMethod === 'mpesa' 
                                    ? "Enter MPesa reference (10 digits)" 
                                    : "Enter Bank reference (14 digits)"
                            }
                            keyboardType="default"
                            autoCapitalize="characters"
                        />
                        
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setPaymentMethod('');
                                    setPaymentReference('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.button, styles.submitButton, (!paymentMethod || !paymentReference) && styles.disabledButton]}
                                onPress={handlePayment}
                                disabled={!paymentMethod || !paymentReference}
                            >
                                <Text style={styles.buttonText}>Confirm Payment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerCell: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#555',
    },
    supplierCell: {
        flex: 2,
        textAlign: 'left',
        paddingLeft: 8,
    },
    payButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
        color: '#555',
    },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'space-between',
    },
    radioButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 8,
        alignItems: 'center',
    },
    radioSelected: {
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
    },
    radioText: {
        color: '#333',
    },
    radioSelectedText: {
        color: 'white',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginBottom: 20,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        marginRight: 8,
    },
    submitButton: {
        backgroundColor: '#2ecc71',
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#95a5a6',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FinanceSupplierPayments;