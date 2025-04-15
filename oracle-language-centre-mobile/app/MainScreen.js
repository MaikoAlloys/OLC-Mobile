import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login As:</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/student-login")}>
        <Text style={styles.buttonText}>Student</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/employee-selection")}>
        <Text style={styles.buttonText}>Employee</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f5f5f5" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 30,
    color: "#34495e",
    letterSpacing: 0.5 
  },
  button: { 
    backgroundColor: "#34495e", 
    padding: 15, 
    width: "80%", 
    alignItems: "center", 
    marginVertical: 10, 
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18,
    fontWeight: "500" 
  },
});