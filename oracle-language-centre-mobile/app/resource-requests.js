import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import api from "./api";

const LibrarianRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    api.get('/librarian/requests')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
      });
  };

  const submitResource = (requestId) => {
    api.put(`/librarian/submit/${requestId}`)
      .then(() => {
        fetchRequests();
      })
      .catch(error => {
        console.error('Error submitting resource:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resource Requests</Text>
      {requests.length ? (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedRequest(item)}>
              <Text><Text style={styles.label}>Student:</Text> {item.student_first_name} {item.student_last_name}</Text>
              <Text><Text style={styles.label}>Course:</Text> {item.course_name}</Text>
              <Text><Text style={styles.label}>Resource:</Text> {item.resource_name}</Text>
              <Text><Text style={styles.label}>Student Confirmation:</Text> {item.student_confirmed ? 'Confirmed' : 'Pending'}</Text>
              <Text><Text style={styles.label}>Status:</Text> {item.status === 'submitted' ? 'Processed' : 'Pending'}</Text>
              {item.status !== 'submitted' && (
                <TouchableOpacity style={styles.button} onPress={() => submitResource(item.id)}>
                  <Text style={styles.buttonText}>Submit </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No resource requests found.</Text>
      )}

      {selectedRequest && (
        <Modal transparent={true} visible={!!selectedRequest}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Request Details</Text>
              <Text><Text style={styles.label}>Student:</Text> {selectedRequest.student_first_name} {selectedRequest.student_last_name}</Text>
              <Text><Text style={styles.label}>Course:</Text> {selectedRequest.course_name}</Text>
              <Text><Text style={styles.label}>Resource:</Text> {selectedRequest.resource_name}</Text>
              <Text><Text style={styles.label}>Student Confirmation:</Text> {selectedRequest.student_confirmed ? 'Confirmed' : 'Pending'}</Text>
              <Text><Text style={styles.label}>Status:</Text> {selectedRequest.status === 'submitted' ? 'Processed' : 'Pending'}</Text>
              {selectedRequest.status !== 'submitted' && (
                <TouchableOpacity style={styles.button} onPress={() => submitResource(selectedRequest.id)}>
                  <Text style={styles.buttonText}>Submit Resource</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedRequest(null)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { fontWeight: 'bold' },
  button: { backgroundColor: '#007bff', padding: 10, marginTop: 5, borderRadius: 5 },
  buttonText: { color: 'white', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 5, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  closeButton: { backgroundColor: 'red', padding: 10, marginTop: 10, borderRadius: 5 }
});

export default LibrarianRequests;
