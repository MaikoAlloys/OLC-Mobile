import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { MaterialIcons } from "@expo/vector-icons";

// Star Rating Components
const StarRatingInput = ({ rating, onRatingChange }) => (
  <View style={styles.starRatingContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity 
        key={star} 
        onPress={() => onRatingChange(star)} 
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={star <= rating ? "star" : "star-border"}
          size={32}
          color={star <= rating ? "#FFD700" : "#CCCCCC"}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const StarRatingDisplay = ({ rating }) => (
  <View style={styles.starRatingContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <MaterialIcons
        key={star}
        name={star <= rating ? "star" : "star-border"}
        size={16}
        color={star <= rating ? "#FFD700" : "#CCCCCC"}
      />
    ))}
  </View>
);

export default function FeedbackScreen() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) {
          console.error("User not logged in");
          return;
        }

        const studentData = JSON.parse(studentToken);
        setStudentId(studentData.id);

        const usersResponse = await api.get(`/feedback/users/${studentData.id}`);
        const transformedUsers = usersResponse.data.users.map((user, index) => ({
          id: `${user.role}-${user.id}-${index}`,
          name: user.fullName,
          type: user.role,
          originalData: user
        }));
        setUsers(transformedUsers);

        const historyResponse = await api.get(`/feedback/feedbacks/${studentData.id}`);
        setFeedbackHistory(historyResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserSelection = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user || null);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedUser || !feedbackText) {
      alert("Please select a recipient and provide feedback message");
      return;
    }

    try {
      Keyboard.dismiss(); // Properly dismiss keyboard when submitting
      
      const response = await api.post("/feedback/submit-feedback", {
        student_id: studentId,
        recipient_id: selectedUser.originalData.id,
        recipient_name: selectedUser.originalData.fullName,
        recipient_role: selectedUser.originalData.role,
        message: feedbackText,
        rating: rating > 0 ? rating : null
      });

      if (response.data.message === "Feedback submitted successfully") {
        setShowSuccessModal(true);
        const historyResponse = await api.get(`/feedback/feedbacks/${studentId}`);
        setFeedbackHistory(historyResponse.data);
        setSelectedUser(null);
        setRating(0);
        setFeedbackText("");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const renderFeedbackItem = ({ item }) => {
    let recipientName = "Unknown";
    let recipientRole = "Unknown role";

    if (item.tutor_name) {
      recipientName = item.tutor_name;
      recipientRole = "tutor";
    } else if (item.librarian_name) {
      recipientName = item.librarian_name;
      recipientRole = "librarian";
    } else if (item.finance_name) {
      recipientName = item.finance_name;
      recipientRole = "finance";
    } else if (item.hod_name) {
      recipientName = item.hod_name;
      recipientRole = "hod";
    }

    return (
      <View style={styles.feedbackItem}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.recipientText}>
            To: {recipientName} ({recipientRole})
          </Text>
          <Text style={styles.dateText}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>

        {item.rating && (
          <View style={styles.ratingContainer}>
            <StarRatingDisplay rating={item.rating} />
          </View>
        )}

        <Text style={styles.feedbackMessage}>{item.feedback_message}</Text>

        {item.reply && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyHeader}>Response:</Text>
            <Text style={styles.replyText}>{item.reply}</Text>
            <Text style={styles.replyDate}>
              {new Date(item.reply_time).toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            item.status === 'pending' ? styles.pendingStatus : styles.resolvedStatus
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>New Feedback</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Recipient:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedUser?.id || ""}
              onValueChange={handleUserSelection}
              style={styles.picker}
            >
              <Picker.Item label="Select a person..." value="" />
              {users.map(user => (
                <Picker.Item
                  key={user.id}
                  label={`${user.name} (${user.type})`}
                  value={user.id}
                />
              ))}
            </Picker>
          </View>

          {selectedUser && (
            <>
              <Text style={styles.label}>Role:</Text>
              <TextInput
                style={styles.input}
                value={selectedUser.type}
                editable={false}
              />
            </>
          )}

          <Text style={styles.label}>Rating (optional):</Text>
          <StarRatingInput rating={rating} onRatingChange={setRating} />

          <Text style={styles.label}>Your Feedback:</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Type your feedback here..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmitFeedback}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Feedback History</Text>

        {feedbackHistory.length > 0 ? (
          <FlatList
            data={feedbackHistory}
            renderItem={renderFeedbackItem}
            keyExtractor={(item) => item.feedback_id.toString()}
            scrollEnabled={false} // Let ScrollView handle scrolling
          />
        ) : (
          <View style={styles.emptyHistory}>
            <MaterialIcons name="feedback" size={48} color="#CCCCCC" />
            <Text style={styles.emptyHistoryText}>No feedback history yet</Text>
          </View>
        )}

        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
              <Text style={styles.modalTitle}>Success!</Text>
              <Text style={styles.modalText}>Your feedback has been submitted successfully.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#34495e",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#34495e",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#34495e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#34495e",
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  starRatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  submitButton: {
    backgroundColor: "#34495e",
    borderRadius: 4,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recipientText: {
    fontWeight: "600",
    color: "#34495e",
  },
  dateText: {
    color: "#777",
    fontSize: 12,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  feedbackMessage: {
    color: "#444",
    marginBottom: 12,
    lineHeight: 20,
  },
  replyContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#34495e",
  },
  replyHeader: {
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 4,
  },
  replyText: {
    color: "#444",
    marginBottom: 4,
    lineHeight: 20,
  },
  replyDate: {
    color: "#777",
    fontSize: 12,
    textAlign: "right",
  },
  statusContainer: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pendingStatus: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
  },
  resolvedStatus: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
  },
  emptyHistory: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyHistoryText: {
    color: "#999",
    marginTop: 16,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#34495e",
  },
  modalText: {
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#34495e",
    borderRadius: 4,
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});