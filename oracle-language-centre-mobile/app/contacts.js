import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

export default function Contacts() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Placeholder for handling form submission
    alert("Your message has been sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      
      <Text style={styles.info}>📍 Location: Nairobi, Kenya</Text>
      <Text style={styles.info}>📞 Phone: +254 712 345 678</Text>
      <Text style={styles.info}>📧 Email: info@oraclelanguagecenter.com</Text>
      
      <Text style={styles.subtitle}>Get in Touch</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, styles.messageBox]}
        placeholder="Your Message"
        value={message}
        multiline
        numberOfLines={4}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  info: { fontSize: 16, textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  messageBox: { height: 80, textAlignVertical: "top" },
  sendButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});