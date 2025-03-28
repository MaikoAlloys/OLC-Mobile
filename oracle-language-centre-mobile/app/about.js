import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>About Oracle Language Center</Text>
      
      <Text style={styles.paragraph}>
        Oracle Language Center is a premier institution dedicated to providing
        high-quality language education. Our mission is to empower students
        with the linguistic skills necessary to excel in both personal and
        professional spheres.
      </Text>
      
      <Text style={styles.subHeader}>Our Vision</Text>
      <Text style={styles.paragraph}>
        To be the leading language training center, fostering global
        communication through excellence in education.
      </Text>
      
      <Text style={styles.subHeader}>Our Mission</Text>
      <Text style={styles.paragraph}>
        We aim to bridge communication gaps by offering well-structured
        language courses, taught by experienced tutors using modern teaching
        methodologies.
      </Text>
      
      <Text style={styles.subHeader}>Why Choose Us?</Text>
      <Text style={styles.paragraph}>
        ✓ Expert Instructors with years of teaching experience{"\n"}
        ✓ Comprehensive Language Programs tailored to different needs{"\n"}
        ✓ Flexible Learning Schedules to accommodate all students{"\n"}
        ✓ A Friendly and Supportive Learning Environment
      </Text>
      
      <Text style={styles.subHeader}>Languages Offered</Text>
      <Text style={styles.paragraph}>
        We offer a variety of language courses, including but not limited to:
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.listItem}>• English</Text>
        <Text style={styles.listItem}>• Swahili</Text>
        <Text style={styles.listItem}>• French</Text>
        <Text style={styles.listItem}>• Arabic</Text>
        <Text style={styles.listItem}>• German</Text>
        <Text style={styles.listItem}>• Chinese</Text>
      </View>
      
      <Text style={styles.footer}>
        Join us today and embark on your journey to mastering a new language!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#444",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    color: "#555",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 10,
  },
  listContainer: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#666",
  },
  footer: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
});
