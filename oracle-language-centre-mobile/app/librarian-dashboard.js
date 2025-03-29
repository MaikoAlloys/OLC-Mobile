import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import api from "./api";

const LearningResourcesScreen = () => {
  const [learningResources, setLearningResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarAnim] = useState(new Animated.Value(-250)); // Sidebar hidden initially
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLearningResources = async () => {
      try {
        const response = await api.get('/librarian/learning-resources');
        setLearningResources(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchLearningResources();
  }, []);

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -250 : 0;
    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing authentication tokens)
    console.log('User logged out');
    router.push('/librarian-login'); // Redirect to login page
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      {sidebarOpen && <View style={styles.overlay} onTouchStart={toggleSidebar} />}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <View style={styles.sidebarMenu}>
          <TouchableOpacity onPress={() => router.push('/librarian-dashboard')}>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/librarian-profile')}>
            <Text style={styles.navItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/resource-requests')}>
            <Text style={styles.navItem}>Resource Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/submitted-resources')}>
            <Text style={styles.navItem}>Submitted Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cleared-students')}>
            <Text style={styles.navItem}>Cleared Students</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={[styles.navItem, styles.logout]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sidebar Toggle Button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      {/* Learning Resources */}
      <Text style={styles.title}>Learning Resources</Text>
      <FlatList
        data={Object.values(learningResources)}
        keyExtractor={(item) => item.course_name}
        renderItem={({ item }) => (
          <View style={styles.courseContainer}>
            <Text style={styles.courseTitle}>{item.course_name}</Text>
            <FlatList
              data={item.resources}
              keyExtractor={(resource) => resource.resource_id.toString()}
              renderItem={({ item: resource }) => (
                <View style={styles.resourceItem}>
                  <Text>{resource.resource_name}</Text>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: -250,
    width: 250,
    height: '100%',
    backgroundColor: '#2C3E50',
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 3,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 24,
    color: '#ECF0F1',
  },
  sidebarMenu: {
    marginTop: 20,
  },
  navItem: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#ECF0F1',
  },
  logout: {
    color: '#E74C3C',
    marginTop: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 3,
    backgroundColor: '#2C3E50',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  menuText: {
    fontSize: 24,
    color: '#ECF0F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 80,
  },
  courseContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resourceItem: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
});

export default LearningResourcesScreen;
