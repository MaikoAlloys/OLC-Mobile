<template>
  <div class="student-management-container">
    <div class="header-section">
      <h2 class="page-title">Students</h2>
      <p class="status-indicator" v-if="status === 'pending'">Showing students pending approval...</p>
      <p class="status-indicator" v-if="status === 'approved'">Showing approved students...</p>
      <p class="status-indicator" v-if="status === 'total'">Showing all students...</p>
    </div>

    <div class="table-container">
      <table class="student-table">
        <thead>
          <tr>
            <th class="number-col">#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th v-if="status === 'pending'">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="student.id">
            <td class="number-col">{{ index + 1 }}</td>
            <td>{{ student.username }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.phone }}</td>
            <td>
              <span class="status-badge" :class="student.is_approved ? 'approved' : 'pending'">
                {{ student.is_approved ? "Approved" : "Pending" }}
              </span>
            </td>
            <td v-if="status === 'pending'">
              <button class="approve-btn" @click="approveStudent(student.id)">Approve</button>
            </td>
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
    return { students: [], status: this.$route.query.status || "total" };
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await axios.get(`http://localhost:5000/admin/students?status=${this.status}`);
        this.students = response.data;
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    async approveStudent(id) {
      try {
        await axios.put(`http://localhost:5000/admin/students/${id}/approve`);
        this.fetchStudents(); // Refresh the list after approval
      } catch (error) {
        console.error("Error approving student:", error);
      }
    }
  },
  mounted() {
    this.fetchStudents();
  }
};
</script>

<style scoped>
.student-management-container {
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-section {
  margin-bottom: 24px;
}

.page-title {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.status-indicator {
  color: #7f8c8d;
  font-size: 14px;
}

.table-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.student-table th {
  background-color: #34495e;
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.student-table th:first-child {
  border-top-left-radius: 8px;
}

.student-table th:last-child {
  border-top-right-radius: 8px;
}

.student-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
}

.student-table tr:last-child td {
  border-bottom: none;
}

.student-table tr:hover td {
  background-color: #f8f9fa;
}

.number-col {
  width: 50px;
  text-align: center;
  color: #7f8c8d;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
}

.approve-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.approve-btn:hover {
  background-color: #218838;
}
</style>