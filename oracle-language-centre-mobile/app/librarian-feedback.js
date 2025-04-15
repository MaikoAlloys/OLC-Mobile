import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LibrarianFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [librarianName, setLibrarianName] = useState('');

  useEffect(() => {
    // Fetch librarian data and feedback when component mounts
    const fetchData = async () => {
      try {
        // Get librarian data from AsyncStorage
        const librarianData = await AsyncStorage.getItem("librarianToken");
        if (librarianData) {
          const parsedData = JSON.parse(librarianData);
          setLibrarianName(parsedData.username); // Set librarian name for replies
          fetchFeedback();
        } else {
          setLoading(false);
          Alert.alert("Error", "Please login first");
        }
      } catch (error) {
        console.error('Error fetching librarian data:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load librarian data');
      }
    };

    fetchData();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback/librarian-feedback');
      setFeedbackList(response.data.feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      Alert.alert('Error', 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) {
      Alert.alert('Error', 'Reply message is required');
      return;
    }

    try {
      await api.post(`/feedback/librarian-feedback/reply/${replyingTo.feedback_id}`, {
        replyMessage: replyMessage.trim(),
        replyBy: librarianName.trim() // Auto-filled from librarian data
      });

      Alert.alert('Success', 'Reply submitted successfully');
      setReplyingTo(null);
      setReplyMessage('');
      fetchFeedback(); // Refresh the feedback list
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to submit reply');
    }
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <View>
          <Text style={styles.feedbackTitle}>{item.subject || 'Library Inquiry'}</Text>
          <Text style={styles.senderName}>From: {item.sender_name}</Text>
        </View>
        <Text style={styles.feedbackDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.feedbackMessage}>{item.message}</Text>
      
      {item.status === 'resolved' && item.reply ? (
        <View style={styles.replyContainer}>
          <Text style={styles.replyHeader}>Your Reply:</Text>
          <Text style={styles.replyMessage}>{item.reply}</Text>
          <Text style={styles.replyMeta}>
            Replied by {item.reply_by} on {new Date(item.reply_time).toLocaleString()}
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.replyButton}
          onPress={() => setReplyingTo(item)}
        >
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && feedbackList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34495e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library Feedback</Text>
      
      {feedbackList.length === 0 ? (
        <Text style={styles.noFeedbackText}>No feedback available</Text>
      ) : (
        <FlatList
          data={feedbackList}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item.feedback_id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchFeedback}
        />
      )}

      {/* Reply Modal */}
      <Modal
        visible={!!replyingTo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReplyingTo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reply to Feedback</Text>
            <Text style={styles.modalSubject}>{replyingTo?.subject || 'Library Inquiry'}</Text>
            <Text style={styles.senderNameModal}>From: {replyingTo?.sender_name}</Text>
            <Text style={styles.modalMessage}>{replyingTo?.message}</Text>
            
            <Text style={styles.replyInfo}>
              Replying as: {librarianName}
            </Text>
            
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Type your reply here"
              multiline
              numberOfLines={4}
              value={replyMessage}
              onChangeText={setReplyMessage}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setReplyingTo(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleReplySubmit}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  feedbackItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  senderName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  senderNameModal: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  feedbackDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  feedbackMessage: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 12,
  },
  replyContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34495e',
  },
  replyHeader: {
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 4,
  },
  replyMessage: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 4,
  },
  replyMeta: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  replyButton: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  replyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noFeedbackText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 5,
  },
  modalMessage: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  replyInfo: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 15,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  submitButton: {
    backgroundColor: '#34495e',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LibrarianFeedback;