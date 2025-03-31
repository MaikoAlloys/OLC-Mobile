import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";

// Assuming api.js is configured with the correct base URL
import api from "./api"; 

const StoreKeeperReceiveStock = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch approved stock requests
    const fetchApprovedRequests = async () => {
        setLoading(true);
        try {
            // Make the API request
            const response = await api.get("/storekeeper/requests/approved");
            
            // Log the response to confirm it's an object, not an array
            console.log("API Response:", response.data);
            
            // Wrap the response in an array if it's not an array
            const data = Array.isArray(response.data) ? response.data : [response.data];
            
            // Set the requests state to an array (even if it was a single object)
            setRequests(data);
        } catch (error) {
            // console.error("Error fetching requests:", error.response || error);
            Alert.alert("Error", "No request found.");
        }
        setLoading(false);
    };

    // Handle receiving stock
    const handleReceiveStock = async (id) => {
        try {
            const response = await api.put(`/storekeeper/requests/${id}/receive`);
            Alert.alert("Success", response.data.message);

            // Update the state directly after receiving stock
            setRequests((prevRequests) =>
                prevRequests.map((item) =>
                    item.id === id ? { ...item, status: "received" } : item
                )
            );
        } catch (error) {
            console.error("Error receiving stock:", error.response || error);
            Alert.alert("Error", "Failed to update stock.");
        }
    };

    useEffect(() => {
        fetchApprovedRequests();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Approved Stock Requests</Text>

            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 15,
                                marginBottom: 10,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 8,
                            }}
                        >
                            <Text>Item: {item.item_name}</Text>
                            <Text>Quantity Requested: {item.quantity_requested}</Text>
                            <Text>Status: {item.status}</Text>

                            <Button title="Receive" onPress={() => handleReceiveStock(item.id)} />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default StoreKeeperReceiveStock;
