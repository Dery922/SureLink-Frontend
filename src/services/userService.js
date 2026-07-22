import api from "../APIs/api";

// Update user profile
export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

// Switch user role (customer <-> provider)
export const switchUserRole = async () => {
  try {
    const response = await api.post("/users/switch-role");
    return response.data;
  } catch (error) {
    console.error("Switch role error:", error);
    throw error;
  }
};

// Get notification settings
export const getNotificationSettings = async () => {
  try {
    const response = await api.get("/users/notification-settings");
    return response.data;
  } catch (error) {
    console.error("Get notification settings error:", error);
    throw error;
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await api.put("/users/notification-settings", settings);
    return response.data;
  } catch (error) {
    console.error("Update notification settings error:", error);
    throw error;
  }
};

// Delete account permanently
export const deleteAccount = async () => {
  try {
    const response = await api.delete("/users/account");
    return response.data;
  } catch (error) {
    console.error("Delete account error:", error);
    throw error;
  }
};

// Deactivate account temporarily
export const deactivateAccount = async () => {
  try {
    const response = await api.post("/users/deactivate");
    return response.data;
  } catch (error) {
    console.error("Deactivate account error:", error);
    throw error;
  }
};

// Reactivate account
export const reactivateAccount = async () => {
  try {
    const response = await api.post("/users/reactivate");
    return response.data;
  } catch (error) {
    console.error("Reactivate account error:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};

// Update language preference
export const updateLanguage = async (language) => {
  try {
    const response = await api.put("/users/language", { language });
    return response.data;
  } catch (error) {
    console.error("Update language error:", error);
    throw error;
  }
};
