import axios from "axios";

// Switch this to false when working on your computer, true when pushing to Render
const IS_PRODUCTION = false;

const PRODUCTION_URL = "https://surelink-backend.onrender.com";
const LOCAL_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: IS_PRODUCTION ? `${PRODUCTION_URL}/api` : LOCAL_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
