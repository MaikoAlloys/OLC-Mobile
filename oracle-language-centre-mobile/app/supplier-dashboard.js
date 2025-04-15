import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Ensure expo-router is installed
import api from "./api";

export default function SupplierDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarAnim] = useState(new Animated.Value(-250)); // Sidebar animation
    const router = useRouter();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No token found. Please log in again.");
                return;
            }
            const response = await api.get("/supplier/requests", { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setRequests(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to load requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No token found. Please log in again.");
                return;
            }
            await api.put(`/supplier/request/${id}`, { status }, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            Alert.alert("Success", `Request ${status} successfully.`);
            fetchRequests(); // Refresh list after update
        } catch (error) {
            Alert.alert("Error", "Failed to update request.");
        }
    };

    const toggleSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: sidebarAnim._value === 0 ? -250 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        router.push("/");
    };

    return (
        <View style={styles.container}>
            {/* Sidebar Navigation */}
            <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
                    <Text style={styles.closeText}>✖</Text>
                </TouchableOpacity>

                <View style={styles.sidebarMenu}>
                    <TouchableOpacity onPress={() => router.push("/supplier-dashboard")}>
                        <Text style={styles.navItem}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/supplier-profile")}>
                        <Text style={styles.navItem}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/supplier-dashboard")}>
                        <Text style={styles.navItem}>Pending Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/supplier-history")}>
                        <Text style={styles.navItem}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/supplier-item-payment")}>
                        <Text style={styles.navItem}>Payments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={[styles.navItem, styles.logout]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Sidebar Toggle Button */}
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Pending Requests</Text>
            
            {loading ? (
                <Text style={styles.loading}>Loading requests...</Text>
            ) : requests.length === 0 ? (
                <Text style={styles.noRequests}>No pending requests.</Text>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text>Item: {item.item_name}</Text>
                            <Text>Quantity: {item.quantity_requested}</Text>
                            <Text>Cost Per Item: Ksh {item.cost_per_item}</Text>
                            <Text>Total Cost: Ksh {item.total_cost}</Text>
                            <Text>Requested At: {new Date(item.requested_at).toLocaleString()}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.approve} onPress={() => handleAction(item.id, "approved")}>
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.reject} onPress={() => handleAction(item.id, "rejected")}>
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    loading: { textAlign: "center", fontSize: 18, marginTop: 20 },
    noRequests: { textAlign: "center", fontSize: 18, marginTop: 20, color: "gray" },
    card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 5 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
    approve: { backgroundColor: "green", padding: 10, borderRadius: 5 },
    reject: { backgroundColor: "red", padding: 10, borderRadius: 5 },
    buttonText: { color: "#fff" },

    // Sidebar Styles
    sidebar: {
        position: "absolute",
        top: 0,
        left: -250,
        width: 250,
        height: "100%",
        backgroundColor: "#333",
        paddingTop: 40,
        paddingLeft: 20,
        zIndex: 10,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
    closeText: {
        fontSize: 18,
        color: "#fff",
    },
    sidebarMenu: {
        marginTop: 20,
    },
    navItem: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 15,
    },
    logout: {
        color: "red",
    },
    menuButton: {
        position: "absolute",
        top: 20,
        left: 20,
        padding: 10,
        zIndex: 20,
    },
    menuText: {
        fontSize: 24,
        color: "#333",
    },
});

