<template>
  <div class="courses-management">
    <div class="header-section">
      <h2 class="page-title">Available Courses</h2>
      <p class="page-subtitle">Explore our language programs</p>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading courses...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <div class="error-icon">!</div>
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="card-header">
          <h3 class="course-name">{{ course.name }}</h3>
          <div class="course-duration">{{ course.duration }}</div>
        </div>
        <div class="card-body">
          <p class="course-description">{{ course.description }}</p>
          <div class="course-fee">Ksh {{ formatNumber(course.fee) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      courses: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get("http://localhost:5000/admin/courses");
        this.courses = response.data;
      } catch (err) {
        this.error = "Failed to fetch courses. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
};
</script>

<style scoped>
.courses-management {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  box-sizing: border-box;
}

.header-section {
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-state {
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
}

.error-icon {
  width: 30px;
  height: 30px;
  background-color: #dc2626;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

/* Improved grid layout */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.course-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Fixes flexbox overflow issues */
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: #3498db;
  padding: 1.5rem;
  color: white;
}

.course-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.course-duration {
  font-size: 0.95rem;
  opacity: 0.9;
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.course-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.course-fee {
  margin-top: auto;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
}

/* Responsive adjustments */
@media (max-width: 1000px) {
  .courses-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
  
  .course-card {
    max-width: 100%;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>