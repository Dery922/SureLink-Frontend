import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ===================== CONSTANTS =====================
const ID_OPTIONS = ["National ID", "Driver's license", "Passport", "Voter ID"];
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
    "alert-circle": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
    ),
    "check-circle-2": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
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
    "upload-cloud": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
    ),
    "file-check": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m10 16 2 2 4-4"/></svg>
    ),
    x: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    ),
    lightbulb: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    ),
  };
  return icons[name] || null;
};

// ===================== STEP INDICATORS =====================
const STEPS_LIST = ["profile", "verification", "review"];
const STEP_LABELS = { profile: "Profile", verification: "Verification", review: "Review" };

function StepIndicators({ activeStep }) {
  const activeIdx = STEPS_LIST.indexOf(activeStep);
  return (
    <div className="mt-6 flex items-center w-full">
      {STEPS_LIST.map((step, i) => {
        const isCompleted = i < activeIdx;
        const isActive = i === activeIdx;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                isCompleted ? "bg-brand-500 border-brand-500 text-white"
                : isActive ? "bg-white dark:bg-gray-800 border-amber-500 text-amber-600 dark:text-amber-400"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
              }`}>
                {isCompleted ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span className={`text-xs sm:text-sm font-semibold hidden sm:inline transition-colors duration-300 ${
                isCompleted ? "text-brand-600 dark:text-brand-400"
                : isActive ? "text-amber-600 dark:text-amber-400 font-bold"
                : "text-gray-400"
              }`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < STEPS_LIST.length - 1 && (
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
function ProviderOnboardingStep2Verification() {
  const navigate = useNavigate();
  const docInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [dark, setDark] = useState(false);
  const [showSaveBadge, setShowSaveBadge] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        category: "", secondaryCategory: "", area: "", radius: "5",
        bio: "", basePrice: "", openForWork: true, idType: "",
        idNumber: "", docName: "", docSize: "", consent: false, avatarUrl: "",
      };
    } catch { return { category: "", secondaryCategory: "", area: "", radius: "5", bio: "", basePrice: "", openForWork: true, idType: "", idNumber: "", docName: "", docSize: "", consent: false, avatarUrl: "" }; }
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleDocUpload = useCallback((file) => {
    const valid = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!valid.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    updateField("docName", file.name);
    updateField("docSize", formatFileSize(file.size));
  }, [form]);

  const handleDocInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) handleDocUpload(file);
  }, [handleDocUpload]);

  const removeDoc = useCallback(() => {
    updateField("docName", "");
    updateField("docSize", "");
    if (docInputRef.current) docInputRef.current.value = "";
  }, []);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleDocUpload(file);
  }, [handleDocUpload]);

  const validateVerificationStep = () => {
    const nextErrors = {
      idType: form.idType ? "" : "Select an ID type.",
      idNumber: form.idNumber.trim().length >= 6 ? "" : "Enter a valid ID number (minimum 6 characters).",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleContinue = () => {
    if (!validateVerificationStep()) return;
    navigate("/provider-onboarding/review");
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setShowSaveBadge(true);
    setTimeout(() => setShowSaveBadge(false), 3000);
  };

  const inputClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm input-glow transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 disabled:opacity-50";

  const renderFieldError = (field) => {
    if (!fieldErrors[field]) return null;
    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 field-error-shake">
        <Icon name="alert-circle" size={12} /><span>{fieldErrors[field]}</span>
      </p>
    );
  };

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
        .drop-zone.drag-over { border-color: #3A9AFF !important; background: #EFF6FF !important; }
        .drop-icon { transition: transform 0.2s ease; }
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
                <h1 className="mb-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">Step 2: Verification</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verify your identity for trust and safety.</p>
              </div>
              {showSaveBadge && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-3 py-1.5 shrink-0 save-pulse">
                  <Icon name="check-circle-2" size={14} /><span>Draft saved</span>
                </div>
              )}
            </div>
            <StepIndicators activeStep="verification" />
          </div>

          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
            {/* Main form */}
            <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-5 rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-sm">
              <section className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 p-5 step-enter">
                <h2 className="mb-1 text-lg font-bold flex items-center gap-2">
                  <Icon name="shield-check" size={20} className="text-amber-600" />
                  Identity verification
                </h2>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Used only for trust and safety review — your information is kept secure and private.</p>

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="idType" className="mb-1.5 flex items-center gap-1 text-sm font-semibold">
                      ID type <span className="text-red-500">*</span>
                    </label>
                    <select id="idType" value={form.idType} disabled={loading} onChange={(e) => updateField("idType", e.target.value)} className={`${inputClass} ${fieldErrors.idType ? "!border-red-400 dark:!border-red-500" : ""}`}>
                      <option value="">Select ID type</option>
                      {ID_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
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

                {/* Security info */}
                <div className="mt-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 p-3 text-xs text-brand-700 dark:text-brand-400 flex items-start gap-2">
                  <Icon name="shield-check" size={14} className="shrink-0 mt-0.5" />
                  <span>Your data is encrypted and secure. We use industry-standard protection and comply with data protection regulations.</span>
                </div>
              </section>

              {/* Action Bar */}
              <div className="sticky bottom-4 z-10 flex flex-wrap gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 p-3 shadow-lg backdrop-blur-md">
                <button type="button" onClick={() => navigate("/provider-onboarding/profile")} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.97] transition">
                  <Icon name="arrow-left" size={16} />Back
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
              <h3 className="mb-2 text-lg font-bold">Why we verify</h3>
              <div className="space-y-4 text-sm mb-5">
                {[
                  { icon: "check-circle-2", color: "text-emerald-500", title: "Build trust", desc: "Verified providers get more customer confidence and bookings." },
                  { icon: "shield-check", color: "text-amber-500", title: "Safety first", desc: "Protects both you and customers from fraud and disputes." },
                  { icon: "arrow-right", color: "text-brand-500", title: "Faster approval", desc: "Complete verification within 24-48 hours typically." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <Icon name={item.icon} size={18} className={`${item.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-brand-50 dark:bg-brand-900/20 p-3.5 text-xs text-brand-700 dark:text-brand-400 flex items-start gap-2">
                <Icon name="lightbulb" size={16} className="shrink-0 mt-0.5" />
                <span>Your ID is only used for verification. We never share it publicly.</span>
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

export default ProviderOnboardingStep2Verification;
