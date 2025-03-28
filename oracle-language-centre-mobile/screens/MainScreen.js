import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login As:</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("StudentLogin")}>
        <Text style={styles.buttonText}>Student</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EmployeeLogin")}>
        <Text style={styles.buttonText}>Employee</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 15, width: "80%", alignItems: "center", marginVertical: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
});

export default MainScreen;
