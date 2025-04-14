<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand-header">
        <div class="logo-placeholder"></div>
        <h1>Oracle Language Centre</h1>
        <h2>Administrator Login</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="Username" 
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Password" 
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="login-button">Sign In</button>
      </form>

      <p v-if="errorMessage" class="error-message">
        <i class="error-icon">!</i> {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5000/admin/login", {
      name: username.value,
      password: password.value,
    });

    localStorage.setItem("adminToken", response.data.token);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.login-card {
  width: 420px;
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.5s ease;
  margin: 0;
  position: relative;
  z-index: 10;
}

.brand-header {
  margin-bottom: 2.5rem;
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-color: #eef2f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  font-size: 2rem;
  font-weight: bold;
}

.brand-header h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.brand-header h2 {
  color: #7f8c8d;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.login-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.login-button {
  width: 100%;
  padding: 0.9rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
}

.login-button:hover {
  background-color: #2980b9;
}

.error-message {
  margin-top: 1.5rem;
  color: #e74c3c;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .login-card {
    width: calc(100% - 40px);
    padding: 2rem 1.5rem;
    margin: 0 20px;
  }
  
  .brand-header h1 {
    font-size: 1.5rem;
  }
}
</style>