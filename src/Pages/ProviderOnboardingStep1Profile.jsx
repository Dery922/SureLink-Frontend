import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ===================== CONSTANTS =====================
const CATEGORY_OPTIONS = [
  "Plumbing", "Electrical", "Carpentry", "Cleaning",
  "Tutoring", "Catering", "Beauty", "Delivery",
  "Painting", "Landscaping", "Photography", "Repair",
];

const STORAGE_KEY = "providerOnboarding";
const DARK_KEY = "surelink_dark";

// ===================== ICON COMPONENT =====================
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
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    ),
    "map-pin": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    camera: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    ),
    "alert-circle": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
    save: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.2 3a.6.6 0 0 1 .4.2l3.2 3.2a.6.6 0 0 1 .2.4V21a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6z"/><path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><path d="M8 3v3h8V3"/></svg>
    ),
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    lightbulb: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    ),
    "check-circle-2": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    ),
  };
  return icons[name] || null;
};

// ===================== STEP INDICATORS =====================
const STEPS = ["profile", "verification", "review"];
const STEP_LABELS = { profile: "Profile", verification: "Verification", review: "Review" };

function StepIndicators({ activeStep }) {
  const activeIdx = STEPS.indexOf(activeStep);
  return (
    <div className="mt-6 flex items-center w-full">
      {STEPS.map((step, i) => {
        const isCompleted = i < activeIdx;
        const isActive = i === activeIdx;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                isCompleted ? "bg-brand-500 border-brand-500 text-white"
                : isActive ? "bg-white dark:bg-gray-800 border-brand-500 text-brand-600 dark:text-brand-400"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
              }`}>
                {isCompleted ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span className={`text-xs sm:text-sm font-semibold hidden sm:inline transition-colors duration-300 ${
                isCompleted ? "text-brand-600 dark:text-brand-400"
                : isActive ? "text-brand-600 dark:text-brand-400 font-bold"
                : "text-gray-400"
              }`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                i < activeIdx ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
function ProviderOnboardingStep1Profile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [dark, setDark] = useState(false);
  const [showSaveBadge, setShowSaveBadge] = useState(false);

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        category: "", secondaryCategory: "", area: "", radius: "5",
        bio: "", basePrice: "", openForWork: true, idType: "",
        idNumber: "", docName: "", consent: false, avatarUrl: "",
      };
    } catch { return { category: "", secondaryCategory: "", area: "", radius: "5", bio: "", basePrice: "", openForWork: true, idType: "", idNumber: "", docName: "", consent: false, avatarUrl: "" }; }
  });

  // Dark mode
  useEffect(() => {
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

  const toggleDark = useCallback(() => {
    setDark((prev) => { const next = !prev; localStorage.setItem(DARK_KEY, String(next)); return next; });
  }, []);

  const updateField = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateField("avatarUrl", ev.target.result);
    reader.readAsDataURL(file);
  }, [form]);

  const validateProfileStep = () => {
    const nextErrors = {
      category: form.category ? "" : "Choose your primary service category.",
      area: form.area.trim() ? "" : "Service area is required.",
      bio: form.bio.trim().length >= 40 ? "" : "Tell customers about your experience (minimum 40 characters).",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleContinue = () => {
    if (!validateProfileStep()) return;
    navigate("/provider-onboarding/verification");
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setShowSaveBadge(true);
    setTimeout(() => setShowSaveBadge(false), 3000);
  };

  // Progress
  const progress = useMemo(() => {
    let score = 0;
    if (form.category) score += 25;
    if (form.area.trim()) score += 20;
    if (form.bio.trim().length >= 40) score += 25;
    if (form.avatarUrl) score += 15;
    if (form.basePrice) score += 15;
    return Math.min(score, 100);
  }, [form]);

  const circumference = 2 * Math.PI * 42;
  const ringOffset = circumference - (circumference * progress / 100);
  const ringColor = progress >= 80 ? "#10B981" : progress >= 50 ? "#F59E0B" : "#3A9AFF";

  const inputClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm input-glow transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 disabled:opacity-50";

  const renderFieldError = (field) => {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 field-error-shake">
        <Icon name="alert-circle" size={12} />
        <span>{fieldErrors[field]}</span>
      </p>
    );
  };

  const secondaryCategories = CATEGORY_OPTIONS.filter((c) => c !== form.category);

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col antialiased">
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(0.9); opacity: 1; } }
        .step-enter { animation: fadeSlideIn 0.4s ease-out forwards; }
        .field-error-shake { animation: shake 0.35s ease-in-out; }
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(58, 154, 255, 0.15); }
        .save-pulse { animation: pulse-ring 1.5s ease-in-out; }
        .avatar-wrap:hover .avatar-overlay { opacity: 1; }
        .avatar-overlay { opacity: 0; transition: opacity 0.2s ease; }
        .nav-scrolled { box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
        * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-tight text-brand-500">SureLink</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="Toggle dark mode">
              {dark ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}
            </button>
            <a href="#" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 transition">
              <Icon name="help-circle" size={16} />Help
            </a>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Header Card */}
          <div className="mb-6 rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Provider onboarding</p>
                <h1 className="mb-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">Step 1: Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about your services. This helps customers find you.</p>
              </div>
              {showSaveBadge && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-3 py-1.5 shrink-0 save-pulse">
                  <Icon name="check-circle-2" size={14} /><span>Draft saved</span>
                </div>
              )}
            </div>
            <StepIndicators activeStep="profile" />
          </div>

          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
            {/* Main form */}
            <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-5 rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-sm">
              <section className="rounded-xl border border-brand-100 dark:border-gray-800 bg-brand-50/40 dark:bg-gray-800/40 p-5 step-enter">
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
                      <Icon name="camera" size={20} className="text-gray-400" />
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">Helps customers recognize you</p>
                  </div>
                </div>

                {/* Primary Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
                    Primary service category <span className="text-red-500">*</span>
                    <span className="relative group">
                      <Icon name="info" size={14} className="text-gray-400 cursor-help" />
                    </span>
                  </label>
                  <select id="category" value={form.category} disabled={loading} onChange={(e) => updateField("category", e.target.value)} className={`${inputClass} ${fieldErrors.category ? "!border-red-400 dark:!border-red-500" : ""}`}>
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {renderFieldError("category")}
                </div>

                {/* Secondary Category */}
                <div className="mb-4">
                  <label htmlFor="secondaryCategory" className="mb-1.5 block text-sm font-semibold">
                    Secondary category <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <select id="secondaryCategory" value={form.secondaryCategory} disabled={loading} onChange={(e) => updateField("secondaryCategory", e.target.value)} className={inputClass}>
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
                      <input id="area" type="text" placeholder="e.g. East Legon, Accra" value={form.area} disabled={loading} onChange={(e) => updateField("area", e.target.value)} className={`${inputClass} pl-9 ${fieldErrors.area ? "!border-red-400 dark:!border-red-500" : ""}`} />
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
                  </label>
                  <textarea id="bio" rows={4} maxLength={500} value={form.bio} disabled={loading} onChange={(e) => updateField("bio", e.target.value)} placeholder="Describe your experience, strengths, and what customers can expect…" className={`${inputClass} resize-y ${fieldErrors.bio ? "!border-red-400 dark:!border-red-500" : ""}`} />
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-gray-400">Minimum 40 characters</span>
                    <span className={`${form.bio.length < 40 ? "text-red-500" : form.bio.length < 100 ? "text-amber-500" : "text-emerald-500"}`}>{form.bio.length}/500</span>
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
                      <input id="basePrice" type="number" min="0" step="1" placeholder="e.g. 120" value={form.basePrice} disabled={loading} onChange={(e) => updateField("basePrice", e.target.value)} className={`${inputClass} pl-8`} />
                    </div>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <div className="relative mt-0.5">
                        <input type="checkbox" checked={form.openForWork} disabled={loading} onChange={(e) => updateField("openForWork", e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-brand-500 transition-colors"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Open for work now</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Action Bar */}
              <div className="sticky bottom-4 z-10 flex flex-wrap gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 p-3 shadow-lg backdrop-blur-md">
                <button type="button" onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.97] transition">
                  <Icon name="home" size={16} />Home
                </button>
                <button type="button" onClick={handleSaveDraft} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.97] transition">
                  <Icon name="save" size={16} />Save draft
                </button>
                <button type="submit" disabled={loading} className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition">
                  Continue<Icon name="arrow-right" size={16} />
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="h-fit rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm md:sticky md:top-24">
              <h3 className="mb-2 text-lg font-bold">Profile readiness</h3>
              <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Complete your profile to improve trust and receive more requests.</p>

              {/* Ring Progress */}
              <div className="flex justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="6" strokeLinecap="round" style={{ strokeDasharray: circumference, strokeDashoffset: ringOffset, transition: "stroke-dashoffset 0.6s ease-out" }} />
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
                  { done: !!form.category, label: "Add service category" },
                  { done: !!form.area.trim(), label: "Set service area" },
                  { done: form.bio.trim().length >= 40, label: "Write professional bio" },
                  { done: !!form.avatarUrl, label: "Add profile photo" },
                ].map(({ done, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      done ? "bg-emerald-500 border-emerald-500" : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {done && <Icon name="check" size={10} className="text-white" />}
                    </div>
                    <span className={`transition-colors ${done ? "text-gray-900 dark:text-gray-100 line-through" : "text-gray-600 dark:text-gray-400"}`}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-brand-50 dark:bg-brand-900/20 p-3.5 text-xs text-brand-700 dark:text-brand-400 flex items-start gap-2">
                <Icon name="lightbulb" size={16} className="shrink-0 mt-0.5" />
                <span>Tip: A clear bio and specific service area help you get matched faster with customers.</span>
              </div>
            </aside>
          </div>
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

export default ProviderOnboardingStep1Profile;
