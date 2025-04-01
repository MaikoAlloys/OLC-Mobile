<template>
  <div class="suppliers-management">
    <div class="header-section">
      <h1 class="page-title">Suppliers</h1>
      <p class="page-subtitle">List of all registered suppliers</p>
    </div>
    
    <div class="table-wrapper">
      <table class="suppliers-table">
        <thead>
          <tr>
            <th class="index-col">#</th>
            <th class="username-col">Username</th>
            <th class="name-col">Full Name</th>
            <th class="email-col">Email Address</th>
            <th class="phone-col">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supplier, index) in suppliers" :key="index">
            <td class="index-col">{{ index + 1 }}</td>
            <td class="username-col">{{ supplier.username }}</td>
            <td class="name-col">{{ supplier.fullname }}</td>
            <td class="email-col">{{ supplier.email }}</td>
            <td class="phone-col">{{ supplier.phone }}</td>
          </tr>
          <tr v-if="suppliers.length === 0">
            <td colspan="5" class="no-data">No suppliers found</td>
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
      suppliers: [],
    };
  },
  mounted() {
    this.fetchSuppliers();
  },
  methods: {
    async fetchSuppliers() {
      try {
        const response = await fetch('http://localhost:5000/admin/suppliers');
        const data = await response.json();
        this.suppliers = data;
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    },
  },
};
</script>

<style scoped>
.suppliers-management {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
  text-align: left;
}

.page-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
}

.table-wrapper {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
}

.suppliers-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: auto;
}

.suppliers-table th {
  background-color: #34495e;
  color: white;
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.suppliers-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f2f5;
  color: #2c3e50;
  vertical-align: middle;
  font-size: 0.95rem;
}

.suppliers-table tr:last-child td {
  border-bottom: none;
}

.suppliers-table tr:hover td {
  background-color: #f8fafc;
}

/* Column-specific styling */
.index-col {
  width: 5%;
  min-width: 60px;
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
  min-width: 200px;
}

.email-col {
  width: 35%;
  min-width: 250px;
}

.phone-col {
  width: 15%;
  min-width: 150px;
}

.no-data {
  text-align: center;
  color: #95a5a6;
  font-style: italic;
  padding: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .suppliers-management {
    padding: 1.5rem;
  }
}

@media (max-width: 992px) {
  .suppliers-table th,
  .suppliers-table td {
    padding: 1rem 1.25rem;
  }
}

@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: auto;
  }
  
  .suppliers-table {
    min-width: 900px;
  }
  
  .header-section {
    text-align: center;
  }
}
</style>