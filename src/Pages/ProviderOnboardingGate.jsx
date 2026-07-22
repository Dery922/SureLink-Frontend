import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../APIs/api";
import { Link } from "react-router-dom";
import { loginSuccess } from "../redux/features/auth/authSlice";
import {
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCamera,
  FaShieldAlt,
  FaClipboardCheck,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaHome,
  FaInfoCircle,
  FaCheck,
  FaSpinner,
  FaUpload,
  FaTimes,
  FaImage,
  FaClock,
  FaBell,
  FaPencilAlt,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

// ===================== CONSTANTS =====================
const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Tutoring",
  "Catering",
  "Beauty",
  "Delivery",
  "Painting",
  "Landscaping",
  "Photography",
  "Repair",
];

const ID_TYPES = ["National ID", "Driver's license", "Passport", "Voter ID"];

const STEPS = ["profile", "verification", "review"];

const STEP_LABELS = {
  profile: "Profile",
  verification: "Verification",
  review: "Review",
};

const STORAGE_KEY = "surelink_provider_draft";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  category: "",
  secondaryCategory: "",
  area: "",
  radius: "5",
  bio: "",
  basePrice: "",
  openForWork: true,
  idType: "",
  idNumber: "",
  docName: "",
  docSize: "",
  consent: false,
  avatarUrl: "",
  selfieUrl: "",
  businessName: "",
  coverPicture: "",
};

// ===================== TOAST COMPONENT =====================
let toastId = 0;

