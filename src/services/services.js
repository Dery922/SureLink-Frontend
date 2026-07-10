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

export const uploadGalleryImages = async (formData) => {
  try {
    // Log the formData for debugging
    console.log("Uploading FormData:");
    for (let pair of formData.entries()) {
      console.log("  ", pair[0], pair[1].name || pair[1]);
    }

    const response = await api.post("/provider/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Add timeout for large uploads
      timeout: 30000, // 30 seconds
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error uploading images:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
/**
 *
 *
 * Fetch a single provider by ID
 * @param {string} id - Provider ID
 */
export const getProviderById = async (id) => {
  try {
    const response = await api.get(`/get/provider/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching provider:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
};

// src/services/booking.js or src/services/services.js

// Create a new booking
// src/services/services.js
// src/services/services.js

export const createBooking = async (bookingData) => {
  try {
    console.log("📤 API Request: POST /bookings", bookingData);
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("❌ API Error Captured:", error.message);

    // 🟢 FIX: Create a real Error instance so the Promise chain rejects cleanly
    const customError = new Error(
      error.response?.data?.message || error.message,
    );

    // Attach your custom status codes to the error object safely
    customError.status = error.response?.status || error.status;
    customError.response = error.response;

    throw customError; // 🚀 This will now jump directly into your frontend's catch block!
  }
};

// Get user's bookings
export const getUserBookings = async () => {
  try {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error.response?.data || error;
  }
};

// Get a specific booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error.response?.data || error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error.response?.data || error;
  }
};

// Update booking status (provider only)
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error.response?.data || error;
  }
};

//src/services/services.js

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

export const getGalleryImages = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/gallery?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGalleryImagesByUserId = async (
  userId,
  page = 1,
  limit = 20,
) => {
  try {
    const response = await api.get(
      `/gallery/user/${userId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteGalleryImage = () => {};
export const updateGalleryImage = () => {};

// In your ManageProfile component, add this function

// Update your useEffect to fetch both gallery and services

// services/services.js

// Add this function to fetch services
// src/services/services.js
export const getProviderServices = async (id) => {
  try {
    const response = await api.get(`/provider/services/${id}`);
    console.log("Raw API response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching services:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const saveGallery = async (formData) => {
  try {
    const response = await api.post("/provider/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        return percentCompleted; // This will be used in the component
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading gallery:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
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
// export const getProviderById = async (id) => {
//   // Comment out the real API call and use mock instead
//   // const response = await api.get(`/providers/${id}`);
//   // return response.data;

//   // Use mock data
//   return mockApiCall(id);
// };

/**
 * Fetch gallery images with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} - Response with gallery images
 */
// export const getGalleryImages = async (page = 1, limit = 20) => {
//   try {
//     const response = await api.get(`/gallery?page=${page}&limit=${limit}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

/**
 * Upload multiple gallery images
 * @param {FormData} formData - Form data containing images
 * @returns {Promise} - Response with uploaded images
 */
// export const uploadGalleryImages = async (formData) => {
//   try {
//     const response = await api.post("/gallery/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: (progressEvent) => {
//         // This will be handled in the component
//         const percentCompleted = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         // You can dispatch this to update progress
//         return percentCompleted;
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

/**
 * Delete a gallery image
 * @param {string} imageId - ID of the image to delete
 * @returns {Promise} - Response
 */
// export const deleteGalleryImage = async (imageId) => {
//   try {
//     const response = await api.delete(`/gallery/${imageId}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

/**
 * Update gallery image details (title, description, etc.)
 * @param {string} imageId - ID of the image to update
 * @param {Object} updateData - Data to update
 * @returns {Promise} - Response
 */
// export const updateGalleryImage = async (imageId, updateData) => {
//   try {
//     const response = await api.patch(`/gallery/${imageId}`, updateData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

/**
 * Reorder gallery images
 * @param {Array} imageIds - Array of image IDs in new order
 * @returns {Promise} - Response
 */
export const reorderGalleryImages = async (imageIds) => {
  try {
    const response = await api.patch("/gallery/reorder", { imageIds });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Set a gallery image as featured
 * @param {string} imageId - ID of the image to set as featured
 * @returns {Promise} - Response
 */
export const setFeaturedImage = async (imageId) => {
  try {
    const response = await api.patch(`/gallery/${imageId}/featured`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
