<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// Navigation State
const showStudents = ref(false);
const toggleSubmenu = () => {
  showStudents.value = !showStudents.value;
};

// Vue Router
const router = useRouter();
const route = useRoute();

// Authentication Check
const isAuthenticated = computed(() => !!localStorage.getItem("adminToken"));

// Check if on Login Page
const isLoginPage = computed(() => route.path === "/admin-login");

// Redirect to login if not authenticated
onMounted(() => {
  if (!isAuthenticated.value && !isLoginPage.value) {
    router.push("/admin-login");
  }
});

// Logout Function
const handleLogout = () => {
  localStorage.removeItem("adminToken");
  router.push("/admin-login");
};

// Search Functionality
const searchQuery = ref("");
const filteredItems = ref([]); // To store filtered items

// Sample data for demonstration (replace with your actual data)
const items = ref([
  { id: 1, name: "Student 1", status: "pending" },
  { id: 2, name: "Student 2", status: "approved" },
  { id: 3, name: "Tutor 1", status: "active" },
  { id: 4, name: "Finance Record 1", status: "paid" },
]);

// Watch for changes in searchQuery and filter items
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() !== "") {
    filteredItems.value = items.value.filter((item) =>
      item.name.toLowerCase().includes(newQuery.toLowerCase())
    );
  } else {
    filteredItems.value = []; // Clear filtered items if search query is empty
  }
});
</script>

<template>
  <div>
    <!-- Show Sidebar & Topbar ONLY if logged in and NOT on login page -->
    <template v-if="isAuthenticated && !isLoginPage">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <div class="hamburger-menu" @click="toggleSidebar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h2 class="logo">Admin Panel</h2>
        </div>
        <div class="topbar-right">
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search..."
              class="search-box"
            />
            <svg class="search-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
          </div>
          <div class="user-menu">
            <button class="logout-button" @click="handleLogout">
              <svg class="logout-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div class="container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <h2 class="sidebar-title">Navigation</h2>
          </div>
          <div class="sidebar-content">
            <nav class="sidebar-nav">
              <ul class="nav-menu">
                <li class="nav-item">
                  <router-link to="/dashboard" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                    </svg>
                    <span>Dashboard</span>
                  </router-link>
                </li>
                
                <li class="nav-item has-submenu" :class="{ 'active': showStudents }">
                  <div class="nav-link" @click="toggleSubmenu">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                    <span>Students</span>
                    <svg class="submenu-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                    </svg>
                  </div>
                  <ul class="submenu" v-if="showStudents">
                    <li class="submenu-item">
                      <router-link to="/students?status=pending" class="submenu-link">
                        <span>Pending Approval</span>
                      </router-link>
                    </li>
                    <li class="submenu-item">
                      <router-link to="/students?status=approved" class="submenu-link">
                        <span>Approved Students</span>
                      </router-link>
                    </li>
                    <li class="submenu-item">
                      <router-link to="/students?status=total" class="submenu-link">
                        <span>Total Students</span>
                      </router-link>
                    </li>
                  </ul>
                </li>
                
                <li class="nav-item">
                  <router-link to="/tutors" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                    <span>Tutors</span>
                  </router-link>
                </li>

                <li class="nav-item">
                  <router-link to="/head-management" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                    <span>Head of Department</span>
                  </router-link>
                </li>
                
                <li class="nav-item">
                  <router-link to="/storekeeper" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                    <span>Storekeeper</span>
                  </router-link>
                </li>
                          
                <li class="nav-item">
                  <router-link to="/finance" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z" />
                    </svg>
                    <span>Finance Managers</span>
                  </router-link>
                </li>

<router-link to="/attendance" class="nav-link">
  <svg class="nav-icon" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,11A1,1 0 0,1 13,12A1,1 0 0,1 12,13A1,1 0 0,1 11,12A1,1 0 0,1 12,11Z" />
  </svg>
  <span>Attendance</span>
