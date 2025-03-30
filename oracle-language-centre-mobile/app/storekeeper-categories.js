import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import api from "./api";

const StorekeeperCategories = () => {
    const [categories, setCategories] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/storekeeper/categories");
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Store Items by Category</Text>

            {Object.keys(categories).length === 0 ? (
                <Text style={styles.noItems}>No items available in inventory</Text>
            ) : (
                <FlatList
                    data={Object.entries(categories)}
                    keyExtractor={(item) => item[0]}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>{item[0]}</Text>
                            {item[1].map((product, index) => (
                                <View key={index} style={styles.itemCard}>
                                    <Text style={styles.itemName}>{product.item_name}</Text>
                                    <Text style={styles.itemDetail}>Quantity: {product.quantity}</Text>
                                    {product.description && (
                                        <Text style={styles.itemDescription}>{product.description}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f8f9fa",
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: "center",
        marginBottom: 24,
        color: "#2c3e50",
    },
    noItems: {
        textAlign: "center",
        fontSize: 15,
        color: "#7f8c8d",
        marginTop: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
        color: "#34495e",
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    itemCard: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 6,
        color: "#2c3e50",
    },
    itemDetail: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: "#95a5a6",
        marginTop: 6,
        fontStyle: 'italic',
    },
});

export default StorekeeperCategories;