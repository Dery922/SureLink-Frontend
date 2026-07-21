import api from "../APIs/api";

export const submitReport = async (formData) => {
  try {
    const response = await api.post("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Submit report error:", error);
    throw error;
  }
};

export const getReports = async (filters) => {
  try {
    const response = await api.get("/reports", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Get reports error:", error);
    throw error;
  }
};

export const getReportDetails = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error("Get report details error:", error);
    throw error;
  }
};

export const updateReportStatus = async (reportId, status, adminNote) => {
  try {
    const response = await api.put(`/reports/${reportId}`, {
      status,
      adminNote,
    });
    return response.data;
  } catch (error) {
    console.error("Update report status error:", error);
    throw error;
  }
};
