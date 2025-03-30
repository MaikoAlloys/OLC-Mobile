import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const SupplierApprovedItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await api.get("/supplier/approved-items", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching supplier approved items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Approved, Rejected & Received Items</Text>
            
            {items.length === 0 ? (
                <Text style={styles.emptyText}>No records found</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.text}>Item ID: {item.item_id}</Text>
                            <Text style={styles.text}>Storekeeper ID: {item.storekeeper_id}</Text>
                            <Text style={styles.text}>Quantity: {item.quantity_requested}</Text>
                            <Text style={styles.text}>
                                Total Cost: {typeof item.total_cost === 'number' ? item.total_cost.toFixed(2) : item.total_cost}
                            </Text>
                            <Text style={[styles.text, styles.status, getStatusColor(item.status)]}>
                                Status: {item.status}
                            </Text>
                            <Text style={styles.text}>Requested At: {new Date(item.requested_at).toLocaleString()}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return { color: "green" };
        case "rejected":
            return { color: "red" };
        case "received":
            return { color: "blue" };
        default:
            return { color: "black" };
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontSize: 15,
        marginBottom: 8,
        color: '#444',
    },
    status: {
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 20,
    },
});

export default SupplierApprovedItems;