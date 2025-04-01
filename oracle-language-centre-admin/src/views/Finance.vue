<template>
  <div class="finance-management">
    <div class="header-section">
      <h2 class="page-title">Finance Users</h2>
    </div>
    
    <div class="table-container">
      <table class="finance-table">
        <thead>
          <tr>
            <th class="index-col">#</th>
            <th class="username-col">Username</th>
            <th class="name-col">Full Name</th>
            <th class="email-col">Email</th>
            <th class="phone-col">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in financeUsers" :key="index">
            <td class="index-col">{{ index + 1 }}</td>
            <td class="username-col">{{ user.username }}</td>
            <td class="name-col">{{ user.fullname }}</td>
            <td class="email-col">{{ user.email }}</td>
            <td class="phone-col">{{ user.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      financeUsers: [],
    };
  },
  mounted() {
    this.fetchFinanceUsers();
  },
  methods: {
    async fetchFinanceUsers() {
      try {
        const response = await fetch('http://localhost:5000/admin/finance');
        const data = await response.json();
        this.financeUsers = data;
      } catch (error) {
        console.error('Error fetching finance users:', error);
      }
    },
  },
};
</script>

<style scoped>
.finance-management {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-section {
  margin-bottom: 1.5rem;
}

.page-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.table-container {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  background: white;
}

.finance-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: auto;
}

.finance-table th {
  background-color: #34495e;
  color: white;
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.finance-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f2f5;
  color: #2c3e50;
  vertical-align: middle;
}

.finance-table tr:last-child td {
  border-bottom: none;
}

.finance-table tr:hover td {
  background-color: #f8fafc;
}

/* Column-specific styling */
.index-col {
  width: 5%;
  min-width: 50px;
  text-align: center;
  color: #7f8c8d;
  font-weight: 500;
}

.username-col {
  width: 15%;
  min-width: 150px;
}

.name-col {
  width: 20%;
  min-width: 180px;
}

.email-col {
  width: 30%;
  min-width: 250px;
}

.phone-col {
  width: 15%;
  min-width: 150px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .finance-management {
    padding: 1.5rem;
  }
  
  .finance-table th,
  .finance-table td {
    padding: 0.9rem 1rem;
  }
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .finance-table {
    min-width: 800px;
  }
}
</style>