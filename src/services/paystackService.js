import api from "../APIs/api";

// Initialize Paystack transaction
export const initializePaystackPayment = async (bookingData) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await api.post("/paystack/initialize", bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    throw error;
  }
};

// Verify Paystack payment
export const verifyPaystackPayment = async (reference) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await api.get(`/paystack/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying Paystack payment:", error);
    throw error;
  }
};

// Get transaction status
export const getTransactionStatus = async (reference) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await api.get(`/paystack/status/${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting transaction status:", error);
    throw error;
  }
};
