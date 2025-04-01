<template>
  <div class="attendance-management">
    <div class="header-section">
      <h2 class="page-title">Student Attendance</h2>
      <div class="controls">
        <div class="search-box">
          <input type="text" placeholder="Search attendance..." v-model="searchQuery">
          <svg class="search-icon" viewBox="0 0 24 24">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="attendance-table">
        <thead>
          <tr>
            <th class="index-col">#</th>
            <th>Student Name</th>
            <th>Tutor Name</th>
            <th>Course Name</th>
            <th class="date-col">Attended At</th>
            <th class="status-col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredAttendance" :key="record.attended_at">
            <td class="index-col">{{ index + 1 }}</td>
            <td>{{ record.student_firstname }} {{ record.student_lastname }}</td>
            <td>{{ record.tutor_firstname }} {{ record.tutor_lastname }}</td>
            <td>{{ record.course_name }}</td>
            <td class="date-col">{{ formatDateTime(record.attended_at) }}</td>
            <td class="status-col">
              <span class="status-badge present">Present</span>
            </td>
          </tr>
          <tr v-if="filteredAttendance.length === 0">
            <td colspan="6" class="no-results">
              <div class="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
                </svg>
                <p>No attendance records found</p>
              </div>
            </td>
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
      attendance: [],
      searchQuery: ''
    };
  },
  computed: {
    filteredAttendance() {
      const query = this.searchQuery.toLowerCase();
      return this.attendance.filter(record => 
        record.student_firstname.toLowerCase().includes(query) ||
        record.student_lastname.toLowerCase().includes(query) ||
        record.tutor_firstname.toLowerCase().includes(query) ||
        record.tutor_lastname.toLowerCase().includes(query) ||
        record.course_name.toLowerCase().includes(query) ||
        this.formatDateTime(record.attended_at).toLowerCase().includes(query)
      );
    }
  },
  methods: {
    formatDateTime(dateString) {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5000/admin/attendance');
      this.attendance = response.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  }
};
</script>

<style scoped>
.attendance-management {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.controls {
  display: flex;
  gap: 1rem;
}

.search-box {
  position: relative;
  width: 250px;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #7f8c8d;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.attendance-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.attendance-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

.attendance-table tbody tr:last-child td {
  border-bottom: none;
}

.attendance-table tbody tr:hover {
  background-color: #f5f7fa;
}

.index-col {
  width: 50px;
  text-align: center;
  color: #7f8c8d;
}

.date-col {
  white-space: nowrap;
}

.status-col {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.present {
  background-color: #d4edda;
  color: #155724;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #7f8c8d;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-state svg {
  width: 2rem;
  height: 2rem;
  color: #bdc3c7;
}

.empty-state p {
  font-style: italic;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
  
  .attendance-table th,
  .attendance-table td {
    padding: 0.75rem;
  }
}
</style>