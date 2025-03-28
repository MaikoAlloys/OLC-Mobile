import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Help() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      
      {/* FAQs Section */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <Text style={styles.question}>1. How do I register for a course?</Text>
      <Text style={styles.answer}>Visit the Courses section, select your preferred course, and complete the application process.</Text>
      
      <Text style={styles.question}>2. How can I make a payment?</Text>
      <Text style={styles.answer}>Payments can be made via Mpesa or bank transfer. Ensure you use the correct reference code.</Text>
      
      <Text style={styles.question}>3. What should I do if my payment is pending?</Text>
      <Text style={styles.answer}>If your payment status is pending, please wait for admin approval or contact support for assistance.</Text>
      
      {/* Contact Support */}
      <Text style={styles.sectionTitle}>Need More Help?</Text>
      <Text style={styles.text}>For further assistance, contact us:</Text>
      <Text style={styles.contact}>📞 Phone: +254 712 345 678</Text>
      <Text style={styles.contact}>📧 Email: support@oraclelanguagecenter.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 15 },
  question: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  answer: { fontSize: 16, marginBottom: 10, color: "#444" },
  text: { fontSize: 16, marginTop: 10 },
  contact: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
});
