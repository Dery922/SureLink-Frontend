// src/APIs/providerAPI.js
import api from "../APIs/api";
import { mockApiCall } from "../mockData";

/**
 * Fetch all registered providers with optional sorting/filtering queries
 * @param {Object} params - Query parameters like category, city, or status
 */
export const getAllProviders = async (params = {}) => {
  try {
    const response = await api.get("/get/all/providers", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching providers list:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

/**
 * Fetch a single provider by ID
 * @param {string} id - Provider ID
 */
// export const getProviderById = async (id) => {
//   try {
//     const response = await api.get(`/get/provider/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error fetching provider:",
//       error.response?.data || error.message,
//     );
//     throw error.response?.data || error;
//   }
// };

// src/services/services.js

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching current user:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};
export const updateUserProfile = async () => {};
export const updateCurrentUser = async () => {};
// src/services/services.js

// CORRECTED: Save provider services
export const saveProviderServices = async (servicesData) => {
  try {
    const response = await api.post("/save/services", servicesData);
    return response.data;
  } catch (error) {
    console.error(
      "Error saving provider services:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// Original function
export const getProviderById = async (id) => {
  // Comment out the real API call and use mock instead
  // const response = await api.get(`/providers/${id}`);
  // return response.data;

  // Use mock data
  return mockApiCall(id);
};
