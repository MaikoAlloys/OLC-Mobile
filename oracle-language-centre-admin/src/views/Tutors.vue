<template>
  <div class="tutors-management-container">
    <h2 class="page-title">All Tutors</h2>
    
    <div class="table-wrapper">
      <table class="tutors-table">
        <thead>
          <tr>
            <th class="number-col">#</th>
            <th class="username-col">Username</th>
            <th class="name-col">Full Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tutor, index) in tutors" :key="tutor.id">
            <td class="number-col">{{ index + 1 }}</td>
            <td class="username-col">{{ tutor.username }}</td>
            <td class="name-col">{{ tutor.Firstname }} {{ tutor.Lastname }}</td>
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
      tutors: [],
    };
  },
  methods: {
    async fetchTutors() {
      try {
        const response = await axios.get("http://localhost:5000/admin/tutors");
        this.tutors = response.data;
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    },
  },
  mounted() {
    this.fetchTutors();
  },
};
</script>

<style scoped>
.tutors-management-container {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.table-wrapper {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  background: white;
  padding: 1rem;
}

.tutors-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: auto;
}

.tutors-table th {
  background-color: #34495e;
  color: white;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.tutors-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f2f5;
  color: #2c3e50;
  vertical-align: middle;
}

.tutors-table tr:last-child td {
  border-bottom: none;
}

.tutors-table tr:hover td {
  background-color: #f8fafc;
}

.number-col {
  width: 5%;
  min-width: 50px;
  text-align: center;
  color: #7f8c8d;
  font-weight: 500;
}

.username-col {
  width: 30%;
  min-width: 200px;
}

.name-col {
  width: 65%;
  min-width: 300px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-wrapper {
    padding: 0.5rem;
  }
  
  .tutors-table th,
  .tutors-table td {
    padding: 0.75rem 1rem;
  }
  
  .username-col,
  .name-col {
    min-width: auto;
  }
}
</style>