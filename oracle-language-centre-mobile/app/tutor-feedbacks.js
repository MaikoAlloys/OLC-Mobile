import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TutorFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [tutorId, setTutorId] = useState(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const tutorData = await AsyncStorage.getItem("tutorToken");
        if (tutorData) {
          const parsedData = JSON.parse(tutorData);
          setTutorId(parsedData.id);
          fetchFeedback(parsedData.id);
        } else {
          setLoading(false);
          Alert.alert("Error", "Please login first");
        }
      } catch (error) {
        console.error("Error fetching tutor data:", error);
        setLoading(false);
      }
    };

    fetchTutorData();
  }, []);

  const fetchFeedback = async (id) => {
    try {
      const response = await api.get(`/feedback/tutor-feedback/${id}`);
      setFeedbackList(response.data.feedback);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch feedback");
    }
  };

  const handleReplySubmit = async (feedbackId) => {
    if (!replyMessage.trim()) {
      Alert.alert("Error", "Reply message cannot be empty");
      return;
    }

    try {
      const tutorData = await AsyncStorage.getItem("tutorToken");
      const parsedData = JSON.parse(tutorData);

      const response = await api.post(`/feedback/tutor-feedback/reply/${feedbackId}`, {
        replyMessage,
        replyBy: parsedData.username
      });

      if (response.data.message === "Reply submitted successfully") {
        Alert.alert("Success", "Reply submitted successfully");
        setReplyingTo(null);
        setReplyMessage("");
        fetchFeedback(tutorId);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      Alert.alert("Error", "Failed to submit reply");
    }
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.senderName}>From: {item.sender_name}</Text>
        <Text style={styles.feedbackDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.feedbackText}>{item.message}</Text>
      <Text style={styles.feedbackRating}>Rating: {item.rating}/5</Text>
      
      {item.reply ? (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Your Reply:</Text>
          <Text style={styles.replyText}>{item.reply}</Text>
          <Text style={styles.replyDate}>
            Replied on: {new Date(item.reply_time).toLocaleString()}
          </Text>
        </View>
      ) : (
        replyingTo === item.feedback_id ? (
          <View style={styles.replyForm}>
            <TextInput
              style={styles.replyInput}
              multiline
              placeholder="Type your reply here..."
              value={replyMessage}
              onChangeText={setReplyMessage}
            />
            <View style={styles.replyButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setReplyingTo(null)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={() => handleReplySubmit(item.feedback_id)}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => setReplyingTo(item.feedback_id)}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#34495e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Feedback</Text>
      
      {feedbackList.length === 0 ? (
        <Text style={styles.noFeedbackText}>No feedback available</Text>
      ) : (
        <FlatList
          data={feedbackList}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item.feedback_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  feedbackItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  senderName: {
    fontSize: 14,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  feedbackRating: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  feedbackDate: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  replyContainer: {
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  replyLabel: {
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  replyText: {
    color: "#333",
    marginBottom: 5,
  },
  replyDate: {
    fontSize: 11,
    color: "#7f8c8d",
  },
  replyButton: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  replyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  replyForm: {
    marginTop: 10,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    minHeight: 100,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  replyButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  submitButton: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 6,
    width: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 6,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noFeedbackText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 20,
  },
});