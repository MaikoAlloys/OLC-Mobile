<template>
  <div class="dashboard">
    <h2>Admin Dashboard</h2>
    <div class="cards-container">
      <div class="card" @click="navigateTo('/courses')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h3>Courses</h3>
        <p>Manage available courses and curriculum</p>
      </div>

      <div class="card" @click="navigateTo('/library-management')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <h3>Library Management</h3>
        <p>Manage books, e-resources and publications</p>
      </div>

      <div class="card" @click="navigateTo('/supplier-management')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3>Supplier Management</h3>
        <p>Handle vendor contracts and procurement</p>
      </div>

      <div class="card" @click="navigateTo('/fee-management')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h3>Fee Management</h3>
        <p>Monitor student payments and invoices</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns for larger screens */
  gap: 25px;
  width: 100%;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.card:nth-child(1) .card-icon {
  background-color: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.card:nth-child(2) .card-icon {
  background-color: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
}

.card:nth-child(3) .card-icon {
  background-color: rgba(26, 188, 156, 0.1);
  color: #1abc9c;
}

.card:nth-child(4) .card-icon {
  background-color: rgba(241, 196, 15, 0.1);
  color: #f1c40f;
}

.card h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #2c3e50;
  font-weight: 600;
}

.card p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for medium screens */
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr; /* 1 column for small screens */
  }

  .card {
    max-width: 100%;
  }
}
</style>