</router-link>
                
                
                <li class="nav-item">
                  <router-link to="/suppliers" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                    </svg>
                    <span>Suppliers</span>
                  </router-link>
                </li>
                
                <li class="nav-item">
                  <router-link to="/supplier-management" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                    </svg>
                    <span>Supplier Management</span>
                  </router-link>
                </li>
                
                <li class="nav-item">
                  <router-link to="/fee-management" class="nav-link">
                    <svg class="nav-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11,2V22C5.9,21.5 2,17.16 2,12C2,6.84 5.9,2.5 11,2M13,2V11H22C21.5,6.25 17.71,2.11 13,2M13,13V22C17.71,21.86 21.5,17.73 22,13H13Z" />
                    </svg>
                    <span>Fee Management</span>
                  </router-link>
                </li>
              </ul>
            </nav>
            
            <div class="sidebar-footer">
              <div class="user-profile">
                <div class="user-avatar">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                </div>
                <div class="user-info">
                  <div class="user-name">Admin User</div>
                  <div class="user-role">Administrator</div>
                </div>
              </div>
              <button class="sidebar-logout" @click="handleLogout">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="content">
          <!-- Display filtered items -->
          <div v-if="searchQuery.trim() !== ''" class="search-results">
            <h3 class="search-results-title">Search Results</h3>
            <div v-if="filteredItems.length > 0">
              <ul class="results-list">
                <li v-for="item in filteredItems" :key="item.id" class="result-item">
                  <div class="result-info">
                    <span class="result-name">{{ item.name }}</span>
                    <span class="result-type">{{ getItemType(item) }}</span>
                  </div>
                  <span class="result-status" :class="'status-' + item.status.toLowerCase()">{{ item.status }}</span>
                </li>
              </ul>
            </div>
            <div v-else class="no-results">
              No results found for "{{ searchQuery }}"
            </div>
          </div>

          <!-- Default Router View -->
          <router-view v-else></router-view>
        </main>
      </div>
    </template>

    <!-- Show Only Login Page if Not Authenticated -->
    <router-view v-else></router-view>
  </div>
</template>

<style scoped>
/* Base Styles */
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --accent-color: #e74c3c;
  --sidebar-bg: #2c3e50;
  --sidebar-text: #ecf0f1;
  --sidebar-hover: #34495e;
  --sidebar-active: #3498db;
  --topbar-bg: #2c3e50;
  --topbar-text: #ffffff;
  --content-bg: #f5f7fa;
  --border-color: #e0e0e0;
  --success-color: #2ecc71;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --info-color: #3498db;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Top Bar */
.topbar {
  background: var(--topbar-bg);
  color: var(--topbar-text);
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--topbar-text);
  border-radius: 2px;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--topbar-text);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box {
  padding: 8px 12px 8px 35px;
  width: 250px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--topbar-text);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-box:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  width: 300px;
}

.search-box::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.7);
}

.logout-button {
  background: var(--accent-color);
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #c0392b;
}

.logout-icon {
  width: 18px;
  height: 18px;
}

/* Layout */
.container {
  display: flex;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  background: var(--content-bg);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  height: calc(100vh - 60px);
  position: fixed;
  left: 0;
  top: 60px;
  transition: all 0.3s ease;
  z-index: 900;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--sidebar-text);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.nav-menu {
  list-style: none;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-link:hover {
  background: var(--sidebar-hover);
}

.nav-link.router-link-exact-active {
  background: var(--sidebar-active);
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.submenu-icon {
  width: 16px;
  height: 16px;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.has-submenu.active .submenu-icon {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.has-submenu.active .submenu {
  max-height: 500px;
}

.submenu-item {
  position: relative;
}

.submenu-link {
  display: block;
  padding: 10px 20px 10px 52px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.submenu-link:hover {
  background: rgba(0, 0, 0, 0.2);
}

.submenu-link.router-link-exact-active {
  color: var(--sidebar-active);
  font-weight: 500;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.user-avatar svg {
  width: 24px;
  height: 24px;
  color: var(--sidebar-text);
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.8;
}

.sidebar-logout {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--sidebar-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-logout:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-logout svg {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.sidebar-logout span {
  font-size: 0.9rem;
}

/* Main Content */
.content {
  flex-grow: 1;
  padding: 25px;
  margin-left: 250px;
  transition: all 0.3s ease;
}

/* Search Results */
.search-results {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.search-results-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--secondary-color);
}

.results-list {
  list-style: none;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  margin-bottom: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-info {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-weight: 500;
}

.result-type {
  font-size: 0.8rem;
  color: #666;
}

.result-status {
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
}

.status-active {
  background-color: #cce5ff;
  color: #004085;
}

.status-paid {
  background-color: #d4edda;
  color: #155724;
}

/* Responsive Design */
@media (max-width: 992px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.active {
    transform: translateX(0);
  }
  
  .content {
    margin-left: 0;
  }
  
  .hamburger-menu {
    display: flex;
  }
  
  .search-box {
    width: 200px;
  }
  
  .search-box:focus {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .topbar-right {
    gap: 10px;
  }
  
  .search-box {
    width: 150px;
    padding-left: 30px;
  }
  
  .logout-button span {
    display: none;
  }
  
  .logout-button {
    padding: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .search-box {
    display: none;
  }
  
  .search-container {
    width: 0;
  }
}
</style>

<script>
// For mobile sidebar toggle functionality
export default {
  methods: {
    toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('active');
    },
    getItemType(item) {
      if (item.name.includes('Student')) return 'Student';
      if (item.name.includes('Tutor')) return 'Tutor';
      if (item.name.includes('Finance')) return 'Finance Record';
      return 'Item';
    }
  }
}
</script>