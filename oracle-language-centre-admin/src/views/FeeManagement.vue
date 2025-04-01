<template>
  <div class="fee-management-container">
    <div class="header-section">
      <h1 class="page-title">Fee Management</h1>
      
      <!-- Filter Navigation -->
      <div class="filter-nav">
        <button 
          @click="filterPayments('all')" 
          :class="{ 'active-filter': selectedMethod === 'all' }"
          class="filter-btn"
        >
          All Payments
        </button>
        <button 
          @click="filterPayments('bank')" 
          :class="{ 'active-filter': selectedMethod === 'bank' }"
          class="filter-btn"
        >
          Bank Payments
        </button>
        <button 
          @click="filterPayments('mpesa')" 
          :class="{ 'active-filter': selectedMethod === 'mpesa' }"
          class="filter-btn"
        >
          M-Pesa Payments
        </button>
      </div>
    </div>

    <!-- Payment Records Table -->
    <div class="table-wrapper">
      <table class="payment-table">
        <thead>
          <tr>
            <th class="index-col">#</th>
            <th>Student Name</th>
            <th>Course</th>
            <th class="amount-col">Amount Paid (Ksh)</th>
            <th class="amount-col">Balance</th>
            <th>Payment Method</th>
            <th>Reference Code</th>
            <th class="status-col">Status</th>
            <th class="date-col">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in filteredPayments" :key="payment.id">
            <td class="index-col">{{ index + 1 }}</td>
            <td>{{ payment.first_name }} {{ payment.last_name }}</td>
            <td>{{ payment.course_name }}</td>
            <td class="amount-col">{{ formatCurrency(payment.amount_paid) }}</td>
            <td class="amount-col">{{ formatCurrency(payment.balance) }}</td>
            <td>
              <span :class="`method-${payment.payment_method.toLowerCase()}`">
                {{ payment.payment_method }}
              </span>
            </td>
            <td>{{ payment.reference_code }}</td>
            <td class="status-col">
              <span :class="`status-badge ${payment.status}`">
                {{ payment.status }}
              </span>
            </td>
            <td class="date-col">{{ formatDate(payment.created_at) }}</td>
          </tr>
          <tr v-if="filteredPayments.length === 0">
            <td colspan="9" class="no-records">
              <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>No payment records found</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  data() {
    return {
      payments: [],
      filteredPayments: [],
      selectedMethod: "all",
    };
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    return { route, router };
  },
  methods: {
    async fetchPayments() {
      try {
        const response = await axios.get("http://localhost:5000/payments");
        this.payments = response.data;
        this.applyFilter();
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    },
    filterPayments(method) {
      this.selectedMethod = method;
      this.router.push({ path: "/fee-management", query: { method } });
      this.applyFilter();
    },
    applyFilter() {
      const method = this.route.query.method || "all";
      if (method === "all") {
        this.filteredPayments = this.payments;
      } else {
        this.filteredPayments = this.payments.filter(
          payment => payment.payment_method.toLowerCase() === method
        );
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(amount).replace('KES', '');
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  },
  watch: {
    "route.query.method"() {
      this.applyFilter();
    },
  },
  mounted() {
    this.fetchPayments();
  },
};
</script>

<style scoped>
.fee-management-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.filter-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background-color: #e0e0e0;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: #d0d0d0;
}

.active-filter {
  background-color: #3498db;
  color: white;
}

.active-filter:hover {
  background-color: #2980b9;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.payment-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.payment-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

.payment-table tbody tr:last-child td {
  border-bottom: none;
}

.payment-table tbody tr:hover {
  background-color: #f5f7fa;
}

.index-col {
  width: 50px;
  text-align: center;
}

.amount-col {
  text-align: right;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.status-col {
  text-align: center;
}

.date-col {
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
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

.method-bank {
  color: #3498db;
  font-weight: 500;
}

.method-mpesa {
  color: #27ae60;
  font-weight: 500;
}

.no-records {
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
  .fee-management-container {
    padding: 1rem;
  }
  
  .filter-nav {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .payment-table th,
  .payment-table td {
    padding: 0.75rem;
  }
}
</style>