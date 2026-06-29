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

// Original function
export const getProviderById = async (id) => {
  // Comment out the real API call and use mock instead
  // const response = await api.get(`/providers/${id}`);
  // return response.data;

  // Use mock data
  return mockApiCall(id);
};
