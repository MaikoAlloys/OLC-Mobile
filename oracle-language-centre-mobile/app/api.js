import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.25:5000", // Base URL for all requests
});

export default api;
