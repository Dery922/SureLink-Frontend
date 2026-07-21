// src/pages/CustomerOnboarding.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../APIs/api";
import { setUser } from "../redux/features/auth/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaClipboardCheck,
  FaSpinner,
  FaHome,
  FaSave,
  FaInfoCircle,
  FaTimes,
  FaLock,
  FaCheck,
  FaUpload,
  FaUserCheck,
} from "react-icons/fa";

// Constants
const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Northern",
  "Volta",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
];

const STEPS = [
  { id: "personal", label: "Personal", icon: FaUser },
  { id: "location", label: "Location", icon: FaMapMarkerAlt },
  { id: "profile", label: "Profile", icon: FaCamera },
  { id: "review", label: "Review", icon: FaClipboardCheck },
];

const STORAGE_KEY = "surelink_customer_draft";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  region: "",
  city: "",
  address: "",
  avatarUrl: "",
  consent: false,
  termsAccepted: false,
};

export default function CustomerOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState("personal");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [direction, setDirection] = useState("forward");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_FORM,
          ...parsed,
          email: user?.email || parsed?.email || "",
        };
      }
      return {
        ...INITIAL_FORM,
        email: user?.email || "",
      };
    } catch {
      return {
        ...INITIAL_FORM,
        email: user?.email || "",
      };
    }
  });

  const avatarInputRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Auto-save draft
  useEffect(() => {
    if (!submitted) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } catch (e) {
          console.warn("Failed to save draft:", e);
        }
      }, 1000);
    }
    return () => clearTimeout(saveTimerRef.current);
  }, [form, submitted]);

  // Progress calculation with safe optional chaining
  const progress = (() => {
    let score = 0;
    if (form.firstName?.trim()) score += 15;
    if (form.lastName?.trim()) score += 15;
    if (form.email?.trim()) score += 10;
    if (form.phone?.trim()) score += 10;
    if (form.region) score += 15;
    if (form.city?.trim()) score += 15;
    if (form.avatarUrl) score += 10;
    if (form.consent && form.termsAccepted) score += 10;
    return Math.min(score, 100);
  })();

  // Checklist status with safe optional chaining
  const checklist = {
    personal: !!(
      form.firstName?.trim() &&
      form.lastName?.trim() &&
      form.email?.trim() &&
      form.phone?.trim()
    ),
    location: !!(form.region && form.city?.trim()),
    profile: !!form.avatarUrl,
    consent: !!(form.consent && form.termsAccepted),
  };

  // Step validation with safe optional chaining
  const validateStep = (step) => {
    const errors = {};
    setFieldErrors({});

    if (step === "personal") {
      if (!form.firstName?.trim()) errors.firstName = "First name is required";
      if (!form.lastName?.trim()) errors.lastName = "Last name is required";
      if (!form.email?.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
      if (!form.phone?.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^[\d\s+\-()]{7,15}$/.test(form.phone.trim())) {
        errors.phone = "Enter a valid phone number";
      }
    }

    if (step === "location") {
      if (!form.region) errors.region = "Please select a region";
      if (!form.city?.trim()) errors.city = "City is required";
    }

    if (step === "review") {
      if (!form.consent) errors.consent = "You must agree to the terms";
      if (!form.termsAccepted)
        errors.termsAccepted = "You must accept the terms";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation
  const goNext = () => {
    setDirection("forward");
    const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIdx < STEPS.length - 1) {
      if (!validateStep(currentStep)) return;
      setCurrentStep(STEPS[currentIdx + 1].id);
    }
  };

  const goBack = () => {
    setDirection("backward");
    const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIdx > 0) {
      setCurrentStep(STEPS[currentIdx - 1].id);
    }
  };

  const goToStep = (stepId) => {
    const targetIdx = STEPS.findIndex((s) => s.id === stepId);
    const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
    if (targetIdx < currentIdx) {
      setDirection("backward");
      setCurrentStep(stepId);
    } else if (targetIdx === currentIdx + 1) {
      goNext();
    }
  };

  // Form field update
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError("");
  };

  // Avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      updateField("avatarUrl", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async () => {
    setDirection("forward");
    if (!validateStep("review")) return;

    setLoading(true);
    setFormError("");

    try {
      const userData = {
        name: {
          full: `${form.firstName} ${form.lastName}`,
          first: form.firstName,
          last: form.lastName,
        },
        email: form.email,
        phone: form.phone,
        location: {
          home_address: {
            street: form.address || "",
            area: `${form.city}, ${form.region}`,
            city: form.city,
            region: form.region,
          },
        },
        avatar: {
          url: form.avatarUrl || "",
        },
      };

      const authToken = localStorage.getItem("authToken");

      const response = await api.patch("/auth/customer-onboarding", userData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data?.success) {
        const updatedUserPayload = response.data.user;

        dispatch(setUser(updatedUserPayload));
        localStorage.setItem("user", JSON.stringify(updatedUserPayload));
        localStorage.removeItem(STORAGE_KEY);

        setSubmitted(true);

        setTimeout(() => {
          navigate("/customer-dashbaord");
        }, 2000);
      } else {
        throw new Error(
          response.data?.message || "Registration validation error.",
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to finalize account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Save draft manually
  const handleSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      setFormError("Failed to save draft");
    }
  };

  // Render field error
  const renderFieldError = (field) => {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <FaInfoCircle className="text-xs" />
        {fieldErrors[field]}
      </p>
    );
  };

  // Render step indicator
  const renderStepIndicators = () => {
    const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

    return (
      <div className="flex items-center w-full gap-2">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isClickable = idx <= currentIdx + 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => isClickable && goToStep(step.id)}
                className={`flex items-center gap-2 ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                } group`}
                disabled={!isClickable}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#0057FF] border-[#0057FF] text-white"
                      : isActive
                        ? "border-[#0057FF] text-[#0057FF] bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                  }`}
                >
                  {isCompleted ? <FaCheck className="text-xs" /> : idx + 1}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium hidden sm:inline ${
                    isCompleted
                      ? "text-[#0057FF]"
                      : isActive
                        ? "text-[#0057FF] font-bold"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                    idx < currentIdx ? "bg-[#0057FF]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ============= RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100/80 fixed top-0 left-0 z-50 h-[72px] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="SureLink"
              className="h-20 w-auto ml-4 object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-600 hover:text-[#0057FF] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/provider-onboarding"
              className="text-sm font-semibold text-[#0057FF] hover:text-blue-700 transition-colors"
            >
              Provider?
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#0057FF] mb-1">
                  Customer Onboarding
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  Create Your Account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Join SureLink and start connecting with trusted service
                  providers
                </p>
              </div>
              {saveSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl text-sm font-medium">
                  <FaCheckCircle />
                  Draft saved
                </div>
              )}
            </div>
            {renderStepIndicators()}
          </div>

          {/* Form Error */}
          {formError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-start gap-3">
              <FaInfoCircle className="mt-0.5 shrink-0" />
              <p className="text-sm">{formError}</p>
            </div>
          )}

          {submitted ? (
            // ===== SUCCESS STATE =====
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-8 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-4xl text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                Welcome to SureLink! 🎉
              </h2>
              <p className="text-gray-500 mb-6">
                Your account has been created successfully. You'll be redirected
                to your dashboard.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[#0057FF]">
                <FaSpinner className="animate-spin" />
                Redirecting...
              </div>
            </div>
          ) : (
            // ===== FORM =====
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6 sm:p-8">
                <form onSubmit={(e) => e.preventDefault()}>
                  {/* ===== STEP 1: PERSONAL ===== */}
                  {currentStep === "personal" && (
                    <div
                      className={
                        direction === "forward"
                          ? "animate-fadeInRight"
                          : "animate-fadeInLeft"
                      }
                    >
                      <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                        <FaUser className="text-[#0057FF]" />
                        Personal Information
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Tell us about yourself to get started
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.firstName}
                              onChange={(e) =>
                                updateField("firstName", e.target.value)
                              }
                              className={`w-full rounded-xl border ${
                                fieldErrors.firstName
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition`}
                              placeholder="Enter first name"
                              disabled={loading}
                            />
                            {renderFieldError("firstName")}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.lastName}
                              onChange={(e) =>
                                updateField("lastName", e.target.value)
                              }
                              className={`w-full rounded-xl border ${
                                fieldErrors.lastName
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition`}
                              placeholder="Enter last name"
                              disabled={loading}
                            />
                            {renderFieldError("lastName")}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) =>
                                updateField("email", e.target.value)
                              }
                              className={`w-full rounded-xl border ${
                                fieldErrors.email
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition`}
                              placeholder="you@example.com"
                              disabled={loading}
                            />
                          </div>
                          {renderFieldError("email")}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) =>
                                updateField("phone", e.target.value)
                              }
                              className={`w-full rounded-xl border ${
                                fieldErrors.phone
                                  ? "border-red-400"
                                  : "border-gray-200"
                              } pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition`}
                              placeholder="+233 XX XXX XXXX"
                              disabled={loading}
                            />
                          </div>
                          {renderFieldError("phone")}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== STEP 2: LOCATION ===== */}
                  {currentStep === "location" && (
                    <div
                      className={
                        direction === "forward"
                          ? "animate-fadeInRight"
                          : "animate-fadeInLeft"
                      }
                    >
                      <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-[#0057FF]" />
                        Location Information
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Help us find service providers near you
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Region <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={form.region}
                            onChange={(e) =>
                              updateField("region", e.target.value)
                            }
                            className={`w-full rounded-xl border ${
                              fieldErrors.region
                                ? "border-red-400"
                                : "border-gray-200"
                            } px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition bg-white`}
                            disabled={loading}
                          >
                            <option value="">Select your region</option>
                            {REGIONS.map((region) => (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            ))}
                          </select>
                          {renderFieldError("region")}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.city}
                            onChange={(e) =>
                              updateField("city", e.target.value)
                            }
                            className={`w-full rounded-xl border ${
                              fieldErrors.city
                                ? "border-red-400"
                                : "border-gray-200"
                            } px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition`}
                            placeholder="e.g. Accra, Kumasi"
                            disabled={loading}
                          />
                          {renderFieldError("city")}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Address{" "}
                            <span className="text-gray-400 font-normal">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            rows={3}
                            value={form.address}
                            onChange={(e) =>
                              updateField("address", e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition resize-y"
                            placeholder="Street address, landmark, or area details..."
                            maxLength={300}
                            disabled={loading}
                          />
                          <div className="mt-1 text-xs text-gray-400 text-right">
                            {form.address.length}/300
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== STEP 3: PROFILE ===== */}
                  {currentStep === "profile" && (
                    <div
                      className={
                        direction === "forward"
                          ? "animate-fadeInRight"
                          : "animate-fadeInLeft"
                      }
                    >
                      <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                        <FaCamera className="text-[#0057FF]" />
                        Profile Picture
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Add a photo so providers can recognize you
                      </p>

                      <div className="flex flex-col items-center gap-6">
                        <div
                          className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-[#0057FF] cursor-pointer overflow-hidden group transition-colors"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          {form.avatarUrl ? (
                            <img
                              src={form.avatarUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                              <FaCamera className="text-3xl text-gray-300 mb-1" />
                              <span className="text-xs text-gray-400">
                                Upload
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FaUpload className="text-white text-xl" />
                          </div>
                          <input
                            type="file"
                            ref={avatarInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={loading}
                          />
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-500">
                            {form.avatarUrl
                              ? "Click to change photo"
                              : "Click to upload photo"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG or GIF • Max 2MB
                          </p>
                        </div>

                        {form.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => updateField("avatarUrl", "")}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                            disabled={loading}
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===== STEP 4: REVIEW ===== */}
                  {currentStep === "review" && (
                    <div
                      className={
                        direction === "forward"
                          ? "animate-fadeInRight"
                          : "animate-fadeInLeft"
                      }
                    >
                      <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                        <FaClipboardCheck className="text-[#0057FF]" />
                        Review & Confirm
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Please review your information before creating your
                        account
                      </p>

                      <div className="space-y-4">
                        {/* Review Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            ["First Name", form.firstName || "—"],
                            ["Last Name", form.lastName || "—"],
                            ["Email", form.email || "—"],
                            ["Phone", form.phone || "—"],
                            ["Region", form.region || "—"],
                            ["City", form.city || "—"],
                            ["Address", form.address || "—"],
                            [
                              "Profile Photo",
                              form.avatarUrl
                                ? "✅ Uploaded"
                                : "❌ Not uploaded",
                            ],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="bg-gray-50 rounded-xl p-3"
                            >
                              <p className="text-xs text-gray-400 font-medium">
                                {label}
                              </p>
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Consent */}
                        <div className="space-y-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.consent}
                              onChange={(e) =>
                                updateField("consent", e.target.checked)
                              }
                              className="mt-0.5 w-4 h-4 text-[#0057FF] rounded border-gray-300 focus:ring-[#0057FF]"
                              disabled={loading}
                            />
                            <span className="text-sm text-gray-700">
                              I agree to the{" "}
                              <Link
                                to="/terms"
                                className="text-[#0057FF] hover:underline"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/privacy"
                                className="text-[#0057FF] hover:underline"
                              >
                                Privacy Policy
                              </Link>
                            </span>
                          </label>
                          {renderFieldError("consent")}

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.termsAccepted}
                              onChange={(e) =>
                                updateField("termsAccepted", e.target.checked)
                              }
                              className="mt-0.5 w-4 h-4 text-[#0057FF] rounded border-gray-300 focus:ring-[#0057FF]"
                              disabled={loading}
                            />
                            <span className="text-sm text-gray-700">
                              I confirm that all information provided is
                              accurate and complete
                            </span>
                          </label>
                          {renderFieldError("termsAccepted")}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== ACTION BUTTONS ===== */}
                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
                    {currentStep !== "personal" && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition"
                        disabled={loading}
                      >
                        <FaArrowLeft className="text-xs" />
                        Back
                      </button>
                    )}
                    {currentStep !== "review" ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0057FF] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-lg shadow-[#0057FF]/25 flex-1 justify-center"
                        disabled={loading}
                      >
                        Continue
                        <FaArrowRight className="text-xs" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                          loading || !form.consent || !form.termsAccepted
                        }
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold text-sm rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            <FaUserCheck />
                            Create Account
                          </>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition"
                      disabled={loading}
                    >
                      <FaSave className="text-xs" />
                      Draft
                    </button>
                    <Link
                      to="/"
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition"
                    >
                      <FaHome className="text-xs" />
                      Home
                    </Link>
                  </div>
                </form>
              </div>

              {/* ===== SIDEBAR ===== */}
              <aside className="space-y-6">
                {/* Progress */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6">
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Progress</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-20 h-20">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="6"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#0057FF"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 42}
                          strokeDashoffset={
                            2 * Math.PI * 42 * (1 - progress / 100)
                          }
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-[#1A1A1A]">
                          {progress}%
                        </span>
                        <span className="text-[10px] text-gray-400">
                          complete
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {progress === 100 ? "All set!" : "Complete all steps"}
                      </p>
                      <div className="mt-1 space-y-1">
                        {[
                          { key: "personal", label: "Personal details" },
                          { key: "location", label: "Location" },
                          { key: "profile", label: "Profile photo" },
                          { key: "consent", label: "Terms accepted" },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                checklist[key]
                                  ? "bg-[#0057FF] border-[#0057FF]"
                                  : "border-gray-300"
                              }`}
                            >
                              {checklist[key] && (
                                <FaCheck className="text-[10px] text-white" />
                              )}
                            </div>
                            <span
                              className={
                                checklist[key]
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-[#0057FF] text-lg mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">
                        Why join SureLink?
                      </h4>
                      <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-[#0057FF] text-xs" />
                          Access verified service providers
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-[#0057FF] text-xs" />
                          Get quotes from multiple professionals
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-[#0057FF] text-xs" />
                          Secure payments and ratings
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-4">
                  <div className="flex items-start gap-3 text-sm">
                    <FaLock className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">
                        Your data is secure
                      </p>
                      <p className="text-gray-400 text-xs">
                        We protect your information with industry-standard
                        encryption
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.3s ease-out;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
