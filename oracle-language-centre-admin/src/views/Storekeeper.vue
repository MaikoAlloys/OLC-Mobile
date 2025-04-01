<template>
  <div class="storekeeper-dashboard">
    <h2>Storekeepers</h2>
    <div class="storekeeper-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(storekeeper, index) in storekeepers" :key="storekeeper.username">
            <td class="number-column">{{ index + 1 }}</td>
            <td>{{ storekeeper.username }}</td>
            <td>{{ storekeeper.first_name }} {{ storekeeper.last_name }}</td>
            <td>{{ storekeeper.email }}</td>
            <td>{{ storekeeper.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      storekeepers: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5000/admin/storekeepers');
      this.storekeepers = response.data;
    } catch (error) {
      console.error('Error fetching storekeepers data:', error);
    }
  },
};
</script>

<style scoped>
.storekeeper-dashboard {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.storekeeper-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.storekeeper-container table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.storekeeper-container th {
  background-color: #3498db;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.storekeeper-container td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
}

.storekeeper-container tr:nth-child(even) {
  background-color: #f9f9f9;
}

.storekeeper-container tr:hover {
  background-color: #f1f9ff;
}

.number-column {
  color: #7f8c8d;
  font-weight: 500;
  width: 50px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .storekeeper-dashboard {
    padding: 15px;
  }
  
  .storekeeper-container th,
  .storekeeper-container td {
    padding: 8px 10px;
    font-size: 13px;
  }
}
</style>