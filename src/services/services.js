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

export const checkBookingAvailability = async (bookingData) => {
  try {
    const response = await api.post("/check-availability", bookingData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userService = async () => {};

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

// src/services/bookingService.js or wherever your API calls are

/**
 * Accept a booking as a provider
 * @param {string} bookingId - The ID of the booking to accept
 * @returns {Promise} - API response
 */
export const acceptBooking = async (bookingId) => {
  try {
    // Validate bookingId
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    console.log(`📝 Accepting booking: ${bookingId}`);

    // Make the API call to accept the booking
    const response = await api.put(`/bookings/${bookingId}/accept`, {
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    });

    // Check if the response was successful
    if (response.data && response.data.success) {
      console.log(`✅ Booking ${bookingId} accepted successfully`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Booking accepted successfully",
      };
    }

    // If the response didn't have success flag but wasn't an error
    if (response.data) {
      return {
        success: true,
        data: response.data,
        message: "Booking accepted successfully",
      };
    }

    throw new Error("Unexpected response format from server");
  } catch (error) {
    console.error("❌ Error accepting booking:", error);

    // Handle different error types
    if (error.response) {
      // Server responded with an error
      const serverMessage =
        error.response.data?.message || error.response.data?.error;

      // Handle specific error cases
      if (error.response.status === 404) {
        throw new Error(
          "Booking not found. It may have been cancelled or doesn't exist.",
        );
      }

      if (error.response.status === 403) {
        throw new Error("You don't have permission to accept this booking.");
      }

      if (error.response.status === 409) {
        throw new Error(
          "This booking has already been accepted by another provider.",
        );
      }

      if (error.response.status === 400) {
        throw new Error(
          serverMessage || "Invalid booking data. Please try again.",
        );
      }

      if (error.response.status === 401) {
        throw new Error("Please log in to accept this booking.");
      }

      throw new Error(
        serverMessage || "Failed to accept booking. Please try again.",
      );
    }

    if (error.request) {
      // Request was made but no response received
      throw new Error(
        "Network error. Please check your connection and try again.",
      );
    }

    // Something else went wrong
    throw new Error(
      error.message || "An unexpected error occurred. Please try again.",
    );
  }
};

/**
 * Alternative: Accept booking with additional data
 * @param {string} bookingId - The ID of the booking to accept
 * @param {Object} additionalData - Any additional data to send (e.g., notes, estimated time)
 */
export const acceptBookingWithData = async (bookingId, additionalData = {}) => {
  try {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    console.log(`📝 Accepting booking ${bookingId} with data:`, additionalData);

    const response = await api.put(`/bookings/${bookingId}/accept`, {
      status: "accepted",
      acceptedAt: new Date().toISOString(),
      ...additionalData, // Merge additional data
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Booking accepted successfully",
      };
    }

    return {
      success: true,
      data: response.data,
      message: "Booking accepted successfully",
    };
  } catch (error) {
    console.error("❌ Error accepting booking with data:", error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to accept booking",
      );
    }
    throw new Error(error.message || "Network error. Please try again.");
  }
};

/**
 * Bulk accept multiple bookings
 * @param {Array<string>} bookingIds - Array of booking IDs to accept
 */
export const acceptMultipleBookings = async (bookingIds) => {
  try {
    if (!bookingIds || bookingIds.length === 0) {
      throw new Error("No booking IDs provided");
    }

    console.log(`📝 Accepting ${bookingIds.length} bookings:`, bookingIds);

    const response = await api.put("/bookings/accept-bulk", {
      bookingIds,
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,
        message:
          response.data.message ||
          `${bookingIds.length} booking(s) accepted successfully`,
        acceptedCount: bookingIds.length,
      };
    }

    throw new Error("Failed to accept multiple bookings");
  } catch (error) {
    console.error("❌ Error accepting multiple bookings:", error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to accept bookings",
      );
    }
    throw new Error(error.message || "Network error. Please try again.");
  }
};

// Export the service with all functions

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

// In your service API file
export const deleteServiceAPI = async (id) => {
  if (!id) {
    throw new Error("Service ID is required");
  }

  const token = localStorage.getItem("authToken");
  // Make sure the URL is correct - just /provider/services/${id}
  const response = await api.delete(`/provider/services/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
/**
 * Delete a gallery image
 * @param {string} imageId - ID of the image to delete
 * @returns {Promise} - Response
 */
export const deleteGalleryImage = async (imageId) => {
  try {
    const response = await api.delete(`/provider/gallery/${imageId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

/*All customers routes start here*/

export const createCustomer = async (data) => {
  try {
    const response = await api.post("/auth/customer-onboarding", data);
    return response.data;
  } catch (error) {
    // Better error handling with specific messages
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || "Server error occurred";
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || "Failed to create account");
    }
  }
};