function Toast({ id, title, message, type, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const colorMap = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  const iconMap = {
    success: FaCheckCircle,
    error: FaInfoCircle,
    info: FaInfoCircle,
  };

  const IconComponent = iconMap[type];

  return (
    <div
      className={`pointer-events-auto rounded-xl border ${colorMap[type]} p-3.5 shadow-lg flex items-start gap-3 ${exiting ? "toast-exit" : "toast-enter"}`}
    >
      <IconComponent className="shrink-0 mt-0.5 text-lg" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs opacity-80 mt-0.5">{message}</p>
      </div>
      <button
        className="shrink-0 opacity-60 hover:opacity-100 transition"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(id), 300);
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
export default function ProviderOnboarding() {
  // State
  const [currentStep, setCurrentStep] = useState("profile");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [offline, setOffline] = useState(!navigator.onLine);
  const [direction, setDirection] = useState("forward");
  const [toasts, setToasts] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSaveBadge, setShowSaveBadge] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...INITIAL_FORM, ...JSON.parse(saved) }
        : { ...INITIAL_FORM };
    } catch {
      return { ...INITIAL_FORM };
    }
  });

  // Refs
  const avatarInputRef = useRef(null);
  const docInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const coverInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // ===================== EFFECTS =====================
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: prev.email || user.email,
        phone: prev.phone || user.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    const onOffline = () => {
      setOffline(true);
      addToast("You're offline", "Check your internet connection.", "error");
    };
    const onOnline = () => {
      setOffline(false);
      addToast("Back online", "Your connection has been restored.", "success");
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  // ===================== TOASTS =====================
  const addToast = useCallback((title, message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ===================== FORM UPDATES =====================
  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError("");
  }, []);

  const debouncedAutoSave = useCallback(() => {
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setShowSaveBadge(true);
        setTimeout(() => setShowSaveBadge(false), 3000);
      } catch {
        /* ignore */
      }
    }, 1000);
  }, [form]);

  useEffect(() => {
    if (!submitted) debouncedAutoSave();
  }, [form, submitted, debouncedAutoSave]);

  // ===================== PROGRESS =====================
  const progress = useMemo(() => {
    let score = 0;
    if (form.category) score += 20;
    if (form.area.trim()) score += 15;
    if (form.businessName.trim()) score += 10;
    if (form.bio.trim().length >= 40) score += 10;
    if (form.idType && form.idNumber.trim().length >= 6) score += 20;
    if (form.docName) score += 5;
    if (form.avatarUrl) score += 5;
    if (form.selfieUrl) score += 5;
    if (form.coverPicture) score += 5;
    if (form.basePrice) score += 5;
    return Math.min(score, 100);
  }, [form]);

  // ===================== CHECKLIST =====================
  const checklist = useMemo(
    () => ({
      category: !!form.category,
      area: !!form.area.trim(),
      bio: form.bio.trim().length >= 40,
      verification: !!(form.idType && form.idNumber.trim().length >= 6),
      photo: !!form.avatarUrl,
      selfie: !!form.selfieUrl,
    }),
    [form],
  );

  // ===================== VALIDATION =====================
  const validateProfile = useCallback(() => {
    const errs = {};
    if (!form.firstName?.trim()) errs.firstName = "First name is required.";
    if (!form.lastName?.trim()) errs.lastName = "Last name is required.";
    if (!form.category)
      errs.category = "Please select a primary service category.";
    if (!form.area?.trim()) errs.area = "Service operational area is required.";
    if (!form.businessName.trim())
      errs.businessName = "Please business name is required.";
    if (!form.bio || form.bio.trim().length < 40) {
      errs.bio = "Bio must be at least 40 characters long.";
    }
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  }, [form]);

  const validateVerification = useCallback(() => {
    const errs = {};
    if (!form.idType) errs.idType = "Select an ID type.";
    if (form.idNumber.trim().length < 6)
      errs.idNumber = "Enter a valid ID number (minimum 6 characters).";
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  }, [form]);

  const validateReview = useCallback(() => {
    const errs = {};
    if (!form.idType) errs.idType = "Identification document type is required.";
    if (!form.idNumber?.trim()) errs.idNumber = "ID card number is required.";
    if (!form.consent)
      errs.consent = "You must confirm this information is accurate.";
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  }, [form]);

  // ===================== STEP NAVIGATION =====================
  const goNext = useCallback(async () => {
    setDirection("forward");
    if (currentStep === "profile" && !validateProfile()) return;
    if (currentStep === "verification" && !validateVerification()) return;

    try {
      setLoading(true);
      setFormError("");

      await api.post(
        "/auth/provider-profile/draft",
        {
          profileDetails: form,
          currentStep: currentStep,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));

      const idx = STEPS.indexOf(currentStep);
      if (idx < STEPS.length - 1) {
        setCurrentStep(STEPS[idx + 1]);
      }
    } catch (error) {
      console.error("Failed to sync step draft with server:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to save progress. Please try again.",
      );
      addToast(
        "Sync failed",
        "Your progress couldn't be synchronized with the server.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [currentStep, validateProfile, validateVerification, form, addToast]);

  const goBack = useCallback(() => {
    setDirection("backward");
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  }, [currentStep]);

  const goToStep = useCallback(
    (step) => {
      const targetIdx = STEPS.indexOf(step);
      const currentIdx = STEPS.indexOf(currentStep);
      if (targetIdx < currentIdx) {
        setDirection("backward");
        setCurrentStep(step);
      } else if (targetIdx === currentIdx + 1) {
        goNext();
      }
    },
    [currentStep, goNext],
  );

  // ===================== SUBMISSION =====================
  const handleSubmit = useCallback(async () => {
    if (offline) {
      setFormError("No internet connection. Check your network and retry.");
      addToast("No connection", "Check your network and retry.", "error");
      return;
    }
    setFieldErrors({});
    if (!validateReview()) return;

    setLoading(true);
    setFormError("");
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");

      if (!token) {
        addToast(
          "Unauthorized",
          "Session expired. Please log in again.",
          "error",
        );
        setLoading(false);
        return;
      }

      const { data } = await api.post(
        "/auth/provider-profile",
        {
          profileDetails: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("profile_draft_key");
        dispatch(loginSuccess(data.data.user));
        setSubmitted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        addToast(
          "Profile submitted!",
          "Your details are under review successfully.",
          "success",
        );
      }
    } catch (error) {
      console.error("Final onboarding registration submission failure:", error);
      const fallbackMsg =
        error.response?.data?.message || "Server communication error.";
      setFormError(fallbackMsg);
      addToast("Submission failed", fallbackMsg, "error");
    } finally {
      setLoading(false);
    }
  }, [offline, validateReview, form, addToast]);

  const handleEditProfile = useCallback(() => {
    setSubmitted(false);
    setShowConfetti(false);
  }, []);

  // ===================== SAVE DRAFT =====================
  const handleSaveDraft = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        addToast(
          "Unauthorized",
          "Session expired. Please log in again.",
          "error",
        );
        return;
      }

      const { data } = await api.post(
        "/auth/provider-profile/draft",
        {
          profileDetails: form,
          currentStep: currentStep,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        addToast(
          "Draft saved",
          "Your progress has been synced to the database.",
          "success",
        );
        setShowSaveBadge(true);
        setTimeout(() => setShowSaveBadge(false), 3000);
      } else {
        addToast(
          "Save failed",
          data.message || "Could not save draft.",
          "error",
        );
      }
    } catch (error) {
      console.error("Database sync failed:", error);
      addToast(
        "Save failed",
        error.response?.data?.message || "Server communication error.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [form, currentStep, addToast]);

  // ===================== FILE HANDLERS =====================
  const handleAvatarChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        addToast("Invalid file", "Please upload an image file.", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        addToast("File too large", "Maximum image size is 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => updateField("avatarUrl", ev.target.result);
      reader.readAsDataURL(file);
    },
    [addToast, updateField],
  );

  const handleSelfieChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        addToast("Invalid file", "Please upload an image file.", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        addToast("File too large", "Maximum image size is 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => updateField("selfieUrl", ev.target.result);
      reader.readAsDataURL(file);
    },
    [addToast, updateField],
  );

  const handleDocUpload = useCallback(
    (file) => {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        addToast(
          "Invalid file type",
          "Please upload PNG, JPG, or PDF files.",
          "error",
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast("File too large", "Maximum file size is 5MB.", "error");
        return;
      }
      updateField("docName", file.name);
      updateField("docSize", formatFileSize(file.size));
      addToast("File uploaded", file.name, "success");
    },
    [addToast, updateField],
  );

  const handleDocInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleDocUpload(file);
    },
    [handleDocUpload],
  );

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, coverPicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDoc = useCallback(() => {
    updateField("docName", "");
    updateField("docSize", "");
    if (docInputRef.current) docInputRef.current.value = "";
    addToast("File removed", "Document removed from upload.", "info");
  }, [updateField, addToast]);

  // ===================== DRAG & DROP =====================
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleDocUpload(file);
    },
    [handleDocUpload],
  );

  // ===================== HELPERS =====================
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const maskId = (id) => {
    if (!id || id.length < 6) return id ? id.replace(/(.{3}).*/, "$1***") : "—";
    return id.replace(/(.{3}).*(.{3})/, "$1***$2");
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition disabled:opacity-50";
  const inputIconClass =
    "w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition disabled:opacity-50";
  const priceClass =
    "w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] transition disabled:opacity-50";

  const renderFieldError = (field) => {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <FaInfoCircle className="text-xs" />
        <span>{fieldErrors[field]}</span>
      </p>
    );
  };

  // ===================== STEP INDICATORS =====================
  const activeIdx = STEPS.indexOf(currentStep);

  const renderStepIndicators = () => (
    <div className="flex items-center w-full gap-2 mt-6">
      {STEPS.map((step, i) => {
        const isCompleted = i < activeIdx;
        const isActive = i === activeIdx;

        return (
          <div key={step} className="flex items-center flex-1">
            <button
              className="flex items-center gap-2 cursor-pointer select-none group"
              onClick={() => goToStep(step)}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  isCompleted
                    ? "bg-[#0057FF] border-[#0057FF] text-white"
                    : isActive
                      ? "border-[#0057FF] text-[#0057FF] bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {isCompleted ? <FaCheck className="text-xs" /> : i + 1}
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
                {STEP_LABELS[step]}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                  i < activeIdx ? "bg-[#0057FF]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // ===================== RING PROGRESS =====================
  const circumference = 2 * Math.PI * 42;
  const ringOffset = circumference - (circumference * progress) / 100;
  const ringColor =
    progress >= 80 ? "#10B981" : progress >= 50 ? "#F59E0B" : "#0057FF";

  // ===================== REVIEW DATA =====================
  const reviewItems = [
    ["Primary category", form.category || "—"],
    ["Secondary category", form.secondaryCategory || "—"],
    ["Service area", form.area || "—"],
    ["Radius", `${form.radius} km`],
    ["Starting price", form.basePrice ? `GHS ${form.basePrice}` : "Not set"],
    [
      "Availability",
      form.openForWork ? "Open for work" : "Currently unavailable",
    ],
    ["ID type", form.idType || "—"],
    ["ID number", form.idNumber ? maskId(form.idNumber) : "—"],
  ];

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] font-sans">
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(100%) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes toastOut { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(100%) scale(0.95); } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(0.9); opacity: 1; } }
        @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .step-enter-right { animation: slideInRight 0.35s ease-out forwards; }
        .step-enter-left { animation: slideInLeft 0.35s ease-out forwards; }
        .step-enter { animation: fadeSlideIn 0.4s ease-out forwards; }
        .toast-enter { animation: toastIn 0.35s ease-out forwards; }
        .toast-exit { animation: toastOut 0.25s ease-in forwards; }
        .field-error-shake { animation: shake 0.35s ease-in-out; }
        .confetti-piece { position: fixed; top: -10px; animation: confetti-fall linear forwards; pointer-events: none; z-index: 9999; }
        .ring-progress { transition: stroke-dashoffset 0.6s ease-out; }
        .save-pulse { animation: pulse-ring 1.5s ease-in-out; }
        .avatar-wrap:hover .avatar-overlay { opacity: 1; }
        .avatar-overlay { opacity: 0; transition: opacity 0.2s ease; }
        .drop-zone.drag-over { border-color: #0057FF !important; background: #EFF6FF !important; }
        .drop-zone.drag-over .drop-icon { transform: scale(1.15); }
        .drop-icon { transition: transform 0.2s ease; }
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(0, 87, 255, 0.12); }
        .tooltip-trigger:hover .tooltip-content { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .tooltip-content { opacity: 0; pointer-events: none; transform: translateY(4px); transition: all 0.15s ease; }
        .step-connector { transition: background-color 0.4s ease; }
      `}</style>

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
              to="/customer-onboarding"
              className="text-sm font-semibold text-[#0057FF] hover:text-blue-700 transition-colors"
            >
              Customer?
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-600 hover:text-[#0057FF] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Toasts */}
      <div
        className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 380 }}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            title={t.title}
            message={t.message}
            type={t.type}
            onDismiss={dismissToast}
          />
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div id="confettiContainer">
          {Array.from({ length: 60 }, (_, i) => {
            const colors = [
              "#0057FF",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899",
            ];
            return (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}vw`,
                  backgroundColor:
                    colors[Math.floor(Math.random() * colors.length)],
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  width: `${Math.random() * 8 + 6}px`,
                  height: `${Math.random() * 8 + 6}px`,
                  animationDuration: `${Math.random() * 2 + 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Main */}
      <main className="flex-1 pt-[72px] pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header Card */}
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#0057FF] mb-1">
                  Provider Onboarding
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  Complete Profile &amp; Verification
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Finish your setup to start receiving matched service requests.
                </p>
              </div>
              {showSaveBadge && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl text-sm font-medium">
                  <FaCheckCircle />
                  Draft saved
                </div>
              )}
            </div>
            {renderStepIndicators()}
          </div>

          {/* Offline Banner */}
          {offline && (
            <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-700 flex items-center gap-2">
              <FaInfoCircle className="shrink-0" />
              No internet connection. Check your network and retry.
            </div>
          )}

          {/* Form Error */}
          {formError && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-700 flex items-center gap-2">
              <FaInfoCircle className="shrink-0" />
              {formError}
            </div>
          )}

          {/* ===== SUBMITTED STATE ===== */}
          {submitted ? (
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <section className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6 sm:p-8 step-enter">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-700">
                  <FaClock size={14} />
                  Verification pending
                </div>
                <h2 className="mb-2 text-2xl font-bold text-[#1A1A1A]">
                  Profile submitted for review
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Your details are under review. We'll notify you when
                  verification is complete.
                </p>
                <div className="space-y-2.5 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <FaShieldAlt className="text-[#0057FF] mt-0.5 shrink-0" />
                    We verify identity and service information for trust and
                    safety.
                  </div>
                  <div className="flex items-start gap-2">
                    <FaBell className="text-[#0057FF] mt-0.5 shrink-0" />
                    Keep your availability updated so requests can be matched
                    quickly.
                  </div>
                  <div className="flex items-start gap-2">
                    <FaPencilAlt className="text-[#0057FF] mt-0.5 shrink-0" />
                    You can return to edit profile details while review is
                    pending.
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-[#0057FF]/25"
                  >
                    <FaPencilAlt size={14} />
                    Edit profile
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    <FaHome size={14} />
                    Back to home
                  </Link>
                </div>
              </section>
              <aside
                className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6 step-enter"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="mb-4 text-lg font-bold text-[#1A1A1A]">
                  Profile preview
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0057FF] text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                    {form.avatarUrl ? (
                      <img
                        src={form.avatarUrl}
                        className="w-12 h-12 rounded-full object-cover"
                        alt=""
                      />
                    ) : form.category ? (
                      form.category.charAt(0)
                    ) : (
                      "S"
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1A1A]">
                      SureLink Provider
                    </div>
                    <div className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      Pending review
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-[#1A1A1A]">
                      Category:
                    </span>{" "}
                    {form.category || "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1A1A1A]">Area:</span>{" "}
                    {form.area || "—"} + {form.radius}km
                  </p>
                  <p>
                    <span className="font-semibold text-[#1A1A1A]">
                      Availability:
                    </span>{" "}
                    {form.openForWork ? "Open for work" : "Unavailable"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1A1A1A]">
                      ID type:
                    </span>{" "}
                    {form.idType || "—"}
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            /* ===== FORM STATE ===== */
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6 sm:p-8 space-y-6"
              >
                {/* ===== STEP: PROFILE ===== */}
                {currentStep === "profile" && (
                  <section
                    className={
                      direction === "forward"
                        ? "step-enter-right"
                        : "step-enter-left"
                    }
                  >
                    <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                      <FaBriefcase className="text-[#0057FF]" />
                      Service Details
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      How customers discover and understand your services.
                    </p>

                    {/* Avatar */}
                    <div className="mb-6 flex items-center gap-5">
                      <div
                        className="avatar-wrap relative w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        {!form.avatarUrl ? (
                          <div className="flex flex-col items-center">
                            <FaCamera className="text-gray-400 text-xl" />
                          </div>
                        ) : (
                          <img
                            src={form.avatarUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Profile"
                          />
                        )}
                        <div className="avatar-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
                          <FaCamera className="text-white text-xl" />
                        </div>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A1A]">
                          Profile photo
                        </p>
                        <p className="text-xs text-gray-500">
                          Helps customers recognize you
                        </p>
                      </div>
                    </div>

                    {/* Cover Photo */}
                    <div className="space-y-2 mb-6">
                      <div
                        className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                        onClick={() => coverInputRef.current?.click()}
                      >
                        {form.coverPicture ? (
                          <img
                            src={form.coverPicture}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <FaImage className="text-gray-400 text-4xl" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col items-center gap-2">
                            <FaCamera className="text-white text-2xl" />
                            <span className="text-white text-sm font-medium">
                              Upload Cover Photo
                            </span>
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={coverInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverChange}
                        />
                      </div>
                      <p className="text-center text-sm font-semibold text-[#1A1A1A]">
                        Cover photo
                      </p>
                      <p className="text-center text-xs text-gray-500">
                        A banner image for your profile
                      </p>
                    </div>

                    {/* Name Fields */}
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Enter first name"
                            value={form.firstName || ""}
                            disabled={loading}
                            onChange={(e) =>
                              updateField("firstName", e.target.value)
                            }
                            className={`${inputIconClass} ${fieldErrors.firstName ? "!border-red-400" : ""}`}
                          />
                        </div>
                        {renderFieldError("firstName")}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Enter last name"
                            value={form.lastName || ""}
                            disabled={loading}
                            onChange={(e) =>
                              updateField("lastName", e.target.value)
                            }
                            className={`${inputIconClass} ${fieldErrors.lastName ? "!border-red-400" : ""}`}
                          />
                        </div>
                        {renderFieldError("lastName")}
                      </div>
                    </div>

                    {/* Primary Category */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Service category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.category}
                        disabled={loading}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                        className={`${inputClass} ${fieldErrors.category ? "!border-red-400" : ""}`}
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {renderFieldError("category")}
                    </div>

                    {/* Area + Radius */}
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Service area <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. East Legon, Accra"
                            value={form.area}
                            disabled={loading}
                            onChange={(e) =>
                              updateField("area", e.target.value)
                            }
                            className={`${inputIconClass} ${fieldErrors.area ? "!border-red-400" : ""}`}
                          />
                        </div>
                        {renderFieldError("area")}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Service radius
                        </label>
                        <select
                          value={form.radius}
                          disabled={loading}
                          onChange={(e) =>
                            updateField("radius", e.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="3">3 km</option>
                          <option value="5">5 km</option>
                          <option value="10">10 km</option>
                          <option value="20">20 km</option>
                          <option value="50">50 km</option>
                        </select>
                      </div>
                    </div>

                    {/* Business Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.businessName || ""}
                        disabled={loading}
                        onChange={(e) =>
                          updateField("businessName", e.target.value)
                        }
                        placeholder="e.g. Acme Enterprise Group"
                        className={`${inputClass} ${fieldErrors.businessName ? "!border-red-400" : ""}`}
                      />
                      <div className="mt-1 flex justify-between text-xs">
                        <span className="text-gray-400">
                          Minimum 2 characters
                        </span>
                        <span
                          className={`${
                            (form.businessName?.length || 0) < 2
                              ? "text-red-500"
                              : (form.businessName?.length || 0) < 5
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }`}
                        >
                          {form.businessName?.length || 0}/100
                        </span>
                      </div>
                      {renderFieldError("businessName")}
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Professional bio <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        maxLength={500}
                        value={form.bio}
                        disabled={loading}
                        onChange={(e) => updateField("bio", e.target.value)}
                        placeholder="Describe your experience, strengths, and what customers can expect…"
                        className={`${inputClass} resize-y ${fieldErrors.bio ? "!border-red-400" : ""}`}
                      />
                      <div className="mt-1 flex justify-between text-xs">
                        <span className="text-gray-400">
                          Minimum 40 characters
                        </span>
                        <span
                          className={`${
                            form.bio.length < 40
                              ? "text-red-500"
                              : form.bio.length < 100
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }`}
                        >
                          {form.bio.length}/500
                        </span>
                      </div>
                      {renderFieldError("bio")}
                    </div>

                    {/* Price + Availability */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Starting price{" "}
                          <span className="text-gray-400 font-normal">
                            (GHS, optional)
                          </span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                            ₵
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="e.g. 120"
                            value={form.basePrice}
                            disabled={loading}
                            onChange={(e) =>
                              updateField("basePrice", e.target.value)
                            }
                            className={priceClass}
                          />
                        </div>
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <div className="relative mt-0.5">
                            <input
                              type="checkbox"
                              checked={form.openForWork}
                              disabled={loading}
                              onChange={(e) =>
                                updateField("openForWork", e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-10 h-6 rounded-full bg-gray-200 peer-checked:bg-[#0057FF] transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></div>
                          </div>
                          <span className="text-sm text-gray-700">
                            Open for work now
                          </span>
                        </label>
                      </div>
                    </div>
                  </section>
                )}

                {/* ===== STEP: VERIFICATION ===== */}
                {currentStep === "verification" && (
                  <section
                    className={
                      direction === "forward"
                        ? "step-enter-right"
                        : "step-enter-left"
                    }
                  >
                    <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                      <FaShieldAlt className="text-[#0057FF]" />
                      Verification Details
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Used only for trust and safety review — similar to
                      identity checks on leading platforms.
                    </p>

                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          ID type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.idType}
                          disabled={loading}
                          onChange={(e) =>
                            updateField("idType", e.target.value)
                          }
                          className={`${inputClass} ${fieldErrors.idType ? "!border-red-400" : ""}`}
                        >
                          <option value="">Select ID type</option>
                          {ID_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        {renderFieldError("idType")}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          ID number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter ID number"
                          value={form.idNumber}
                          disabled={loading}
                          onChange={(e) =>
                            updateField("idNumber", e.target.value)
                          }
                          className={`${inputClass} ${fieldErrors.idNumber ? "!border-red-400" : ""}`}
                        />
                        {renderFieldError("idNumber")}
                      </div>
                    </div>

                    {/* Drag & Drop Upload */}
                    <div className="mb-2">
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Upload ID document{" "}
                        <span className="text-gray-400 font-normal">
                          (optional in MVP)
                        </span>
                      </label>
                      <div
                        className={`drop-zone rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                          dragOver
                            ? "border-[#0057FF] bg-blue-50"
                            : "border-gray-300 bg-gray-50 hover:border-[#0057FF]"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => docInputRef.current?.click()}
                      >
                        {!form.docName ? (
                          <div className="p-6 text-center flex flex-col items-center gap-2">
                            <div
                              className={`drop-icon w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center ${
                                dragOver ? "scale-110" : ""
                              }`}
                            >
                              <FaUpload className="text-[#0057FF] text-xl" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">
                              Drag &amp; drop your file here
                            </p>
                            <p className="text-xs text-gray-400">
                              or{" "}
                              <span className="text-[#0057FF] underline">
                                browse files
                              </span>
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, PDF up to 5MB
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                              <FaFileAlt className="text-emerald-600 text-xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {form.docName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {form.docSize}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDoc();
                              }}
                              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition"
                            >
                              <FaTimes className="text-red-500" />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={docInputRef}
                          accept=".png,.jpg,.jpeg,.pdf"
                          className="hidden"
                          onChange={handleDocInputChange}
                        />
                      </div>
                    </div>

                    {/* Verification Selfie */}
                    <div className="mt-6">
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Verification Selfie{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        A clear photo of your face for identity verification.
                      </p>
                      <div className="flex items-center gap-5">
                        <div
                          className="avatar-wrap relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                          onClick={() => selfieInputRef.current?.click()}
                        >
                          {!form.selfieUrl ? (
                            <div className="flex flex-col items-center gap-1">
                              <FaCamera className="text-gray-400 text-xl" />
                              <span className="text-[10px] text-gray-400">
                                Selfie
                              </span>
                            </div>
                          ) : (
                            <img
                              src={form.selfieUrl}
                              className="absolute inset-0 w-full h-full object-cover"
                              alt="Verification selfie"
                            />
                          )}
                          <div className="avatar-overlay absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                            <FaCamera className="text-white text-xl" />
                          </div>
                          <input
                            type="file"
                            ref={selfieInputRef}
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={handleSelfieChange}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1A1A1A]">
                            Take or upload a selfie
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Must clearly show your face. Max 2MB.
                          </p>
                          {form.selfieUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                updateField("selfieUrl", "");
                                if (selfieInputRef.current)
                                  selfieInputRef.current.value = "";
                              }}
                              className="mt-1.5 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTimes className="text-[10px]" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ===== STEP: REVIEW ===== */}
                {currentStep === "review" && (
                  <section
                    className={
                      direction === "forward"
                        ? "step-enter-right"
                        : "step-enter-left"
                    }
                  >
                    <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-1">
                      <FaClipboardCheck className="text-[#0057FF]" />
                      Review Your Profile
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Final confirmation before submission.
                    </p>

                    <div className="grid gap-3 text-sm sm:grid-cols-2 mb-4">
                      {reviewItems.map(([label, val]) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="font-semibold text-[#1A1A1A]">
                            {label}:
                          </span>
                          <span className="text-gray-600">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 mb-4">
                      <p className="mb-1 font-bold text-[#1A1A1A]">
                        Professional bio
                      </p>
                      <p>{form.bio || "—"}</p>
                    </div>

                    <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 cursor-pointer select-none hover:border-[#0057FF] transition">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          disabled={loading}
                          onChange={(e) =>
                            updateField("consent", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            form.consent
                              ? "bg-[#0057FF] border-[#0057FF]"
                              : "border-gray-300"
                          }`}
                        >
                          {form.consent && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        I confirm these details are accurate and agree to
                        verification review.
                      </span>
                    </label>
                    {renderFieldError("consent")}
                  </section>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
                  {currentStep !== "profile" && (
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
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#0057FF] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-lg shadow-[#0057FF]/25 flex-1 justify-center"
                    >
                      Continue
                      <FaArrowRight className="text-xs" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !form.consent}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold text-sm rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <FaClipboardCheck />
                          Submit profile
                        </>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition"
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

              {/* ===== SIDEBAR ===== */}
              <aside className="space-y-6">
                {/* Progress */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E8F0FF] p-6">
                  <h3 className="font-bold text-[#1A1A1A] mb-2">
                    Profile readiness
                  </h3>
                  <p className="text-sm text-gray-500 mb-5">
                    Complete your profile to improve trust and receive more
                    matched requests.
                  </p>

                  {/* Ring Progress */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-28 h-28">
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
                          stroke={ringColor}
                          strokeWidth="6"
                          strokeLinecap="round"
                          className="ring-progress"
                          strokeDasharray={circumference}
                          strokeDashoffset={ringOffset}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-[#1A1A1A]">
                          {progress}%
                        </span>
                        <span className="text-xs text-gray-400">complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2.5 mb-5">
                    {[
                      { key: "category", label: "Add service category" },
                      { key: "area", label: "Set service area" },
                      { key: "bio", label: "Write professional bio" },
                      {
                        key: "verification",
                        label: "Complete ID verification",
                      },
                      { key: "photo", label: "Add profile photo" },
                      { key: "selfie", label: "Take verification selfie" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            checklist[key]
                              ? "bg-[#0057FF] border-[#0057FF]"
                              : "border-gray-300"
                          }`}
                        >
                          {checklist[key] && (
                            <FaCheck className="text-white text-[10px]" />
                          )}
                        </div>
                        <span
                          className={`transition-colors ${
                            checklist[key] ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3.5 text-xs text-blue-700 flex items-start gap-2 border border-blue-100">
                    <FaInfoCircle className="shrink-0 mt-0.5" />
                    <span>
                      Tip: Top-performing profiles combine a clear service bio,
                      strong area details, and completed ID verification.
                    </span>
                  </div>
                </div>

                {/* Why Join Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-[#0057FF] text-lg mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">
                        Why become a provider?
                      </h4>
                      <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-[#0057FF] text-xs" />
                          Access thousands of customers
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-[#0057FF] text-xs" />
                          Get verified and build trust
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-[#0057FF] text-xs" />
                          Grow your business with ease
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0057FF]">SureLink</span>
          </div>
          <p>&copy; 2025 SureLink. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#0057FF] transition">
              Privacy
            </a>
            <a href="#" className="hover:text-[#0057FF] transition">
              Terms
            </a>
            <a href="#" className="hover:text-[#0057FF] transition">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
