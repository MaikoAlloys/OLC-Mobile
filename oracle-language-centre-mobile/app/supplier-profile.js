import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export default function SupplierProfile() {
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No token found. Please log in again.");
                return;
            }

            const response = await api.get("/supplier/profile", { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            setSupplier(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Supplier Profile</Text>

            {loading ? (
                <Text style={styles.loading}>Loading profile...</Text>
            ) : supplier ? (
                <View style={styles.card}>
                    <Text style={styles.info}>Username: {supplier.username}</Text>
                    <Text style={styles.info}>Full Name: {supplier.first_name} {supplier.last_name}</Text>
                    <Text style={styles.info}>Email: {supplier.email}</Text>
                    <Text style={styles.info}>Phone: {supplier.phone}</Text>
                </View>
            ) : (
                <Text style={styles.error}>Profile not found.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    loading: { textAlign: "center", fontSize: 18, marginTop: 20 },
    error: { textAlign: "center", fontSize: 18, color: "red", marginTop: 20 },
    card: { backgroundColor: "#fff", padding: 15, borderRadius: 5, elevation: 3 },
    info: { fontSize: 18, marginBottom: 10 },
});
