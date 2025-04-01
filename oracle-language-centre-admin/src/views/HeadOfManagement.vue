<template>
  <div class="management-container">
    <h1 class="management-header">Head of Management</h1>
    <div class="table-responsive">
      <table class="management-table">
        <thead>
          <tr>
            <th class="index-col">#</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hod, index) in hods" :key="hod.username">
            <td class="index-col">{{ index + 1 }}</td>
            <td>{{ hod.username }}</td>
            <td>{{ hod.firstname }} {{ hod.lastname }}</td>
            <td>{{ hod.email }}</td>
            <td>{{ hod.phone }}</td>
          </tr>
          <tr v-if="hods.length === 0">
            <td colspan="5" class="no-data">No records found</td>
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
      hods: [],
    };
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:5000/admin/head-management");
      this.hods = response.data;
    } catch (error) {
      console.error("Error fetching HODs:", error);
    }
  },
};
</script>

<style scoped>
.management-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.management-header {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.table-responsive {
  overflow-x: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.management-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.management-table th {
  background-color: #3498db;
  color: white;
  text-align: left;
  padding: 12px 15px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.management-table th.index-col {
  width: 50px;
  text-align: center;
}

.management-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

.management-table td.index-col {
  text-align: center;
  color: #7f8c8d;
  font-weight: 500;
}

.management-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.management-table tbody tr:hover {
  background-color: #ebf5fb;
  transition: background-color 0.2s ease;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .management-container {
    padding: 1rem;
  }
  
  .management-table th,
  .management-table td {
    padding: 8px 10px;
  }
}
</style>