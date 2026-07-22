// src/services/providerStatsService.js

import api from "../APIs/api";

// ==========================================
// GET PROVIDER STATISTICS
// GET /api/providers/:providerId/stats
// ==========================================
export const getProviderStats = async (providerId) => {
  try {
    const response = await api.get(`/${providerId}/stats`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching provider stats:", error);
    throw error;
  }
};

// ==========================================
// GET PROVIDER SIMPLE STATS (for quick display)
// GET /api/providers/:providerId/simple-stats
// ==========================================
export const getProviderSimpleStats = async (providerId) => {
  try {
    const response = await api.get(`/${providerId}/simple-stats`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching simple stats:", error);
    throw error;
  }
};

// ==========================================
// GET RATING DISTRIBUTION
// GET /api/providers/:providerId/ratings
// ==========================================
export const getRatingDistribution = async (providerId) => {
  try {
    const response = await api.get(`/${providerId}/ratings`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching rating distribution:", error);
    throw error;
  }
};

// ==========================================
// GET PERFORMANCE METRICS
// GET /api/providers/:providerId/performance
// ==========================================
export const getPerformanceMetrics = async (providerId, period = 30) => {
  try {
    const response = await api.get(
      `/${providerId}/performance?period=${period}`,
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching performance metrics:", error);
    throw error;
  }
};

// ==========================================
// GET PROVIDER DASHBOARD (for logged-in provider)
// GET /api/providers/me/dashboard
// ==========================================
export const getProviderDashboard = async () => {
  try {
    const response = await api.get("/me/dashboard");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    throw error;
  }
};
