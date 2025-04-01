<template>
  <div class="resource-requests-container">
    <div class="header-section">
      <h2 class="page-title">Library Resource Requests</h2>
      <div class="summary-stats">
        <span class="stat-item">Total Requests: {{ resourceRequests.length }}</span>
        <span class="stat-item">Pending: {{ pendingCount }}</span>
        <span class="stat-item">Approved: {{ approvedCount }}</span>
      </div>
    </div>
    
    <div class="table-responsive">
      <table class="requests-table">
        <thead>
          <tr>
            <th class="number-column">#</th>
            <th class="id-column">ID</th>
            <th class="name-column">Student Name</th>
            <th class="resource-column">Requested Resource</th>
            <th class="course-column">Course Name</th>
            <th class="status-column">Status</th>
            <th class="date-column">Requested At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(request, index) in resourceRequests" :key="request.id">
            <td class="number-column">{{ index + 1 }}</td>
            <td class="id-column">{{ request.id }}</td>
            <td class="name-column">{{ request.first_name }} {{ request.last_name }}</td>
            <td class="resource-column">{{ request.resource_name }}</td>
            <td class="course-column">{{ request.course_name }}</td>
            <td class="status-column">
              <span :class="'status-badge status-' + request.status.toLowerCase()">
                {{ request.status }}
              </span>
            </td>
            <td class="date-column">{{ formatDate(request.requested_at) }}</td>
          </tr>
          <tr v-if="resourceRequests.length === 0">
            <td colspan="7" class="no-requests">No resource requests found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      resourceRequests: [],
    };
  },
  computed: {
    pendingCount() {
      return this.resourceRequests.filter(r => r.status.toLowerCase() === 'pending').length;
    },
    approvedCount() {
      return this.resourceRequests.filter(r => r.status.toLowerCase() === 'approved').length;
    }
  },
  mounted() {
    this.fetchResourceRequests();
  },
  methods: {
    async fetchResourceRequests() {
      try {
        const response = await axios.get("http://localhost:5000/admin/resource-requests");
        this.resourceRequests = response.data;
      } catch (error) {
        console.error("Error fetching resource requests:", error);
      }
    },
    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString('en-US', options);
    }
  },
};
</script>

<style scoped>
.resource-requests-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.summary-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;
}

.table-responsive {
  overflow-x: auto;
}

.requests-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.requests-table thead th {
  background-color: #3498db;
  color: white;
  font-weight: 500;
  text-align: left;
  padding: 12px 15px;
  position: sticky;
  top: 0;
}

.requests-table th:first-child {
  border-top-left-radius: 6px;
}

.requests-table th:last-child {
  border-top-right-radius: 6px;
}

.requests-table tbody tr {
  transition: background-color 0.2s;
}

.requests-table tbody tr:hover {
  background-color: #f8f9fa;
}

.requests-table tbody td {
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
}

.requests-table tbody tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
}

.status-denied {
  background-color: #f8d7da;
  color: #721c24;
}

.no-requests {
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
}

/* Column specific styles */
.number-column {
  width: 50px;
  text-align: center;
}

.id-column {
  width: 60px;
}

.name-column {
  width: 180px;
}

.resource-column {
  min-width: 200px;
}

.course-column {
  width: 150px;
}

.status-column {
  width: 100px;
}

.date-column {
  width: 160px;
}
</style>