import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import api from "./api";

const RequestItem = () => {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [costPerItem, setCostPerItem] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const router = useRouter();

    // Fetch items and suppliers
    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsResponse = await api.get("/storekeeper/items");
                const suppliersResponse = await api.get("/storekeeper/suppliers");
                
                console.log("Items from API:", itemsResponse.data.items);
                console.log("Suppliers from API:", suppliersResponse.data.suppliers);
                
                setItems(itemsResponse.data.items);
                setSuppliers(suppliersResponse.data.suppliers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Update cost per item when an item is selected
    const handleItemChange = (itemId) => {
        console.log("Selected item ID:", itemId);
        
        const item = items.find((i) => i.id == itemId);
        
        console.log("Found item:", item);
        
        if (item) {
            setSelectedItem(itemId);
            const cost = Number(item.cost);
            setCostPerItem(cost);
            console.log("Setting cost to:", cost);
        } else {
            setSelectedItem(null);
            setCostPerItem(0);
        }
    };

    // Calculate total cost whenever quantity or cost changes
    useEffect(() => {
        const qty = parseInt(quantity) || 0;
        const total = qty * costPerItem;
        setTotalCost(total);
        console.log("Recalculating total:", qty, "*", costPerItem, "=", total);
    }, [quantity, costPerItem]);

    const handleSubmit = async () => {
        if (!selectedItem || !quantity || !selectedSupplier) {
            alert("Please select an item, supplier, and enter quantity.");
            return;
        }

        try {
            const response = await api.post("/storekeeper/request-item", {
                storekeeper_id: 1,
                item_id: selectedItem,
                quantity_requested: parseInt(quantity),
                supplier_id: selectedSupplier,
                total_cost: totalCost,
            });

            console.log("Request Submitted:", response.data);
            alert("Item Requested Successfully!");
            router.push("/storekeeper-dashboard");
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to request item.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Request Item</Text>

            <Text style={styles.label}>Select Item</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedItem}
                    onValueChange={handleItemChange}
                    style={styles.picker}
                    dropdownIconColor="#000000"
                    mode="dropdown"
                >
                    <Picker.Item label="Select an item" value={null} />
                    {items.map((item) => (
                        <Picker.Item 
                            key={item.id} 
                            label={`${item.item_name} (Ksh ${item.cost})`} 
                            value={item.id} 
                        />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Select Supplier</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedSupplier}
                    onValueChange={setSelectedSupplier}
                    style={styles.picker}
                    dropdownIconColor="#000000"
                    mode="dropdown"
                >
                    <Picker.Item label="Select a supplier" value={null} />
                    {suppliers.map((supplier) => (
                        <Picker.Item key={supplier.id} label={supplier.name} value={supplier.id} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Quantity</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
            />

            <Text style={styles.costText}>Cost per Item: Ksh {costPerItem.toFixed(2)}</Text>
            <Text style={styles.totalCost}>Total Cost: Ksh {totalCost.toFixed(2)}</Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Request</Text>
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
    header: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: "#333",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
    },
    input: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "white",
        overflow: "hidden",
    },
    picker: {
        height: 50,
        width: "100%",
    },
    costText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5,
        color: "#333",
    },
    totalCost: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
        color: "#2a52be",
    },
    submitButton: {
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    submitText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default RequestItem;