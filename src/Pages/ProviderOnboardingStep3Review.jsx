import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

// ===================== CONSTANTS =====================
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
    "clipboard-check": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
    ),
    "arrow-left": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
    ),
    send: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
    ),
    spinner: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={`${className} animate-spin`}><circle cx="12" cy="12" r="10" strokeDasharray="30 70"/></svg>
    ),
    pencil: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
    ),
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    "bell-ring": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
    ),
    lightbulb: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    ),
  };
  return icons[name] || null;
};

// ===================== CONFETTI =====================
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#3A9AFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i, left: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)],
      round: Math.random() > 0.5, w: Math.random() * 8 + 6, h: Math.random() * 8 + 6,
      duration: Math.random() * 2 + 2, delay: Math.random() * 0.5,
    }));
  }, []);
  return (
    <div>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "fixed", top: "-10px", left: `${p.left}vw`, backgroundColor: p.color,
          borderRadius: p.round ? "50%" : "2px", width: `${p.w}px`, height: `${p.h}px`,
          animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          pointerEvents: "none", zIndex: 9999,
        }} />
      ))}
    </div>
  );
}

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
                : isActive ? "bg-white dark:bg-gray-800 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
              }`}>
                {isCompleted ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span className={`text-xs sm:text-sm font-semibold hidden sm:inline transition-colors duration-300 ${
                isCompleted ? "text-brand-600 dark:text-brand-400"
                : isActive ? "text-emerald-600 dark:text-emerald-400 font-bold"
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
function ProviderOnboardingStep3Review() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [dark, setDark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formError, setFormError] = useState("");

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

  const maskId = (id) => {
    if (!id || id.length < 6) return id ? id.replace(/(.{3}).*/, "$1***") : "—";
    return id.replace(/(.{3}).*(.{3})/, "$1***$2");
  };

  const validateReviewStep = () => {
    const nextErrors = { consent: form.consent ? "" : "You must confirm this information is accurate." };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!validateReviewStep()) return;
    setLoading(true);
    setFormError("");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      setFormError("We couldn't submit your profile. Please retry.");
    } finally {
      setLoading(false);
    }
  };

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

  // ===================== SUBMITTED STATE =====================
  if (submitted) {
    return (
      <div className="font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col antialiased">
        <style>{`
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
          .step-enter { animation: fadeSlideIn 0.4s ease-out forwards; }
          * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        `}</style>

        {showConfetti && <Confetti />}

        {/* Navbar */}
        <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <span className="text-xl font-bold tracking-tight text-brand-500">SureLink</span>
            </a>
            <button onClick={toggleDark} className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="Toggle dark mode">
              {dark ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}
            </button>
          </div>
        </nav>

        <main className="flex-1 pt-20 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <section className="rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm step-enter">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-900/30 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Icon name="clock" size={14} />Verification pending
                </div>
                <h2 className="mb-2 text-2xl font-bold">Profile submitted for review</h2>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Your details are under review. We'll notify you when verification is complete.</p>
                <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2"><Icon name="shield-check" size={16} className="text-brand-500 mt-0.5 shrink-0" />We verify identity and service information for trust and safety.</div>
                  <div className="flex items-start gap-2"><Icon name="bell-ring" size={16} className="text-brand-500 mt-0.5 shrink-0" />Keep your availability updated so requests can be matched quickly.</div>
                  <div className="flex items-start gap-2"><Icon name="pencil" size={16} className="text-brand-500 mt-0.5 shrink-0" />You can return to edit profile details while review is pending.</div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setSubmitted(false)} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.97] transition">
                    <Icon name="pencil" size={16} />Edit profile
                  </button>
                  <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <Icon name="home" size={16} />Back to home
                  </Link>
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
          </div>
        </main>

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

  // ===================== FORM STATE =====================
  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col antialiased">
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .step-enter { animation: fadeSlideIn 0.4s ease-out forwards; }
        .field-error-shake { animation: shake 0.35s ease-in-out; }
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(58, 154, 255, 0.15); }
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
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Provider onboarding</p>
            <h1 className="mb-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">Step 3: Review</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review your information before final submission.</p>
            <StepIndicators activeStep="review" />
          </div>

          {/* Form Error */}
          {formError && (
            <div className="mb-5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3.5 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
              <Icon name="alert-circle" size={16} className="shrink-0" />{formError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
            {/* Main form */}
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* Review Card */}
              <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-900/10 p-5 sm:p-7 shadow-sm step-enter">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Icon name="clipboard-check" size={20} className="text-emerald-600" />
                  Review your profile
                </h2>

                <div className="grid gap-3 text-sm sm:grid-cols-2 mb-4">
                  {reviewItems.map(([label, val]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{label}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <p className="mb-1 font-bold text-gray-900 dark:text-gray-100">Professional bio</p>
                  <p>{form.bio || "—"}</p>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer select-none hover:border-brand-300 transition">
                  <div className="relative mt-0.5">
                    <input type="checkbox" checked={form.consent} disabled={loading} onChange={(e) => updateField("consent", e.target.checked)} className="sr-only peer" />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.consent ? "bg-brand-500 border-brand-500" : "border-gray-300 dark:border-gray-600"}`}>
                      {form.consent && <Icon name="check" size={12} className="text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">I confirm these details are accurate and agree to verification review.</span>
                </label>
                {fieldErrors.consent && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1 field-error-shake">
                    <Icon name="alert-circle" size={12} /><span>{fieldErrors.consent}</span>
                  </p>
                )}
              </section>

              {/* Action Bar */}
              <div className="sticky bottom-4 z-10 flex flex-wrap gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 p-3 shadow-lg backdrop-blur-md">
                <button type="button" onClick={() => navigate("/provider-onboarding/verification")} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.97] transition">
                  <Icon name="arrow-left" size={16} />Back
                </button>
                <button type="submit" disabled={loading || !form.consent} className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition">
                  {loading ? <><Icon name="spinner" size={16} />Submitting…</> : <><Icon name="send" size={16} />Submit profile</>}
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="h-fit rounded-2xl border border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm md:sticky md:top-24">
              <h3 className="mb-4 text-lg font-bold">What happens next?</h3>
              <div className="space-y-4 text-sm">
                {[
                  { num: "1", color: "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400", title: "Submit profile", desc: "Your information is securely submitted." },
                  { num: "2", color: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", title: "Verification review", desc: "Usually 24-48 hours. We'll email you updates." },
                  { num: "3", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", title: "Go live", desc: "Start receiving requests from customers." },
                ].map((item) => (
                  <div key={item.num} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${item.color}`}>{item.num}</div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-brand-50 dark:bg-brand-900/20 p-3.5 text-xs text-brand-700 dark:text-brand-400 flex items-start gap-2">
                <Icon name="lightbulb" size={16} className="shrink-0 mt-0.5" />
                <span>Questions? Check out our Provider Help Center.</span>
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

export default ProviderOnboardingStep3Review;
