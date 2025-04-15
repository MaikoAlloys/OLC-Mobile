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
      <View style={styles.header}>
        <Text style={styles.title}>Select Employee Role</Text>
      </View>
      <View style={styles.buttonContainer}>
        {employees.map((employee, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.button} 
            onPress={() => router.push(employee.route)}
          >
            <Text style={styles.buttonText}>{employee.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    width: '100%',
    paddingVertical: 30,
    backgroundColor: '#34495e',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: { 
    fontSize: 22, 
    fontWeight: "600", 
    color: 'white',
    letterSpacing: 0.5
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  button: { 
    backgroundColor: "#34495e", 
    padding: 16, 
    width: "90%", 
    alignItems: "center", 
    marginVertical: 8, 
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#34495e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5
  },
});