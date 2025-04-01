<template>
  <div class="admin-container">
    <!-- Horizontal Bar for Filtering Payments -->
    <div class="filter-bar">
      <button 
        @click="filterPayments('ALL')"
        :class="{ active: activeFilter === 'ALL' }"
      >ALL PAYMENTS</button>
      <button 
        @click="filterPayments('bank')"
        :class="{ active: activeFilter === 'bank' }"
      >BANK TRANSFERS</button>
      <button 
        @click="filterPayments('mpesa')"
        :class="{ active: activeFilter === 'mpesa' }"
      >MPESA PAYMENTS</button>
    </div>

    <!-- Supplier Management Table -->
    <div class="supplier-table-container">
      <table class="supplier-table">
        <thead>
          <tr>
            <th class="number-col">#</th>
            <th>Supplier Name</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Total Cost</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="item.id">
            <td class="number-col">{{ index + 1 }}</td>
            <td>{{ item.first_name }} {{ item.last_name }}</td>
            <td>{{ item.item_name }}</td>
            <td class="quantity-cell">{{ item.quantity_requested }}</td>
            <td>
              <span class="status-badge" :class="item.status.toLowerCase()">
                {{ item.status }}
              </span>
            </td>
            <td class="amount-cell">KSh {{ formatNumber(item.total_cost) }}</td>
            <td>
              <span class="payment-method" :class="item.payment_method.toLowerCase()">
                {{ item.payment_method }}
              </span>
            </td>
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
      supplierData: [],
      filteredData: [],
      activeFilter: 'ALL'
    };
  },
  mounted() {
    this.fetchSupplierData();
  },
  methods: {
    async fetchSupplierData() {
      try {
        const response = await fetch('http://localhost:5000/admin/suppliers/payments');
        const data = await response.json();
        this.supplierData = data;
        this.filteredData = data; // Initially show all data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    filterPayments(method) {
      this.activeFilter = method;
      if (method === 'ALL') {
        this.filteredData = this.supplierData;
      } else {
        this.filteredData = this.supplierData.filter(item => 
          item.payment_method.toLowerCase() === method.toLowerCase()
        );
      }
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
  }
};
</script>

<style scoped>
/* All your existing CSS styles remain exactly the same */
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  width: 100%;
}

.filter-bar button {
  padding: 12px 25px;
  background-color: #f5f7fa;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.filter-bar button:hover {
  background-color: #ebf0f7;
  transform: translateY(-1px);
}

.filter-bar button.active {
  background-color: #4299e1;
  color: white;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.3);
}

.supplier-table-container {
  width: 100%;
  max-width: 1200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.supplier-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
}

.supplier-table th {
  background-color: #2c5282;
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.supplier-table th:first-child {
  border-top-left-radius: 8px;
}

.supplier-table th:last-child {
  border-top-right-radius: 8px;
}

.supplier-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
}

.number-col {
  width: 50px;
  text-align: center;
  color: #718096;
  font-weight: 600;
}

.supplier-table th.number-col {
  text-align: center;
}

.supplier-table tr:last-child td {
  border-bottom: none;
}

.supplier-table tr:hover td {
  background-color: #f8fafc;
}

.quantity-cell {
  font-weight: 600;
  color: #2b6cb0;
}

.amount-cell {
  font-weight: 600;
  color: #2f855a;
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
  background-color: #feebc8;
  color: #b7791f;
}

.status-badge.completed {
  background-color: #c6f6d5;
  color: #276749;
}

.status-badge.cancelled {
  background-color: #fed7d7;
  color: #9b2c2c;
}

.payment-method {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
}

.payment-method.bank {
  background-color: #ebf8ff;
  color: #3182ce;
}

.payment-method.mpesa {
  background-color: #ebf5ff;
  color: #5a67d8;
}
</style>