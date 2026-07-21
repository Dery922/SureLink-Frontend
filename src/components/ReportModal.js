// src/components/ReportModal.js - Fixed with all imports at top

import { useState } from "react";
import {
  FaFlag,
  FaTimes,
  FaExclamationTriangle,
  FaUser,
  FaComment,
  FaMoneyBillWave,
  FaSpinner,
  FaCheckCircle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useCustomMessage } from "./CustomMessage";

const ReportModal = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  bookingId,
  onReportSubmitted,
}) => {
  const { success, error } = useCustomMessage();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState({
    bookingId: bookingId || "",
    date: "",
    time: "",
    severity: "medium",
  });

  const reportCategories = {
    "user-behavior": {
      icon: FaUser,
      label: "Inappropriate Behavior",
      description: "Harassment, offensive language, or unprofessional conduct",
    },
    "service-quality": {
      icon: FaExclamationTriangle,
      label: "Poor Service Quality",
      description: "Service not delivered as promised, incomplete work",
    },
    "payment-issue": {
      icon: FaMoneyBillWave,
      label: "Payment Dispute",
      description: "Overcharging, unauthorized charges, refund issues",
    },
    communication: {
      icon: FaComment,
      label: "Communication Issue",
      description: "No response, unprofessional communication, no-show",
    },
    fraud: {
      icon: FaExclamationTriangle,
      label: "Fraud or Scam",
      description: "Fake profile, identity theft, scam attempts",
    },
    other: {
      icon: FaFlag,
      label: "Other Issue",
      description: "Something not covered in other categories",
    },
  };

  const severityLevels = [
    { value: "low", label: "Low - Minor issue" },
    { value: "medium", label: "Medium - Significant concern" },
    { value: "high", label: "High - Urgent attention needed" },
    { value: "critical", label: "Critical - Immediate action required" },
  ];

  // Submit report to API
  const submitReport = async (formData) => {
    try {
      // Replace this with your actual API call
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      return await response.json();
    } catch (error) {
      console.error("Submit report error:", error);
      throw error;
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setEvidence((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setEvidence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      error("Please select a report category");
      return;
    }
    if (!description || description.length < 20) {
      error("Please provide a detailed description (minimum 20 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("targetId", targetId);
      formData.append("targetType", targetType);
      formData.append("category", selectedCategory);
      formData.append("description", description);
      formData.append("severity", additionalDetails.severity);
      formData.append("bookingId", additionalDetails.bookingId);
      formData.append("reportedDate", additionalDetails.date);
      formData.append("reportedTime", additionalDetails.time);

      evidence.forEach((file) => {
        formData.append("evidence", file);
      });

      const response = await submitReport(formData);

      if (response.success) {
        success(
          "Report submitted successfully! Our team will review it within 24 hours.",
        );
        onReportSubmitted && onReportSubmitted(response.data);
        resetForm();
        onClose();
      } else {
        error(response.message || "Failed to submit report. Please try again.");
      }
    } catch (err) {
      console.error("Report submission error:", err);
      error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setDescription("");
    setEvidence([]);
    setAdditionalDetails({
      bookingId: bookingId || "",
      date: "",
      time: "",
      severity: "medium",
    });
  };

  if (!isOpen) return null;

  const SelectedIcon = selectedCategory
    ? reportCategories[selectedCategory]?.icon
    : FaFlag;

  // Helper function to get icon and color for severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return { icon: FaTimesCircle, color: "text-red-600" };
      case "high":
        return { icon: FaExclamationTriangle, color: "text-orange-600" };
      case "medium":
        return { icon: FaInfoCircle, color: "text-yellow-600" };
      case "low":
        return { icon: FaCheckCircle, color: "text-green-600" };
      default:
        return { icon: FaInfoCircle, color: "text-blue-600" };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <FaFlag className="text-red-500 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                Report a Problem
              </h2>
              <p className="text-sm text-gray-500">
                Help us keep the community safe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit}>
            {/* Target Info - Preview */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Reporting:</strong>{" "}
                {targetType === "provider"
                  ? "Provider"
                  : targetType === "customer"
                    ? "Customer"
                    : "Platform Issue"}
                {targetId && ` #${targetId}`}
                {bookingId && ` • Booking #${bookingId}`}
              </p>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1A1A1A] mb-3">
                What's the issue? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(reportCategories).map(([key, category]) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(key)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`text-xl ${isSelected ? "text-red-500" : "text-gray-400"}`}
                        />
                        <div>
                          <p
                            className={`font-medium ${isSelected ? "text-red-700" : "text-gray-700"}`}
                          >
                            {category.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Describe what happened <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide as much detail as possible..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0057FF] resize-none"
                minLength="20"
                required
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">
                  Minimum 20 characters
                </span>
                <span
                  className={`text-xs ${description.length >= 20 ? "text-green-500" : "text-gray-400"}`}
                >
                  {description.length}/500
                </span>
              </div>
            </div>

            {/* Severity */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Severity Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {severityLevels.map((level) => {
                  const { icon: Icon, color } = getSeverityIcon(level.value);
                  const isSelected = additionalDetails.severity === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() =>
                        setAdditionalDetails({
                          ...additionalDetails,
                          severity: level.value,
                        })
                      }
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? level.value === "critical"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : level.value === "high"
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : level.value === "medium"
                                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                : "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <Icon
                        className={`text-sm ${isSelected ? color : "text-gray-400"}`}
                      />
                      {level.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evidence Upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Upload Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0057FF] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FaFlag className="text-gray-400 text-3xl" />
                    <p className="text-sm text-gray-500">
                      <span className="text-[#0057FF] font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      Images, PDFs, or documents (max 10MB each)
                    </p>
                  </div>
                </label>
              </div>

              {/* File List */}
              {evidence.length > 0 && (
                <div className="mt-3 space-y-2">
                  {evidence.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Incident
                </label>
                <input
                  type="date"
                  value={additionalDetails.date}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Incident
                </label>
                <input
                  type="time"
                  value={additionalDetails.time}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      time: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaFlag />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
