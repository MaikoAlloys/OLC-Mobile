import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function EmployeeSelection() {
  const router = useRouter();

  const employees = [
    { name: "Finance", route: "/finance-login" },
    { name: "Tutor", route: "/tutor-login" },
    { name: "Librarian", route: "/librarian-login" },
    { name: "Storekeeper", route: "/storekeeper-login" },
    { name: "Supplier", route: "/supplier-login" },
    { name: "Head Of Department", route: "/hod-login" }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Employee Role:</Text>
      {employees.map((employee, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={() => router.push(employee.route)}>
          <Text style={styles.buttonText}>{employee.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#28a745", padding: 15, width: "80%", alignItems: "center", marginVertical: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 18 },
});
