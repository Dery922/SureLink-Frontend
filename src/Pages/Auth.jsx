import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AuthButton,
  AuthIcon,
  ConsentRow,
  FeedbackBanner,
  OtpInputGroup,
  RoleCard,
} from "../components/auth/AuthComponents";

// ===================== CONSTANTS =====================
const STEPS = {
  WELCOME: "welcome",
  SIGN_IN: "signIn",
  OTP_SIGN_IN: "otpSignIn",
  REGISTER_BASICS: "registerBasics",
  OTP_SIGNUP: "otpSignup",
  ROLE_SELECTION: "roleSelection",
  CONSENT: "consent",
  ACCOUNT_CREATED: "accountCreated",
};

const OTP_RESEND_SECONDS = 30;
const DARK_KEY = "surelink_dark";

// ===================== INLINE ICON =====================
const Icon = ({ name, className = "", size = 16 }) => {
  const icons = {
    moon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    ),
    sun: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    ),
    "check-circle": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    "arrow-right": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    ),
    eye: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    ),
    "eye-off": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
    ),
    mail: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
    lock: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    ),
    "shield-check": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    zap: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    globe: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    ),
    "wifi-off": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    ),
  };
  return icons[name] || null;
};

// ===================== PASSWORD STRENGTH =====================
function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-amber-500", "bg-brand-500", "bg-emerald-500"];
  const label = labels[score - 1] || "Too short";
  const color = colors[score - 1] || "bg-gray-300";

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? color : "bg-gray-200 dark:bg-gray-700"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score >= 3 ? "text-emerald-600 dark:text-emerald-400" : score >= 2 ? "text-amber-600 dark:text-amber-400" : "text-red-500"}`}>
        {label}
      </p>
    </div>
  );
}

// ===================== GOOGLE ICON (COLORED) =====================
function GoogleIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ===================== HELPERS =====================
function validateIdentifier(identifier) {
  const clean = `${identifier || ""}`.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  const isPhone = /^(\+?233|0)\d{9}$/.test(clean.replace(/\s/g, ""));
  if (!clean) return "Phone or email is required.";
  if (!isEmail && !isPhone) return "Use a valid phone or email format.";
  return "";
}

function mapErrorToMicrocopy(errorCode) {
  const mapping = {
    AUTH_LOGIN_FAILED: "We couldn't sign you in. Check your details and try again.",
    AUTH_OTP_INVALID: "That code is incorrect or expired. Request a new one.",
    NETWORK_OFFLINE: "No internet connection. Check your network and retry.",
  };
  return mapping[errorCode] || "Something went wrong. Please retry.";
}

// ===================== MAIN COMPONENT =====================
const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(STEPS.WELCOME);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [slowNetwork, setSlowNetwork] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [dark, setDark] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    otp: "",
    role: "consumer",
    termsAccepted: false,
    marketingOptIn: false,
  });

  // ===================== EFFECTS =====================
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

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signin") setStep(STEPS.SIGN_IN);
    if (location.pathname === "/register") setStep(STEPS.REGISTER_BASICS);
  }, [location.pathname]);

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "provider" || role === "consumer") {
      setForm((prev) => ({ ...prev, role }));
    }
  }, [searchParams]);

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => { window.removeEventListener("offline", onOffline); window.removeEventListener("online", onOnline); };
  }, []);

  useEffect(() => {
    if (!otpTimer) return undefined;
    const id = window.setInterval(() => setOtpTimer((prev) => Math.max(0, prev - 1)), 1000);
    return () => window.clearInterval(id);
  }, [otpTimer]);

  // ===================== DARK MODE =====================
  const toggleDark = useCallback(() => {
    setDark((prev) => { const next = !prev; localStorage.setItem(DARK_KEY, String(next)); return next; });
  }, []);

  const maskedDestination = useMemo(() => {
    const id = form.identifier.trim();
    if (!id) return "";
    if (id.includes("@")) { const [name, domain] = id.split("@"); return `${name.slice(0, 2)}***@${domain}`; }
    const compact = id.replace(/\s/g, "");
    return `${compact.slice(0, 4)}****${compact.slice(-2)}`;
  }, [form.identifier]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setGlobalError("");
  };

  const simulateRequest = (ms = 900) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const handleNetworkGuard = () => {
    if (offline) { setGlobalError(mapErrorToMicrocopy("NETWORK_OFFLINE")); return false; }
    return true;
  };

  const goToLandingByRole = (role) => {
    localStorage.setItem("user", JSON.stringify({ role, identifier: form.identifier }));
    if (role === "provider") { navigate("/provider/onboarding"); return; }
    navigate("/");
  };

  const changeStep = (newStep) => {
    const allSteps = Object.values(STEPS);
    const oldIdx = allSteps.indexOf(step);
    const newIdx = allSteps.indexOf(newStep);
    setDirection(newIdx >= oldIdx ? "forward" : "backward");
    setGlobalError(""); setGlobalSuccess("");
    setStep(newStep);
  };

  // ===================== SUBMIT HANDLERS =====================
  const submitSignIn = async (e) => {
    e?.preventDefault();
    const identifierError = validateIdentifier(form.identifier);
    const errors = { identifier: identifierError, password: form.password ? "" : "Password is required." };
    setFieldErrors(errors);
    if (errors.identifier || errors.password || !handleNetworkGuard()) return;
    setLoading(true); setSlowNetwork(false); setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try { await simulateRequest(); goToLandingByRole(form.role); }
    catch { setGlobalError(mapErrorToMicrocopy("AUTH_LOGIN_FAILED")); }
    finally { window.clearTimeout(slowTimer); setLoading(false); setSlowNetwork(false); }
  };

  const requestOtp = async (targetStep) => {
    const identifierError = validateIdentifier(form.identifier);
    setFieldErrors({ identifier: identifierError });
    if (identifierError || !handleNetworkGuard()) return;
    setLoading(true); setSlowNetwork(false); setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try { await simulateRequest(); setOtpTimer(OTP_RESEND_SECONDS); setGlobalSuccess("OTP sent successfully."); changeStep(targetStep); }
    catch { setGlobalError("Could not send OTP. Try again."); }
    finally { window.clearTimeout(slowTimer); setLoading(false); setSlowNetwork(false); }
  };

  const verifyOtpAndContinue = async (nextStep) => {
    const otpError = form.otp.length === 6 ? "" : "OTP must be 6 digits.";
    setFieldErrors({ otp: otpError });
    if (otpError || !handleNetworkGuard()) return;
    setLoading(true); setSlowNetwork(false); setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try {
      await simulateRequest();
      setGlobalSuccess("OTP verified.");
      setForm((prev) => ({ ...prev, otp: "" }));
      if (nextStep === STEPS.ACCOUNT_CREATED) goToLandingByRole(form.role);
      else changeStep(nextStep);
    } catch { setGlobalError(mapErrorToMicrocopy("AUTH_OTP_INVALID")); }
    finally { window.clearTimeout(slowTimer); setLoading(false); setSlowNetwork(false); }
  };

  const submitRegisterBasics = async (e) => {
    e?.preventDefault();
    const identifierError = validateIdentifier(form.identifier);
    const errors = {
      fullName: form.fullName.trim() ? "" : "Full name is required.",
      identifier: identifierError,
      password: form.password.length >= 8 ? "" : "At least 8 characters required.",
      confirmPassword: form.password === form.confirmPassword ? "" : "Passwords don't match.",
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean) || !handleNetworkGuard()) return;
    await requestOtp(STEPS.OTP_SIGNUP);
  };

  const submitConsent = async () => {
    if (!form.termsAccepted) { setGlobalError("Accept Terms and Privacy to continue."); return; }
    if (!handleNetworkGuard()) return;
    setLoading(true); setSlowNetwork(false); setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try { await simulateRequest(); changeStep(STEPS.ACCOUNT_CREATED); setTimeout(() => goToLandingByRole(form.role), 2000); }
    finally { window.clearTimeout(slowTimer); setLoading(false); setSlowNetwork(false); }
  };

  // ===================== ANIMATION =====================
  const animClass = direction === "forward" ? "step-slide-right" : "step-slide-left";

  // Input styling helper
  const inputWrap = "relative";
  const inputBase = "w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 input-glow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400";
  const inputOk = "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900";
  const inputErr = "border-red-300 dark:border-red-600 focus:ring-red-100 dark:focus:ring-red-900 bg-red-50/50 dark:bg-red-900/10";
  const iconBase = "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  const isSignInOrWelcome = step === STEPS.WELCOME || step === STEPS.SIGN_IN;
  const isRegister = step === STEPS.REGISTER_BASICS;

  // Hero content per state
  const heroContent = useMemo(() => {
    if (isRegister) return {
      badge: "Join 50,000+ users",
      title: "Start finding trusted services today",
      subtitle: "Create your free SureLink account and connect with verified professionals in your area.",
      stats: [
        { icon: "users", value: "50K+", label: "Active users" },
        { icon: "star", value: "4.9", label: "Average rating" },
        { icon: "globe", value: "100+", label: "Service areas" },
      ],
    };
    return {
      badge: "Welcome back",
      title: "Your trusted marketplace for local services",
      subtitle: "Sign in to access verified professionals, manage bookings, and grow your business.",
      stats: [
        { icon: "shield-check", value: "100%", label: "Verified pros" },
        { icon: "zap", value: "<5 min", label: "Avg. match time" },
        { icon: "star", value: "4.9★", label: "User rating" },
      ],
    };
  }, [isRegister]);

  // ===================== RENDER =====================
  return (
    <div className="font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen antialiased">
      <style>{`
        @keyframes slideRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideLeft  { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp     { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake      { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes float      { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-dot  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .step-slide-right { animation: slideRight 0.35s ease-out forwards; }
        .step-slide-left  { animation: slideLeft 0.35s ease-out forwards; }
        .step-fade-up     { animation: fadeUp 0.4s ease-out forwards; }
        .field-error-shake { animation: shake 0.35s ease-in-out; }
        .float-anim       { animation: float 6s ease-in-out infinite; }
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(58,154,255,0.12); }
        .glass-card { background: rgba(255,255,255,0.08); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.15); }
        .dark .glass-card { background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.08); }
        .hero-gradient { background: linear-gradient(135deg, #0057FF 0%, #3A9AFF 50%, #7CC4FF 100%); }
        .hero-gradient-dark { background: linear-gradient(135deg, #0A1628 0%, #0F2847 50%, #132E4F 100%); }
        .social-btn { transition: all 0.15s ease; }
        .social-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .social-btn:active { transform: translateY(0); }
      `}</style>

      {/* Dark mode toggle - floating */}
      <button
        onClick={toggleDark}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm"
        aria-label="Toggle dark mode"
      >
        {dark ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}
      </button>

      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ===== LEFT - HERO PANEL ===== */}
        <div className={`hidden lg:flex lg:w-[48%] xl:w-[45%] relative overflow-hidden ${dark ? "hero-gradient-dark" : "hero-gradient"}`}>
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 float-anim" />
          <div className="absolute bottom-20 -right-16 w-48 h-48 rounded-full bg-white/5 float-anim" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-white/5 float-anim" style={{ animationDelay: "4s" }} />

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
            {/* Logo */}
            <div>
              <span className="text-2xl font-extrabold tracking-tight">SureLink</span>
            </div>

            {/* Main content */}
            <div className="space-y-8 step-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest glass-card">
                <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse-dot 2s infinite" }} />
                {heroContent.badge}
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
                {heroContent.title}
              </h1>

              <p className="text-lg text-blue-100 dark:text-blue-200/70 leading-relaxed max-w-lg">
                {heroContent.subtitle}
              </p>

              {/* Stats */}
              <div className="flex gap-6 pt-2">
                {heroContent.stats.map((s) => (
                  <div key={s.label} className="glass-card rounded-xl px-5 py-4 text-center min-w-[100px]">
                    <div className="text-2xl font-extrabold mb-0.5">{s.value}</div>
                    <div className="text-xs text-blue-200 dark:text-blue-300/60 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="glass-card rounded-xl p-5 mt-auto">
              <div className="flex items-center gap-1.5 mb-2">
                {[1,2,3,4,5].map((i) => <Icon key={i} name="star" size={14} className="text-amber-400" />)}
              </div>
              <p className="text-sm text-blue-100 dark:text-blue-200/70 italic leading-relaxed">
                "SureLink connected me with a verified plumber in under 10 minutes. The trust factor is real — I could see their ratings, reviews, and ID verification badge."
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">AK</div>
                <div>
                  <div className="text-sm font-semibold">Ama K.</div>
                  <div className="text-xs text-blue-200 dark:text-blue-300/50">Accra, Ghana</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT - FORM PANEL ===== */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[440px] mx-auto">
            
            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <span className="text-2xl font-extrabold tracking-tight text-brand-500">SureLink</span>
            </div>

            {/* Offline Banner */}
            {offline && (
              <div className="mb-5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3.5 text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Icon name="wifi-off" size={16} className="shrink-0" />
                No internet connection.
              </div>
            )}

            {/* Status banners */}
            {slowNetwork && <div className="mb-4"><FeedbackBanner type="warning" message="Network is slow. Hold on…" /></div>}
            {globalError && <div className="mb-4"><FeedbackBanner type="error" message={globalError} onRetry={() => setGlobalError("")} /></div>}
            {globalSuccess && <div className="mb-4"><FeedbackBanner type="success" message={globalSuccess} /></div>}

            {/* ===== WELCOME ===== */}
            {step === STEPS.WELCOME && (
              <div className={`space-y-6 ${animClass}`} key="welcome">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Get started</h2>
                  <p className="text-gray-500 dark:text-gray-400">Sign in or create an account to continue.</p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button type="button" className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <i className="fab fa-apple text-lg"></i>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">or</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <AuthButton onClick={() => changeStep(STEPS.SIGN_IN)}>Sign in with email</AuthButton>
                <AuthButton variant="secondary" onClick={() => changeStep(STEPS.REGISTER_BASICS)}>Create account</AuthButton>
                <div className="text-center">
                  <p className="text-xs text-gray-400">By continuing, you agree to our <button className="text-brand-500 hover:underline font-medium">Terms</button> and <button className="text-brand-500 hover:underline font-medium">Privacy Policy</button>.</p>
                </div>
              </div>
            )}

            {/* ===== SIGN IN ===== */}
            {step === STEPS.SIGN_IN && (
              <div className={animClass} key="signin">
                <div className="mb-7">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h2>
                  <p className="text-gray-500 dark:text-gray-400">Enter your details to sign in.</p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button type="button" disabled={loading} className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition">
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button type="button" disabled={loading} className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition">
                    <i className="fab fa-apple text-lg"></i>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">or</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <form onSubmit={submitSignIn} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="signin-id" className="block text-sm font-semibold mb-1.5">Email or phone</label>
                    <div className={inputWrap}>
                      <Icon name="mail" size={16} className={iconBase} />
                      <input id="signin-id" type="text" placeholder="you@example.com" value={form.identifier} disabled={loading}
                        onChange={(e) => updateField("identifier", e.target.value)}
                        className={`${inputBase} ${fieldErrors.identifier ? inputErr : inputOk}`} />
                    </div>
                    {fieldErrors.identifier && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.identifier}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="signin-pw" className="text-sm font-semibold">Password</label>
                      <button type="button" className="text-xs text-brand-500 hover:underline font-semibold">Forgot?</button>
                    </div>
                    <div className={inputWrap}>
                      <Icon name="lock" size={16} className={iconBase} />
                      <input id="signin-pw" type={showPassword ? "text" : "password"} placeholder="Enter password" value={form.password} disabled={loading}
                        onChange={(e) => updateField("password", e.target.value)}
                        className={`${inputBase} !pr-11 ${fieldErrors.password ? inputErr : inputOk}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
                      </button>
                    </div>
                    {fieldErrors.password && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.password}</p>}
                  </div>

                  <AuthButton type="submit" loading={loading} disabled={loading}>
                    Sign in
                  </AuthButton>
                </form>

                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-center gap-1">
                  <button type="button" className="text-brand-500 hover:underline font-medium" onClick={() => requestOtp(STEPS.OTP_SIGN_IN)}>
                    Use OTP instead
                  </button>
                  <span>·</span>
                  <span>Don't have an account?</span>
                  <button type="button" className="text-brand-500 hover:underline font-semibold" onClick={() => changeStep(STEPS.REGISTER_BASICS)}>
                    Sign up
                  </button>
                </div>
              </div>
            )}

            {/* ===== OTP ===== */}
            {(step === STEPS.OTP_SIGN_IN || step === STEPS.OTP_SIGNUP) && (
              <div className={animClass} key="otp">
                <div className="mb-7">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Verify your identity</h2>
                  <p className="text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to <span className="font-semibold text-gray-900 dark:text-gray-100">{maskedDestination || "your device"}</span>.</p>
                </div>

                <div className="space-y-5">
                  <OtpInputGroup value={form.otp} onChange={(value) => updateField("otp", value)} disabled={loading} />
                  {fieldErrors.otp && <p className="text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.otp}</p>}
                  
                  <AuthButton onClick={() => verifyOtpAndContinue(step === STEPS.OTP_SIGN_IN ? STEPS.ACCOUNT_CREATED : STEPS.ROLE_SELECTION)} loading={loading} disabled={loading}>
                    {step === STEPS.OTP_SIGN_IN ? "Verify & sign in" : "Verify"}
                  </AuthButton>

                  <div className="flex justify-between text-sm">
                    <button type="button" className="text-brand-500 hover:underline font-medium" onClick={() => changeStep(step === STEPS.OTP_SIGN_IN ? STEPS.SIGN_IN : STEPS.REGISTER_BASICS)}>
                      ← Change details
                    </button>
                    <button type="button" className="text-brand-500 hover:underline font-medium disabled:text-gray-400" disabled={otpTimer > 0 || loading} onClick={() => requestOtp(step)}>
                      {otpTimer > 0 ? `Resend 0:${String(otpTimer).padStart(2, "0")}` : "Resend code"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== REGISTER ===== */}
            {step === STEPS.REGISTER_BASICS && (
              <div className={animClass} key="register">
                <div className="mb-7">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Create your account</h2>
                  <p className="text-gray-500 dark:text-gray-400">Join thousands of trusted users on SureLink.</p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button type="button" disabled={loading} className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition">
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button type="button" disabled={loading} className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition">
                    <i className="fab fa-apple text-lg"></i>
                    <span>Apple</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">or</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <form onSubmit={submitRegisterBasics} className="space-y-4">
                  {/* Full name */}
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-semibold mb-1.5">Full name</label>
                    <div className={inputWrap}>
                      <Icon name="user" size={16} className={iconBase} />
                      <input id="reg-name" type="text" placeholder="Kofi Mensah" value={form.fullName} disabled={loading}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className={`${inputBase} ${fieldErrors.fullName ? inputErr : inputOk}`} />
                    </div>
                    {fieldErrors.fullName && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.fullName}</p>}
                  </div>

                  {/* Email/Phone */}
                  <div>
                    <label htmlFor="reg-id" className="block text-sm font-semibold mb-1.5">Email or phone</label>
                    <div className={inputWrap}>
                      <Icon name="mail" size={16} className={iconBase} />
                      <input id="reg-id" type="text" placeholder="you@example.com" value={form.identifier} disabled={loading}
                        onChange={(e) => updateField("identifier", e.target.value)}
                        className={`${inputBase} ${fieldErrors.identifier ? inputErr : inputOk}`} />
                    </div>
                    {fieldErrors.identifier && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.identifier}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="reg-pw" className="block text-sm font-semibold mb-1.5">Password</label>
                    <div className={inputWrap}>
                      <Icon name="lock" size={16} className={iconBase} />
                      <input id="reg-pw" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} disabled={loading}
                        onChange={(e) => updateField("password", e.target.value)}
                        className={`${inputBase} !pr-11 ${fieldErrors.password ? inputErr : inputOk}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                    {fieldErrors.password && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.password}</p>}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label htmlFor="reg-cpw" className="block text-sm font-semibold mb-1.5">Confirm password</label>
                    <div className={inputWrap}>
                      <Icon name="lock" size={16} className={iconBase} />
                      <input id="reg-cpw" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" value={form.confirmPassword} disabled={loading}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className={`${inputBase} !pr-11 ${fieldErrors.confirmPassword ? inputErr : inputOk}`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={16} />
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake"><AuthIcon name="alert-circle" size={12}/>{fieldErrors.confirmPassword}</p>}
                  </div>

                  <AuthButton type="submit" loading={loading} disabled={loading}>
                    Create account
                  </AuthButton>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <button type="button" className="text-brand-500 hover:underline font-semibold" onClick={() => changeStep(STEPS.SIGN_IN)}>Sign in</button>
                </p>
              </div>
            )}

            {/* ===== ROLE SELECTION ===== */}
            {step === STEPS.ROLE_SELECTION && (
              <div className={`space-y-5 ${animClass}`} key="role">
                <div className="mb-2">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">How will you use SureLink?</h2>
                  <p className="text-gray-500 dark:text-gray-400">You can always change this later.</p>
                </div>
                <RoleCard
                  title="I need services"
                  description="Find and book verified local professionals."
                  icon={<Icon name="user" size={22} className="text-brand-500" />}
                  selected={form.role === "consumer"}
                  disabled={loading}
                  onClick={() => updateField("role", "consumer")}
                />
                <RoleCard
                  title="I provide services"
                  description="List your services and connect with customers."
                  icon={<Icon name="briefcase" size={22} className="text-brand-500" />}
                  selected={form.role === "provider"}
                  disabled={loading}
                  onClick={() => updateField("role", "provider")}
                />
                <AuthButton onClick={() => changeStep(STEPS.CONSENT)}>
                  <span>Continue</span>
                  <Icon name="arrow-right" size={16} />
                </AuthButton>
              </div>
            )}

            {/* ===== CONSENT ===== */}
            {step === STEPS.CONSENT && (
              <div className={`space-y-5 ${animClass}`} key="consent">
                <div className="mb-2">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Almost there</h2>
                  <p className="text-gray-500 dark:text-gray-400">Review and accept to finish.</p>
                </div>
                <ConsentRow id="terms" checked={form.termsAccepted} disabled={loading} onChange={(c) => updateField("termsAccepted", c)}>
                  I agree to the <span className="text-brand-500 font-semibold">Terms of Service</span> and <span className="text-brand-500 font-semibold">Privacy Policy</span>.
                </ConsentRow>
                <ConsentRow id="marketing" checked={form.marketingOptIn} disabled={loading} onChange={(c) => updateField("marketingOptIn", c)}>
                  Send me product updates and offers (optional).
                </ConsentRow>
                <AuthButton onClick={submitConsent} loading={loading} disabled={loading || !form.termsAccepted}>
                  Create account
                </AuthButton>
              </div>
            )}

            {/* ===== ACCOUNT CREATED ===== */}
            {step === STEPS.ACCOUNT_CREATED && (
              <div className="text-center space-y-5 py-8 step-fade-up" key="created">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                  <Icon name="check-circle" size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">You're all set!</h2>
                <p className="text-gray-500 dark:text-gray-400">Setting up your experience…</p>
                {form.role === "provider" && (
                  <div className="rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 p-4 text-sm text-brand-700 dark:text-brand-400">
                    Next: Complete your provider profile to start getting requests.
                  </div>
                )}
              </div>
            )}

            {/* Trust badges - shown on sign in / register */}
            {(isSignInOrWelcome || isRegister) && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-5 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Icon name="lock" size={12} />
                  <span>256-bit SSL</span>
                </div>
                <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  <Icon name="shield-check" size={12} />
                  <span>GDPR Ready</span>
                </div>
                <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={12} />
                  <span>Verified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
