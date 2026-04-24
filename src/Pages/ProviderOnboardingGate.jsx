import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ===================== CONSTANTS =====================
const CATEGORIES = [
  "Plumbing", "Electrical", "Carpentry", "Cleaning", "Tutoring",
  "Catering", "Beauty", "Delivery", "Painting", "Landscaping",
  "Photography", "Repair",
];

const ID_TYPES = ["National ID", "Driver's license", "Passport", "Voter ID"];

const STEPS = ["profile", "verification", "review"];

const STEP_LABELS = {
  profile: "Profile",
  verification: "Verification",
  review: "Review",
};

const STEP_COLORS = {
  profile: {
    bg: "bg-brand-50 dark:bg-brand-900/30",
    text: "text-brand-600 dark:text-brand-400",
    border: "border-brand-500",
  },
  verification: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500",
  },
  review: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500",
  },
};

const STORAGE_KEY = "surelink_provider_draft";
const DARK_KEY = "surelink_dark";

const INITIAL_FORM = {
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
};

// ===================== ICONS (inline SVGs) =====================
const Icon = ({ name, className = "", size = 16 }) => {
  const icons = {
    "shield-check": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    moon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    ),
    sun: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    ),
    "help-circle": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    ),
    "wifi-off": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    ),
    "alert-circle": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    "bell-ring": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
    ),
    pencil: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
    ),
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    ),
    camera: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    ),
    "map-pin": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    "upload-cloud": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
    ),
    "file-check": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m10 16 2 2 4-4"/></svg>
    ),
    x: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    ),
    "clipboard-check": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
    ),
    "arrow-left": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
    ),
    "arrow-right": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    ),
    send: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
    ),
    save: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.2 3a.6.6 0 0 1 .4.2l3.2 3.2a.6.6 0 0 1 .2.4V21a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6z"/><path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><path d="M8 3v3h8V3"/></svg>
    ),
    "check-circle-2": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    lightbulb: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    ),
    "spinner": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={`${className} animate-spin`}><circle cx="12" cy="12" r="10" strokeDasharray="30 70"/></svg>
    ),
  };

  return icons[name] || null;
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
    success: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300",
    error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    info: "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300",
  };

  const iconMap = { success: "check-circle-2", error: "alert-circle", info: "info" };

  return (
    <div className={`pointer-events-auto rounded-xl border ${colorMap[type]} p-3.5 shadow-lg flex items-start gap-3 ${exiting ? "toast-exit" : "toast-enter"}`}>
      <Icon name={iconMap[type]} size={20} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs opacity-80 mt-0.5">{message}</p>
      </div>
      <button className="shrink-0 opacity-60 hover:opacity-100 transition" onClick={() => { setExiting(true); setTimeout(() => onDismiss(id), 300); }}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

// ===================== CONFETTI COMPONENT =====================
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#3A9AFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      round: Math.random() > 0.5,
      w: Math.random() * 8 + 6,
      h: Math.random() * 8 + 6,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 0.5,
    }));
  }, []);

  return (
    <div id="confettiContainer">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : "2px",
            width: `${p.w}px`,
            height: `${p.h}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
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
  const [dark, setDark] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [toasts, setToasts] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSaveBadge, setShowSaveBadge] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...INITIAL_FORM, ...JSON.parse(saved) } : { ...INITIAL_FORM };
    } catch {
      return { ...INITIAL_FORM };
    }
  });

  // Refs
  const avatarInputRef = useRef(null);
  const docInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const navScrollRef = useRef(false);

  // ===================== EFFECTS =====================
  useEffect(() => {
    // Init dark mode
    const saved = localStorage.getItem(DARK_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "true" || (!saved && prefersDark);
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const onOffline = () => { setOffline(true); addToast("You're offline", "Check your internet connection.", "error"); };
    const onOnline = () => { setOffline(false); addToast("Back online", "Your connection has been restored.", "success"); };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => { window.removeEventListener("offline", onOffline); window.removeEventListener("online", onOnline); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById("navbar");
      if (nav) nav.classList.toggle("nav-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
      } catch { /* ignore */ }
    }, 1000);
  }, [form]);

  // Auto-save on form changes
  useEffect(() => {
    if (!submitted) debouncedAutoSave();
  }, [form, submitted, debouncedAutoSave]);

  // ===================== PROGRESS =====================
  const progress = useMemo(() => {
    let score = 0;
    if (form.category) score += 20;
    if (form.area.trim()) score += 15;
    if (form.bio.trim().length >= 40) score += 20;
    if (form.idType && form.idNumber.trim().length >= 6) score += 20;
    if (form.docName) score += 10;
    if (form.avatarUrl) score += 10;
    if (form.basePrice) score += 5;
    return Math.min(score, 100);
  }, [form]);

  // ===================== CHECKLIST =====================
  const checklist = useMemo(() => ({
    category: !!form.category,
    area: !!form.area.trim(),
    bio: form.bio.trim().length >= 40,
    verification: !!(form.idType && form.idNumber.trim().length >= 6),
    photo: !!form.avatarUrl,
  }), [form]);

  // ===================== SECONDARY CATEGORIES =====================
  const secondaryCategories = useMemo(() => {
    return CATEGORIES.filter((c) => c !== form.category);
  }, [form.category]);

  // ===================== VALIDATION =====================
  const validateProfile = useCallback(() => {
    const errs = {};
    if (!form.category) errs.category = "Choose your primary service category.";
    if (!form.area.trim()) errs.area = "Service area is required.";
    if (form.bio.trim().length < 40) errs.bio = "Tell customers about your experience (minimum 40 characters).";
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  }, [form]);

  const validateVerification = useCallback(() => {
    const errs = {};
    if (!form.idType) errs.idType = "Select an ID type.";
    if (form.idNumber.trim().length < 6) errs.idNumber = "Enter a valid ID number (minimum 6 characters).";
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  }, [form]);

  const validateReview = useCallback(() => {
    const errs = {};
    if (!form.consent) errs.consent = "You must confirm this information is accurate.";
    setFieldErrors(errs);
    return !Object.keys(errs).length;
  }, [form]);

  // ===================== STEP NAVIGATION =====================
  const goNext = useCallback(() => {
    setDirection("forward");
    if (currentStep === "profile" && !validateProfile()) return;
    if (currentStep === "verification" && !validateVerification()) return;
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
  }, [currentStep, validateProfile, validateVerification]);

  const goBack = useCallback(() => {
    setDirection("backward");
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    const targetIdx = STEPS.indexOf(step);
    const currentIdx = STEPS.indexOf(currentStep);
    if (targetIdx < currentIdx) { setDirection("backward"); setCurrentStep(step); }
    else if (targetIdx === currentIdx + 1) { goNext(); }
  }, [currentStep, goNext]);

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      addToast("Profile submitted!", "Your details are under review.", "success");
    } catch {
      setFormError("We couldn't submit your profile. Please retry.");
      addToast("Submission failed", "Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [offline, validateReview, addToast]);

  const handleEditProfile = useCallback(() => {
    setSubmitted(false);
    setShowConfetti(false);
  }, []);

  // ===================== SAVE DRAFT =====================
  const handleSaveDraft = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      addToast("Draft saved", "Your progress has been saved locally.", "success");
      setShowSaveBadge(true);
      setTimeout(() => setShowSaveBadge(false), 3000);
    } catch {
      addToast("Save failed", "Could not save draft to local storage.", "error");
    }
  }, [form, addToast]);

  // ===================== DARK MODE =====================
  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem(DARK_KEY, String(next));
      return next;
    });
  }, []);

  // ===================== FILE HANDLERS =====================
  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { addToast("Invalid file", "Please upload an image file.", "error"); return; }
    if (file.size > 2 * 1024 * 1024) { addToast("File too large", "Maximum image size is 2MB.", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => updateField("avatarUrl", ev.target.result);
    reader.readAsDataURL(file);
  }, [addToast, updateField]);

  const handleDocUpload = useCallback((file) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) { addToast("Invalid file type", "Please upload PNG, JPG, or PDF files.", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { addToast("File too large", "Maximum file size is 5MB.", "error"); return; }
    updateField("docName", file.name);
    updateField("docSize", formatFileSize(file.size));
    addToast("File uploaded", file.name, "success");
  }, [addToast, updateField]);

  const handleDocInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) handleDocUpload(file);
  }, [handleDocUpload]);

  const removeDoc = useCallback(() => {
    updateField("docName", "");
    updateField("docSize", "");
    if (docInputRef.current) docInputRef.current.value = "";
    addToast("File removed", "Document removed from upload.", "info");
  }, [updateField, addToast]);

  // ===================== DRAG & DROP =====================
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleDocUpload(file);
  }, [handleDocUpload]);

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

  const inputClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm input-glow transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 disabled:opacity-50";
  const inputIconClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-4 py-3 text-sm input-glow transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 disabled:opacity-50";
  const priceClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-8 pr-4 py-3 text-sm input-glow transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 disabled:opacity-50";

  const renderFieldError = (field) => {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 field-error-shake">
        <Icon name="alert-circle" size={12} />
        <span>{fieldErrors[field]}</span>
      </p>
    );
  };

  // ===================== STEP INDICATORS =====================
  const activeIdx = STEPS.indexOf(currentStep);

  const renderStepIndicators = () => (
    <div className="mt-6 flex items-center w-full">
      {STEPS.map((step, i) => {
        const isCompleted = i < activeIdx;
        const isActive = i === activeIdx;
        const colors = STEP_COLORS[step];

        return (
          <div key={step} className="flex items-center flex-1">
            <button
              className="step-indicator flex items-center gap-2 cursor-pointer select-none group"
              onClick={() => goToStep(step)}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                  isCompleted
                    ? "bg-brand-500 border-brand-500 text-white"
                    : isActive
                    ? `bg-white dark:bg-gray-800 ${colors.border} ${colors.text}`
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                }`}
              >
                {isCompleted ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold hidden sm:inline transition-colors duration-300 ${
                  isCompleted
                    ? "text-brand-600 dark:text-brand-400"
                    : isActive
                    ? colors.text + " font-bold"
                    : "text-gray-400"
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`step-connector flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                  i < activeIdx ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
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
  const ringOffset = circumference - (circumference * progress / 100);
  const ringColor = progress >= 80 ? "#10B981" : progress >= 50 ? "#F59E0B" : "#3A9AFF";

  // ===================== REVIEW DATA =====================
  const reviewItems = [
    ["Primary category", form.category || "—"],
    ["Secondary category", form.secondaryCategory || "—"],
    ["Service area", form.area || "—"],
    ["Radius", `${form.radius} km`],
    ["Starting price", form.basePrice ? `GHS ${form.basePrice}` : "Not set"],
    ["Availability", form.openForWork ? "Open for work" : "Currently unavailable"],
    ["ID type", form.idType || "—"],
    ["ID number", form.idNumber ? maskId(form.idNumber) : "—"],
  ];

  // ===================== RENDER =====================
  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col antialiased">
      {/* CSS */}
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
        .drop-zone.drag-over { border-color: #3A9AFF !important; background: #EFF6FF !important; }
        .drop-zone.drag-over .drop-icon { transform: scale(1.15); }
        .drop-icon { transition: transform 0.2s ease; }
        .nav-scrolled { box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(58, 154, 255, 0.15); }
        .tooltip-trigger:hover .tooltip-content { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .tooltip-content { opacity: 0; pointer-events: none; transform: translateY(4px); transition: all 0.15s ease; }
        .step-connector { transition: background-color 0.4s ease; }
        * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .dark ::-webkit-scrollbar-thumb { background: #475569; }
      `}</style>

      {/* Navbar */}
      <nav id="navbar" className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-tight text-brand-500">SureLink</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="Toggle dark mode">
              {dark ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}
            </button>
            <a href="#" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 transition">
              <Icon name="help-circle" size={16} />
              Help
            </a>
          </div>
        </div>
      </nav>

      {/* Toasts */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 380 }}>
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} title={t.title} message={t.message} type={t.type} onDismiss={dismissToast} />
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main */}
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* Header Card */}
          <div className="mb-6 rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Provider onboarding</p>
                <h1 className="mb-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">Complete profile & verification</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Finish your setup to start receiving matched service requests.</p>
              </div>
              {showSaveBadge && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-3 py-1.5 shrink-0 save-pulse">
                  <Icon name="check-circle-2" size={14} />
                  <span>Draft saved</span>
                </div>
              )}
            </div>
            {renderStepIndicators()}
          </div>

          {/* Offline Banner */}
          {offline && (
            <div className="mb-5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3.5 text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Icon name="wifi-off" size={16} className="shrink-0" />
              No internet connection. Check your network and retry.
            </div>
          )}

          {/* Form Error */}
          {formError && (
            <div className="mb-5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3.5 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
              <Icon name="alert-circle" size={16} className="shrink-0" />
              {formError}
            </div>
          )}

          {/* ===== SUBMITTED STATE ===== */}
          {submitted ? (
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <section className="rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm step-enter">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-900/30 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Icon name="clock" size={14} />
                  Verification pending
                </div>
                <h2 className="mb-2 text-2xl font-bold">Profile submitted for review</h2>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Your details are under review. We'll notify you when verification is complete.</p>
                <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2"><Icon name="shield-check" size={16} className="text-brand-500 mt-0.5 shrink-0" />We verify identity and service information for trust and safety.</div>
                  <div className="flex items-start gap-2"><Icon name="bell-ring" size={16} className="text-brand-500 mt-0.5 shrink-0" />Keep your availability updated so requests can be matched quickly.</div>
                  <div className="flex items-start gap-2"><Icon name="pencil" size={16} className="text-brand-500 mt-0.5 shrink-0" />You can return to edit profile details while review is pending.</div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={handleEditProfile} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.97] transition">
                    <Icon name="pencil" size={16} />Edit profile
                  </button>
                  <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <Icon name="home" size={16} />Back to home
                  </a>
                </div>
              </section>
              <aside className="rounded-2xl border border-brand-100 dark:border-gray-800 bg-brand-50/50 dark:bg-gray-900 p-6 shadow-sm step-enter" style={{ animationDelay: "0.1s" }}>
                <h3 className="mb-4 text-lg font-bold">Profile preview</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-500 font-bold text-lg overflow-hidden">
                    {form.avatarUrl ? <img src={form.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="" /> : (form.category ? form.category.charAt(0) : "S")}
                  </div>
                  <div>
                    <div className="font-bold">SureLink Provider</div>
                    <div className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">Pending review</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-semibold">Category:</span> {form.category || "—"}</p>
                  <p><span className="font-semibold">Area:</span> {form.area || "—"} + {form.radius}km</p>
                  <p><span className="font-semibold">Availability:</span> {form.openForWork ? "Open for work" : "Unavailable"}</p>
                  <p><span className="font-semibold">ID type:</span> {form.idType || "—"}</p>
                </div>
              </aside>
            </div>
          ) : (
            /* ===== FORM STATE ===== */
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5 rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-sm">

                {/* ===== STEP: PROFILE ===== */}
                {currentStep === "profile" && (
                  <section className={direction === "forward" ? "step-enter-right" : "step-enter-left"}>
                    <div className="rounded-xl border border-brand-100 dark:border-gray-800 bg-brand-50/40 dark:bg-gray-800/40 p-5">
                      <h2 className="mb-1 text-lg font-bold flex items-center gap-2">
                        <Icon name="briefcase" size={20} className="text-brand-500" />
                        Service details
                      </h2>
                      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">How customers discover and understand your services.</p>

                      {/* Avatar */}
                      <div className="mb-5 flex items-center gap-4">
                        <div
                          className="avatar-wrap relative w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          {!form.avatarUrl ? (
                            <div className="flex flex-col items-center">
                              <Icon name="camera" size={20} className="text-gray-400" />
                            </div>
                          ) : (
                            <img src={form.avatarUrl} className="absolute inset-0 w-full h-full object-cover" alt="Profile" />
                          )}
                          <div className="avatar-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Icon name="camera" size={20} className="text-white" />
                          </div>
                          <input type="file" ref={avatarInputRef} accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Profile photo</p>
                          <p className="text-xs text-gray-500">Helps customers recognize you</p>
                        </div>
                      </div>

                      {/* Primary Category */}
                      <div className="mb-4">
                        <label htmlFor="category" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
                          Primary service category <span className="text-red-500">*</span>
                          <span className="tooltip-trigger relative">
                            <Icon name="info" size={14} className="text-gray-400 cursor-help" />
                            <span className="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 shadow-lg z-10">Choose the category that best represents your main service.</span>
                          </span>
                        </label>
                        <select
                          id="category"
                          value={form.category}
                          disabled={loading}
                          onChange={(e) => updateField("category", e.target.value)}
                          className={`${inputClass} ${fieldErrors.category ? "!border-red-400 dark:!border-red-500" : ""}`}
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {renderFieldError("category")}
                      </div>

                      {/* Secondary Category */}
                      <div className="mb-4">
                        <label htmlFor="secondaryCategory" className="mb-1.5 block text-sm font-semibold">
                          Secondary category <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <select
                          id="secondaryCategory"
                          value={form.secondaryCategory}
                          disabled={loading}
                          onChange={(e) => updateField("secondaryCategory", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Optional</option>
                          {secondaryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Area + Radius */}
                      <div className="mb-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="area" className="mb-1.5 flex items-center gap-1 text-sm font-semibold">
                            Service area <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Icon name="map-pin" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              id="area"
                              type="text"
                              placeholder="e.g. East Legon, Accra"
                              value={form.area}
                              disabled={loading}
                              onChange={(e) => updateField("area", e.target.value)}
                              className={`${inputIconClass} ${fieldErrors.area ? "!border-red-400 dark:!border-red-500" : ""}`}
                            />
                          </div>
                          {renderFieldError("area")}
                        </div>
                        <div>
                          <label htmlFor="radius" className="mb-1.5 block text-sm font-semibold">Service radius</label>
                          <select id="radius" value={form.radius} disabled={loading} onChange={(e) => updateField("radius", e.target.value)} className={inputClass}>
                            <option value="3">3 km</option>
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="20">20 km</option>
                            <option value="50">50 km</option>
                          </select>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mb-4">
                        <label htmlFor="bio" className="mb-1.5 flex items-center gap-1 text-sm font-semibold">
                          Professional bio <span className="text-red-500">*</span>
                          <span className="tooltip-trigger relative">
                            <Icon name="info" size={14} className="text-gray-400 cursor-help" />
                            <span className="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-gray-800 dark:bg-gray-700 text-white text-xs p-2 shadow-lg z-10">Describe your experience, strengths, and what customers can expect. This appears on your public profile.</span>
                          </span>
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          maxLength={500}
                          value={form.bio}
                          disabled={loading}
                          onChange={(e) => updateField("bio", e.target.value)}
                          placeholder="Describe your experience, strengths, and what customers can expect…"
                          className={`${inputClass} resize-y ${fieldErrors.bio ? "!border-red-400 dark:!border-red-500" : ""}`}
                        />
                        <div className="mt-1 flex justify-between text-xs">
                          <span className="text-gray-400">Minimum 40 characters</span>
                          <span className={`${
                            form.bio.length < 40 ? "text-red-500" : form.bio.length < 100 ? "text-amber-500" : "text-emerald-500"
                          }`}>{form.bio.length}/500</span>
                        </div>
                        {renderFieldError("bio")}
                      </div>

                      {/* Price + Availability */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="basePrice" className="mb-1.5 block text-sm font-semibold">
                            Starting price <span className="text-gray-400 font-normal">(GHS, optional)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₵</span>
                            <input id="basePrice" type="number" min="0" step="1" placeholder="e.g. 120" value={form.basePrice} disabled={loading} onChange={(e) => updateField("basePrice", e.target.value)} className={priceClass} />
                          </div>
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-start gap-3 cursor-pointer select-none">
                            <div className="relative mt-0.5">
                              <input type="checkbox" id="openForWork" checked={form.openForWork} disabled={loading} onChange={(e) => updateField("openForWork", e.target.checked)} className="sr-only peer" />
                              <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-brand-500 transition-colors"></div>
                              <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></div>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Open for work now</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ===== STEP: VERIFICATION ===== */}
                {currentStep === "verification" && (
                  <section className={direction === "forward" ? "step-enter-right" : "step-enter-left"}>
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 p-5">
                      <h2 className="mb-1 text-lg font-bold flex items-center gap-2">
                        <Icon name="shield-check" size={20} className="text-amber-600" />
                        Verification details
                      </h2>
                      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Used only for trust and safety review — similar to identity checks on leading platforms.</p>

                      <div className="mb-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="idType" className="mb-1.5 flex items-center gap-1 text-sm font-semibold">
                            ID type <span className="text-red-500">*</span>
                          </label>
                          <select id="idType" value={form.idType} disabled={loading} onChange={(e) => updateField("idType", e.target.value)} className={`${inputClass} ${fieldErrors.idType ? "!border-red-400 dark:!border-red-500" : ""}`}>
                            <option value="">Select ID type</option>
                            {ID_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                          {renderFieldError("idType")}
                        </div>
                        <div>
                          <label htmlFor="idNumber" className="mb-1.5 flex items-center gap-1 text-sm font-semibold">
                            ID number <span className="text-red-500">*</span>
                          </label>
                          <input id="idNumber" type="text" placeholder="Enter ID number" value={form.idNumber} disabled={loading} onChange={(e) => updateField("idNumber", e.target.value)} className={`${inputClass} ${fieldErrors.idNumber ? "!border-red-400 dark:!border-red-500" : ""}`} />
                          {renderFieldError("idNumber")}
                        </div>
                      </div>

                      {/* Drag & Drop Upload */}
                      <div className="mb-2">
                        <label className="mb-1.5 block text-sm font-semibold">
                          Upload ID document <span className="text-gray-400 font-normal">(optional in MVP)</span>
                        </label>
                        <div
                          className={`drop-zone rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                            dragOver
                              ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20"
                              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-brand-400"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => docInputRef.current?.click()}
                        >
                          {!form.docName ? (
                            <div className="p-6 text-center flex flex-col items-center gap-2">
                              <div className={`drop-icon w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center ${dragOver ? "scale-110" : ""}`}>
                                <Icon name="upload-cloud" size={24} className="text-brand-500" />
                              </div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Drag & drop your file here</p>
                              <p className="text-xs text-gray-400">or <span className="text-brand-500 underline">browse files</span></p>
                              <p className="text-xs text-gray-400">PNG, JPG, PDF up to 5MB</p>
                            </div>
                          ) : (
                            <div className="p-4 flex items-center gap-3 text-left">
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                <Icon name="file-check" size={20} className="text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{form.docName}</p>
                                <p className="text-xs text-gray-400">{form.docSize}</p>
                              </div>
                              <button type="button" onClick={(e) => { e.stopPropagation(); removeDoc(); }} className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition">
                                <Icon name="x" size={16} className="text-red-500" />
                              </button>
                            </div>
                          )}
                          <input type="file" ref={docInputRef} accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={handleDocInputChange} />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ===== STEP: REVIEW ===== */}
                {currentStep === "review" && (
                  <section className={direction === "forward" ? "step-enter-right" : "step-enter-left"}>
                    <div className="space-y-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-900/10 p-5">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Icon name="clipboard-check" size={20} className="text-emerald-600" />
                        Review your profile
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Final confirmation before submission.</p>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        {reviewItems.map(([label, val]) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{label}:</span>
                            <span className="text-gray-600 dark:text-gray-400">{val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-1 font-bold text-gray-900 dark:text-gray-100">Professional bio</p>
                        <p>{form.bio || "—"}</p>
                      </div>

                      <label className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer select-none hover:border-brand-300 transition">
                        <div className="relative mt-0.5">
                          <input type="checkbox" id="consent" checked={form.consent} disabled={loading} onChange={(e) => updateField("consent", e.target.checked)} className="sr-only peer" />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.consent ? "bg-brand-500 border-brand-500" : "border-gray-300 dark:border-gray-600"}`}>
                            {form.consent && <Icon name="check" size={12} className="text-white" />}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">I confirm these details are accurate and agree to verification review.</span>
                      </label>
                      {renderFieldError("consent")}
                    </div>
                  </section>
                )}

                {/* Action Bar */}
                <div className="sticky bottom-4 z-10 flex flex-wrap gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 p-3 shadow-lg backdrop-blur-md">
                  {currentStep !== "profile" && (
                    <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.97] transition">
                      <Icon name="arrow-left" size={16} />Back
                    </button>
                  )}
                  {currentStep !== "review" ? (
                    <button type="button" onClick={goNext} disabled={loading} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition">
                      Continue<Icon name="arrow-right" size={16} />
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} disabled={loading || !form.consent} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition">
                      {loading ? <><Icon name="spinner" size={16} />Submitting…</> : <><Icon name="send" size={16} />Submit profile</>}
                    </button>
                  )}
                  <button type="button" onClick={handleSaveDraft} disabled={loading} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.97] transition">
                    <Icon name="save" size={16} />Save draft
                  </button>
                  <a href="#" className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <Icon name="home" size={16} />Home
                  </a>
                </div>
              </form>

              {/* ===== SIDEBAR ===== */}
              <aside className="h-fit rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm md:sticky md:top-24">
                <h3 className="mb-2 text-lg font-bold">Profile readiness</h3>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Complete your profile to improve trust and receive more matched requests.</p>

                {/* Ring Progress */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                      <circle
                        cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="6" strokeLinecap="round"
                        className="ring-progress"
                        strokeDasharray={circumference}
                        strokeDashoffset={ringOffset}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold">{progress}%</span>
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
                    { key: "verification", label: "Complete ID verification" },
                    { key: "photo", label: "Add profile photo" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        checklist[key]
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {checklist[key] && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        )}
                      </div>
                      <span className={`transition-colors ${checklist[key] ? "text-gray-900 dark:text-gray-100 line-through" : "text-gray-600 dark:text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-brand-50 dark:bg-brand-900/20 p-3.5 text-xs text-brand-700 dark:text-brand-400 flex items-start gap-2">
                  <Icon name="lightbulb" size={16} className="shrink-0 mt-0.5" />
                  <span>Tip: Top-performing profiles combine a clear service bio, strong area details, and completed ID verification.</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-500">SureLink</span>
          </div>
          <p>© 2025 SureLink. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-500 transition">Privacy</a>
            <a href="#" className="hover:text-brand-500 transition">Terms</a>
            <a href="#" className="hover:text-brand-500 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}