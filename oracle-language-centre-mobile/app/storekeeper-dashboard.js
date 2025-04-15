import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import api from "./api"; // Ensure API is properly set up

const StorekeeperDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarAnim] = useState(new Animated.Value(-250));
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/storekeeper/dashboard");
                console.log("Dashboard Data:", response.data); // Debugging
                setData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const toggleSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: sidebarAnim._value === 0 ? -250 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleLogout = () => {
        console.log("Logging out...");
        router.push("/");
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {/* Sidebar Navigation */}
            <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
                    <Text style={styles.closeText}>✖</Text>
                </TouchableOpacity>

                <View style={styles.sidebarMenu}>
                    <TouchableOpacity onPress={() => router.push("/storekeeper-dashboard")}>
                        <Text style={styles.navItem}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/storekeeper-profile")}>
                        <Text style={styles.navItem}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/storekeeper-categories")}>
                        <Text style={styles.navItem}>Categories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/storekeeper-requests")}>
                        <Text style={styles.navItem}>Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/storekeeper-receive-stock")}>
                        <Text style={styles.navItem}>Receive Stock</Text>
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

            {/* Dashboard Content */}
            <Text style={styles.header}>Storekeeper Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Total Categories</Text>
                <Text style={styles.value}>{data?.totalCategories ?? 0}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Total Items</Text>
                <Text style={styles.value}>{data?.totalItems ?? 0}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Low Stock Alerts</Text>
                <Text style={styles.value}>{data?.lowStockAlerts ?? 0}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Pending Requests</Text>
                <Text style={styles.value}>{data?.pendingRequests ?? 0}</Text>
            </View>

            {/* Request Item Button */}
            <TouchableOpacity style={styles.requestButton} onPress={() => router.push("/storekeeper-request-item")}>
                <Text style={styles.requestButtonText}>Request Item</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    sidebar: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: -250,
        width: 250,
        backgroundColor: "#333",
        paddingTop: 40,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    closeButton: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    closeText: {
        color: "white",
        fontSize: 20,
    },
    sidebarMenu: {
        marginTop: 20,
    },
    navItem: {
        fontSize: 18,
        color: "white",
        marginBottom: 15,
    },
    logout: {
        color: "red",
    },
    menuButton: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 5,
        zIndex: 11,
    },
    menuText: {
        color: "white",
        fontSize: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        color: "#666",
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 5,
    },
    requestButton: {
        backgroundColor: "#575958",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    requestButtonText: {
        color: "white",
        fontSize: 18,
    },
});

export default StorekeeperDashboard;
