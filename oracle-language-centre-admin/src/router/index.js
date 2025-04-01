import { createRouter, createWebHistory } from "vue-router";
import AdminLogin from "../views/AdminLogin.vue";
import Dashboard from "../views/Dashboard.vue";
import Students from "../views/Students.vue";
import Tutors from "../views/Tutors.vue";
import Finance from "../views/Finance.vue";
import Suppliers from "../views/Suppliers.vue";
import SupplierManagement from "../views/SupplierManagement.vue";
import FeeManagement from "../views/FeeManagement.vue";
import Courses from "../views/Courses.vue";
import LibraryManagement from "../views/LibraryManagement.vue";
import HeadOfManagement from "../views/HeadOfManagement.vue";
import Storekeeper from "../views/Storekeeper.vue";
import Attendance from "../views/Attendance.vue";


const routes = [
  { path: "/admin-login", component: AdminLogin },
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } }, // ✅ Added this
  { path: "/students", component: Students, meta: { requiresAuth: true } },
  { path: "/tutors", component: Tutors, meta: { requiresAuth: true } },
  { path: "/finance", component: Finance, meta: { requiresAuth: true } },
  { path: "/suppliers", component: Suppliers, meta: { requiresAuth: true } },
  { path: "/supplier-management", component: SupplierManagement, meta: { requiresAuth: true } },
  { path: "/fee-management", component: FeeManagement, meta: { requiresAuth: true } },
  { path: "/courses", component: Courses, meta: { requiresAuth: true } },
  { path: "/library-management", component: LibraryManagement, meta: { requiresAuth: true } },
  { path: "/head-management", component: HeadOfManagement, meta: { requiresAuth: true } },
  { path: "/storekeeper", component: Storekeeper, meta: { requiresAuth: true } },
  { path: "/attendance", component: Attendance, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to Protect Routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("adminToken");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/admin-login");
  } else {
    next();
  }
});

export default router;
