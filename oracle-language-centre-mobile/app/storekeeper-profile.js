import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios"; // Ensure axios is installed
import api from "./api"; // Uses the configured API instance

const StorekeeperProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log("Fetching storekeeper profile...");
                
                // Fetch profile using the correct API call
                const response = await api.get("/storekeeper/profile");

                console.log("Profile data received:", response.data);
                setProfile(response.data.profile);
            } catch (error) {
                console.error("Error fetching storekeeper profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Storekeeper Profile</Text>
            {profile ? (
                <View style={styles.profileCard}>
                    <Text>Username: {profile.username}</Text>
                    <Text>Full Name: {profile.first_name} {profile.last_name}</Text>
                    <Text>Email: {profile.email}</Text>
                    <Text>Phone: {profile.phone}</Text>
                </View>
            ) : (
                <Text style={styles.errorText}>Profile not found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 22,
        textAlign: "center",
        marginBottom: 20,
    },
    profileCard: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    errorText: {
        textAlign: "center",
        color: "red",
        fontSize: 16,
    },
});

export default StorekeeperProfile;
