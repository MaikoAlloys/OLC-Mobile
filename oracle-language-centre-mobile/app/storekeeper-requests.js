import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import api from "./api";

const StorekeeperRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get("/storekeeper/requests");
                setRequests(response.data.requests);
            } catch (error) {
                console.error("Error fetching storekeeper requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'pending':
                return styles.statusPending;
            case 'approved':
                return styles.statusApproved;
            case 'received':
                return styles.statusReceived;
            case 'rejected':
                return styles.statusRejected;
            default:
                return {};
        }
    };

    const getCardStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'pending':
                return styles.cardPending;
            case 'approved':
                return styles.cardApproved;
            case 'received':
                return styles.cardReceived;
            case 'rejected':
                return styles.cardRejected;
            default:
                return styles.requestCard;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Storekeeper Requests</Text>
            
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.requestCard, getCardStyle(item.status)]}>
                        <Text style={styles.itemName}>{item.item_name}</Text>
                        <Text style={styles.detail}>Quantity: {item.quantity_requested}</Text>
                        <Text style={styles.detail}>Total Cost: Ksh {item.total_cost}</Text>
                        <Text style={styles.detail}>Supplier: {item.supplier_name}</Text>
                        <Text style={[styles.status, getStatusStyle(item.status)]}>
                            Status: {item.status}
                        </Text>
                        <Text style={styles.date}>
                            Requested: {new Date(item.requested_at).toLocaleString()}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#343a40",
    },
    requestCard: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardPending: {
        backgroundColor: "#fff3cd",
        borderLeftWidth: 4,
        borderLeftColor: "#ffc107",
    },
    cardApproved: {
        backgroundColor: "#d4edda",
        borderLeftWidth: 4,
        borderLeftColor: "#28a745",
    },
    cardReceived: {
        backgroundColor: "#d1ecf1",
        borderLeftWidth: 4,
        borderLeftColor: "#17a2b8",
    },
    cardRejected: {
        backgroundColor: "#f8d7da",
        borderLeftWidth: 4,
        borderLeftColor: "#dc3545",
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#212529",
    },
    detail: {
        fontSize: 14,
        marginBottom: 4,
        color: "#495057",
    },
    status: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 8,
        marginBottom: 4,
    },
    statusPending: {
        color: "#ffc107",
    },
    statusApproved: {
        color: "#28a745",
    },
    statusReceived: {
        color: "#17a2b8",
    },
    statusRejected: {
        color: "#dc3545",
    },
    date: {
        fontSize: 12,
        color: "#6c757d",
    },
});

export default StorekeeperRequests;