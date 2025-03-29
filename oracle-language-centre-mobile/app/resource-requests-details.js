import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "./api";

const ResourceRequestDetails = () => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const params = useLocalSearchParams();
  const resourceId = params.id;

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const studentToken = await AsyncStorage.getItem("studentToken");
        if (!studentToken) throw new Error("Please log in to view resource details");
        const studentData = JSON.parse(studentToken);
        setStudentId(studentData.id);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStudentId();
  }, []);

  const fetchResourceDetails = async () => {
    if (!studentId || !resourceId) return;
    
    try {
      const response = await api.get(
        `/students/resource-details/${studentId}/${resourceId}`
      );
      
      if (response.data.success) {
        setResource(response.data.data);
      } else {
        setError(response.data.message || "Resource not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch resource details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchResourceDetails();
    }
  }, [studentId]);

  const handleConfirmReceipt = async () => {
    if (!resource || resource.student_confirmed === 1) return;
    
    setIsConfirming(true);
    try {
      const response = await api.post(
        `/students/confirm-receipt/${studentId}/${resource.course_id}/${resource.resource_id}`
      );
      
      if (response.data.success) {
        Alert.alert("Confirmed", "You have confirmed receipt of this resource");
        setResource(prev => ({ ...prev, student_confirmed: 1 }));
      } else {
        Alert.alert("Error", response.data.message || "Confirmation failed");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to confirm receipt");
    } finally {
      setIsConfirming(false);
    }
  };

  const renderStatusMessage = () => {
    if (!resource) return null;

    switch (resource.status) {
      case "submitted":
        return (
          <Text style={styles.statusSubmitted}>
            File has been submitted by Librarian
          </Text>
        );
      case "requested":
        return (
          <Text style={styles.statusRequested}>
            Waiting for Librarian to process your request
          </Text>
        );
      default:
        return (
          <Text style={styles.statusDefault}>
            Status: {resource.status}
          </Text>
        );
    }
  };

  const renderConfirmButton = () => {
    if (!resource || resource.student_confirmed === 1) return null;
    
    if (resource.status === "submitted" && resource.librarian_submitted === 1) {
      return (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmReceipt}
          disabled={isConfirming}
        >
          <Text style={styles.buttonText}>
            {isConfirming ? "Confirming..." : "Confirm Receipt"}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!resource) {
    return (
      <View style={styles.container}>
        <Text>No resource details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resource Details</Text>
      
      <View style={styles.card}>
        <Text style={styles.resourceName}>{resource.resource_name}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Course ID:</Text>
          <Text style={styles.detailValue}>{resource.course_id}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>
            {new Date(resource.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Requested:</Text>
          <Text style={styles.detailValue}>
            {new Date(resource.requested_at).toLocaleDateString()}
          </Text>
        </View>

        {renderStatusMessage()}

        <View style={styles.statusRow}>
          <Text style={styles.detailLabel}>Librarian Submitted:</Text>
          <Text style={styles.detailValue}>
            {resource.librarian_submitted ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.detailLabel}>Student Confirmed:</Text>
          <Text style={styles.detailValue}>
            {resource.student_confirmed ? "Yes" : "Not yet"}
          </Text>
        </View>

        {renderConfirmButton()}

        {resource.student_confirmed === 1 && (
          <Text style={styles.confirmedText}>
            You have confirmed receipt of this resource
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  detailLabel: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
  },
  statusSubmitted: {
    fontSize: 16,
    color: '#0f5132',
    backgroundColor: '#d1e7dd',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    textAlign: 'center',
  },
  statusRequested: {
    fontSize: 16,
    color: '#084298',
    backgroundColor: '#cfe2ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    textAlign: 'center',
  },
  statusDefault: {
    fontSize: 16,
    color: '#41464b',
    backgroundColor: '#e2e3e5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#198754',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmedText: {
    fontSize: 16,
    color: '#0f5132',
    backgroundColor: '#d1e7dd',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    textAlign: 'center',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ResourceRequestDetails;