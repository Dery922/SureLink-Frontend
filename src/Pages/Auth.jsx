import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Link,
  Router,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AuthButton,
  AuthIcon,
  ConsentRow,
  FeedbackBanner,
  OtpInputGroup,
  RoleCard,
} from "../components/auth/AuthComponents";
import api from "../APIs/api";
import ProviderOnboarding from "./ProviderOnboardingGate";
import { useDispatch, useSelector } from "react-redux";
import SaturnContactMenu from "../components/SaturnContactMenu";
import {
  loginSuccess,
  loginFailure,
  loginStart,
  setInitializingFalse,
} from "../redux/features/auth/authSlice";
import BulkPurchasingSection from "./BulkPurchasingSection";
import CookieConsentEnhanced from "../components/CookieConsent";

// ===================== CONSTANTS =====================
const STEPS = {
  WELCOME: "welcome",
  SIGN_IN: "sign_in",
  REGISTER_BASICS: "register_basics",
  OTP_SIGN_IN: "otp_sign_in",
  OTP_SIGNUP: "otp_signup",
  ROLE_SELECTION: "role_selection",

  // 🔑 PLACE IT HERE: After role selection, before terms consent!
  PROVIDER_PROFILE: "provider_profile",
  CUSTOMER_PROFILE: "customer_profile",

  TERMS_CONSENT: "terms_consent",
  ACCOUNT_CREATED: "account_created",
};

const OTP_RESEND_SECONDS = 30;
const DARK_KEY = "surelink_dark";

// ===================== INLINE ICON =====================
const Icon = ({ name, className = "", size = 16 }) => {
  const icons = {
    moon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    sun: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    user: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    briefcase: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    "check-circle": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),
    eye: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    "eye-off": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    ),
    mail: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    lock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    "shield-check": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        className={className}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    zap: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    users: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    globe: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    "wifi-off": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
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
  const colors = [
    "bg-red-500",
    "bg-amber-500",
    "bg-brand-500",
    "bg-emerald-500",
  ];
  const label = labels[score - 1] || "Too short";
  const color = colors[score - 1] || "bg-gray-300";

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? color : "bg-gray-200 dark:bg-gray-700"}`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${score >= 3 ? "text-emerald-600 dark:text-emerald-400" : score >= 2 ? "text-amber-600 dark:text-amber-400" : "text-red-500"}`}
      >
        {label}
      </p>
    </div>
  );
}

// ===================== GOOGLE ICON (COLORED) =====================
function GoogleIcon({ size = 18 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
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
    AUTH_LOGIN_FAILED:
      "We couldn't sign you in. Check your details and try again.",
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
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inside your Auth Component wrapper:
  const dispatch = useDispatch();
  // 4. Evaluate routing steps using the precise dynamic states
  // 4. Evaluate routing steps using precise onboarding states
  // const isOnboardingComplete = user?.onboarding?.completed === true;
  // const currentStepInDb = user?.onboarding?.current_step;
  // const userRole = user?.roles || form.role;

  const [form, setForm] = useState({
    identifier: "", // phone or email
    fullName: "", // required for signup
    otp: "",
    role: "customer",
  });

  // ===================== EFFECTS =====================
  useEffect(() => {
    const saved = localStorage.getItem(DARK_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
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
    if (location.pathname === "/login" || location.pathname === "/signin")
      setStep(STEPS.SIGN_IN);
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
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useEffect(() => {
    if (!otpTimer) return undefined;
    const id = window.setInterval(
      () => setOtpTimer((prev) => Math.max(0, prev - 1)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [otpTimer]);

  // ===================== DARK MODE =====================
  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem(DARK_KEY, String(next));
      return next;
    });
  }, []);

  const maskedDestination = useMemo(() => {
    const id = form.identifier.trim();
    if (!id) return "";
    if (id.includes("@")) {
      const [name, domain] = id.split("@");
      return `${name.slice(0, 2)}***@${domain}`;
    }
    const compact = id.replace(/\s/g, "");
    return `${compact.slice(0, 4)}****${compact.slice(-2)}`;
  }, [form.identifier]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setGlobalError("");
  };

  const simulateRequest = (ms = 900) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const handleNetworkGuard = () => {
    if (offline) {
      setGlobalError(mapErrorToMicrocopy("NETWORK_OFFLINE"));
      return false;
    }
    return true;
  };

  //return base on user type during registration
  // 🚀 FIX: Preserve the full user object in localStorage instead of erasing it
  const goToLandingByRole = (role) => {
    // Read whatever full database profile fields we have saved
    const storedUserString = localStorage.getItem("user");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : {};

    // 🚀 MERGE details together cleanly without erasing database sub-properties
    const mergedUserPayload = {
      ...storedUser,
      role: role,
      type: role, // Sync both fields to avoid lookup errors
      identifier: form.identifier,
    };

    localStorage.setItem("user", JSON.stringify(mergedUserPayload));
    dispatch(loginSuccess(mergedUserPayload)); // Update Redux instantly!

    if (role === "provider") {
      navigate("/provider/onboarding");
      return;
    } else if (role === "customer") {
      navigate("/customer/onboarding");
      return;
    }
    navigate("/");
  };

  const changeStep = (newStep) => {
    const allSteps = Object.values(STEPS);
    const oldIdx = allSteps.indexOf(step);
    const newIdx = allSteps.indexOf(newStep);
    setDirection(newIdx >= oldIdx ? "forward" : "backward");
    setGlobalError("");
    setGlobalSuccess("");
    setStep(newStep);
  };

  //role selection function starts here
  const submitRoleSelection = async () => {
    if (!form.role) {
      setGlobalError("Please select an account type.");
      return;
    }

    try {
      setLoading(true);
      setGlobalError("");

      const res = await api.post(
        "/auth/select-role",
        {
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const { next_step } = res.data.data;

      if (next_step === "provider_profile") {
        goToLandingByRole("provider");
      } else if (next_step === "customer_profile") {
        goToLandingByRole("customer");
      } else if (next_step === "terms_consent") {
        changeStep(STEPS.TERMS_CONSENT);
      }
    } catch (error) {
      console.error(error);

      setGlobalError(
        error.response?.data?.message || "Failed to save account type.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitSignIn = async (e) => {
    e?.preventDefault();
    const identifierError = validateIdentifier(form.identifier);
    setFieldErrors({ identifier: identifierError });

    if (identifierError || !handleNetworkGuard()) return;

    try {
      setLoading(true);
      setGlobalError("");

      const res = await api.post("/auth/request-otp", {
        identifier: form.identifier,
      });

      const { purpose, maskedIdentifier } = res.data;

      // store masked version for UI display
      setForm((prev) => ({
        ...prev,
        maskedIdentifier,
      }));

      setOtpTimer(60);

      // decide next step based on backend response
      if (purpose === "login") {
        changeStep(STEPS.OTP_SIGN_IN);
      } else {
        changeStep(STEPS.OTP_SIGNUP);
      }
    } catch (err) {
      setFieldErrors({
        general: "Unable to send OTP. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (targetStep) => {
    const identifierError = validateIdentifier(form.identifier);
    setFieldErrors({ identifier: identifierError });
    if (identifierError || !handleNetworkGuard()) return;
    if (isSubmitting) return; // Stop double-tap requests!

    setLoading(true);
    setSlowNetwork(false);
    setGlobalError("");
    setIsSubmitting(true);

    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);

    try {
      // 💥 REPLACED MOCK WITH ACTIVE AXIOS HTTP DISPATCH
      const res = await api.post("/auth/request-otp", {
        identifier: form.identifier,
        type: targetStep === STEPS.OTP_SIGNUP ? "signup" : "login",
      });

      // Track dynamic context parameters from backend response
      const { purpose } = res.data;

      setOtpTimer(OTP_RESEND_SECONDS);
      setGlobalSuccess("A verification code was dispatched successfully.");

      // Update state path safely based on what back-end reports
      if (purpose === "login" || targetStep === STEPS.OTP_SIGN_IN) {
        changeStep(STEPS.OTP_SIGN_IN);
      } else {
        changeStep(STEPS.OTP_SIGNUP);
      }
    } catch (error) {
      console.error("OTP Dispatch Failure:", error);
      setGlobalError(
        error.response?.data?.message ||
          "Could not send verification code. Please retry.",
      );
    } finally {
      window.clearTimeout(slowTimer);
      setLoading(false);
      setSlowNetwork(false);
      setIsSubmitting(false);
    }
  };

  const verifyOtpAndContinue = async (nextStep) => {
    const otpError =
      form.otp && form.otp.trim().length === 6
        ? ""
        : "OTP must be exactly 6 digits.";
    setFieldErrors({ otp: otpError });
    if (otpError || !handleNetworkGuard()) return;

    try {
      setLoading(true);
      dispatch(loginStart());

      const res = await api.post("/auth/verify-otp", {
        identifier: form.identifier,
        otp: form.otp.trim(),
      });

      const { user_state, session, user } = res.data.data;
      console.log("Verified User Profile Object:", user);

      if (session?.token) {
        localStorage.setItem("authToken", session.token);
        localStorage.setItem("user", JSON.stringify(user));

        // 🚀 THE STICKY FIX: Explicitly clone the object so Redux DevTools can capture the state transition cleanly
        const freshUserPayload = JSON.parse(JSON.stringify(user));

        console.log(
          "✈️ SENDING DATA DIRECTLY TO REDUX ACTION:",
          freshUserPayload,
        );
        dispatch(loginSuccess(freshUserPayload));

        api.defaults.headers.common["Authorization"] =
          `Bearer ${session.token}`;
      }

      setForm((prev) => ({ ...prev, otp: "" }));

      const isOnboardingComplete = user?.onboarding?.completed === true;
      const currentStepInDb = user?.onboarding?.current_step;
      const userRole = user?.role || user?.type || form.role;

      if (!isOnboardingComplete) {
        console.log(`Trap activated. Resuming at: ${currentStepInDb}`);

        if (currentStepInDb === "terms_consent") {
          changeStep(STEPS.TERMS_CONSENT);
        } else if (currentStepInDb === "provider_profile") {
          goToLandingByRole("provider");
        } else {
          changeStep(STEPS.ROLE_SELECTION);
        }
      } else {
        if (nextStep === STEPS.ACCOUNT_CREATED) {
          goToLandingByRole(userRole);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(loginFailure());
      setGlobalError(
        error.response?.data?.message || "Invalid validation code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitTermsConsent = async () => {
    try {
      setLoading(true);

      // 1. Call your API endpoint that saves their terms agreement
      const res = await api.post(
        "/auth/accept-terms",
        {}, // 🔑 Empty body payload data (Second argument)
        {
          headers: {
            // 🔑 Actual request configurations (Third argument)
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      const confirmedRole = res.data.data?.role || user?.role || user?.type;

      // 2. 🔑 Split navigation logic based on user type!
      if (confirmedRole === "provider") {
        goToLandingByRole("provider");
      } else if (confirmedRole === "customer") {
        goToLandingByRole("customer");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setGlobalError("Could not save terms consent verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setGlobalError("");

      await api.post("/auth/request-otp", {
        identifier: form.identifier,
      });

      setGlobalSuccess("A fresh verification code has been dispatched.");

      // 🔑 THE FIX: Reset the countdown timer back to 60 seconds on successful resend!
      setOtpTimer(60);
    } catch (err) {
      setGlobalError("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===================== ANIMATION =====================
  const animClass =
    direction === "forward" ? "step-slide-right" : "step-slide-left";

  // Input styling helper
  const inputWrap = "relative";
  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 input-glow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400";
  const inputOk =
    "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900";
  const inputErr =
    "border-red-300 dark:border-red-600 focus:ring-red-100 dark:focus:ring-red-900 bg-red-50/50 dark:bg-red-900/10";
  const iconBase =
    "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  const isSignInOrWelcome = step === STEPS.WELCOME || step === STEPS.SIGN_IN;
  const isRegister = step === STEPS.REGISTER_BASICS;

  // Hero content per state
  const heroContent = useMemo(() => {
    if (isRegister)
      return {
        badge: "Join 50,000+ users",
        title: "Start finding trusted services today",
        subtitle:
          "Create your free SureLink account and connect with verified professionals in your area.",
        stats: [
          { icon: "users", value: "50K+", label: "Active users" },
          { icon: "star", value: "4.9", label: "Average rating" },
          { icon: "globe", value: "100+", label: "Service areas" },
        ],
      };
    return {
      badge: "Welcome back",
      title: "Your trusted marketplace for local services",
      subtitle:
        "Sign in to access verified professionals, manage bookings, and grow your business.",
      stats: [
        { icon: "shield-check", value: "100%", label: "Verified pros" },
        { icon: "zap", value: "<5 min", label: "Avg. match time" },
        { icon: "star", value: "4.9★", label: "User rating" },
      ],
    };
  }, [isRegister]);

  // ===================== RENDER =====================
  return (
    <>
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
          {dark ? (
            <Icon name="sun" size={16} />
          ) : (
            <Icon name="moon" size={16} />
          )}
        </button>
        <CookieConsentEnhanced />

        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* ===== LEFT - HERO PANEL ===== */}
          <div
            className={`hidden lg:flex lg:w-[48%] xl:w-[45%] relative overflow-hidden ${dark ? "hero-gradient-dark" : "hero-gradient"}`}
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 float-anim" />
            <div
              className="absolute bottom-20 -right-16 w-48 h-48 rounded-full bg-white/5 float-anim"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-white/5 float-anim"
              style={{ animationDelay: "4s" }}
            />

            <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
              {/* Logo */}
              <div>
                <Link to="/">
                  <span className="text-2xl font-extrabold tracking-tight">
                    SureLink
                  </span>
                </Link>
              </div>

              {/* Main content */}
              <div className="space-y-8 step-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest glass-card">
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    style={{ animation: "pulse-dot 2s infinite" }}
                  />
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
                    <div
                      key={s.label}
                      className="glass-card rounded-xl px-5 py-4 text-center min-w-[100px]"
                    >
                      <div className="text-2xl font-extrabold mb-0.5">
                        {s.value}
                      </div>
                      <div className="text-xs text-blue-200 dark:text-blue-300/60 font-medium">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="glass-card rounded-xl p-5 mt-auto">
                <div className="flex items-center gap-1.5 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={14}
                      className="text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-blue-100 dark:text-blue-200/70 italic leading-relaxed">
                  "SureLink connected me with a verified plumber in under 10
                  minutes. The trust factor is real — I could see their ratings,
                  reviews, and ID verification badge."
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    AK
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Ama K.</div>
                    <div className="text-xs text-blue-200 dark:text-blue-300/50">
                      Accra, Ghana
                    </div>
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
                <span className="text-2xl font-extrabold tracking-tight text-brand-500">
                  SureLink
                </span>
              </div>

              {/* Offline Banner */}
              {offline && (
                <div className="mb-5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3.5 text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Icon name="wifi-off" size={16} className="shrink-0" />
                  No internet connection.
                </div>
              )}

              {/* Status banners */}
              {slowNetwork && (
                <div className="mb-4">
                  <FeedbackBanner
                    type="warning"
                    message="Network is slow. Hold on…"
                  />
                </div>
              )}
              {globalError && (
                <div className="mb-4">
                  <FeedbackBanner
                    type="error"
                    message={globalError}
                    onRetry={() => setGlobalError("")}
                  />
                </div>
              )}
              {globalSuccess && (
                <div className="mb-4">
                  <FeedbackBanner type="success" message={globalSuccess} />
                </div>
              )}

              {/* ===== WELCOME ===== */}
              {step === STEPS.WELCOME && (
                <div className={`space-y-6 ${animClass}`} key="welcome">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                      Get started
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Sign in or create an account to continue.
                    </p>
                  </div>

                  {/* Social login */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <GoogleIcon />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <i className="fab fa-apple text-lg"></i>
                      <span>Apple</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                      or
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <AuthButton onClick={() => changeStep(STEPS.SIGN_IN)}>
                    Sign in with email or phone
                  </AuthButton>
                  <AuthButton
                    variant="secondary"
                    onClick={() => changeStep(STEPS.REGISTER_BASICS)}
                  >
                    Create account
                  </AuthButton>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      By continuing, you agree to our{" "}
                      <button className="text-brand-500 hover:underline font-medium">
                        Terms
                      </button>{" "}
                      and{" "}
                      <button className="text-brand-500 hover:underline font-medium">
                        Privacy Policy
                      </button>
                      .
                    </p>
                  </div>
                </div>
              )}

              {/* ===== SIGN IN ===== */}
              {step === STEPS.SIGN_IN && (
                <div className={animClass} key="signin">
                  <div className="mb-7">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                      Welcome back
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter your details to sign in.
                    </p>
                  </div>

                  {/* Social login */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      disabled={loading}
                      className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      <GoogleIcon />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      <i className="fab fa-apple text-lg"></i>
                      <span>Apple</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                      or
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>
                  {/*  Sign in form*/}
                  <form onSubmit={submitSignIn} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="signin-id"
                        className="block text-sm font-semibold mb-1.5"
                      >
                        {" "}
                        Phone Or Email
                      </label>
                      <div className={inputWrap}>
                        <Icon name="" size={16} className={iconBase} />
                        <Icon name="globe" size={16} className={iconBase} />
                        <input
                          id="signin-id"
                          type="text"
                          placeholder="you@examble.com"
                          value={form.identifier}
                          disabled={loading}
                          onChange={(e) =>
                            updateField("identifier", e.target.value)
                          }
                          className={`${inputBase} ${fieldErrors.identifier ? inputErr : inputOk}`}
                        />
                      </div>
                      {fieldErrors.identifier && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake">
                          <AuthIcon name="alert-circle" size={12} />
                          {fieldErrors.identifier}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div></div>

                    <AuthButton
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Sign in
                    </AuthButton>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-center gap-1">
                    <button
                      type="button"
                      className="text-brand-500 hover:underline font-medium"
                      onClick={() => requestOtp(STEPS.OTP_SIGN_IN)}
                    >
                      Continue
                    </button>
                    <span>·</span>
                    <span>Don't have an account?</span>
                    <button
                      type="button"
                      className="text-brand-500 hover:underline font-semibold"
                      onClick={() => changeStep(STEPS.REGISTER_BASICS)}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              )}

              {/* ===== OTP ===== */}
              {(step === STEPS.OTP_SIGN_IN || step === STEPS.OTP_SIGNUP) && (
                <div className={animClass} key="otp">
                  <div className="mb-7">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                      Verify your identity
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter the 6-digit code sent to{" "}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {maskedDestination || "your device"}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="space-y-5">
                    <OtpInputGroup
                      value={form.otp}
                      onChange={(value) => updateField("otp", value)}
                      disabled={loading}
                    />
                    {fieldErrors.otp && (
                      <p className="text-xs text-red-500 flex items-center gap-1 field-error-shake">
                        <AuthIcon name="alert-circle" size={12} />
                        {fieldErrors.otp}
                      </p>
                    )}

                    <AuthButton
                      onClick={() =>
                        verifyOtpAndContinue(
                          step === STEPS.OTP_SIGN_IN
                            ? STEPS.ACCOUNT_CREATED
                            : STEPS.ROLE_SELECTION,
                        )
                      }
                      loading={loading}
                      disabled={loading}
                    >
                      {step === STEPS.OTP_SIGN_IN
                        ? "Verify & sign in"
                        : "Verify"}
                    </AuthButton>

                    <div className="flex justify-between text-sm">
                      <button
                        type="button"
                        className="text-brand-500 hover:underline font-medium"
                        onClick={() =>
                          changeStep(
                            step === STEPS.OTP_SIGN_IN
                              ? STEPS.SIGN_IN
                              : STEPS.REGISTER_BASICS,
                          )
                        }
                      >
                        ← Change details
                      </button>
                      <button
                        type="button"
                        className="text-brand-500 hover:underline font-medium disabled:text-gray-400"
                        disabled={otpTimer > 0 || loading}
                        onClick={() => requestOtp(step)}
                      >
                        {otpTimer > 0
                          ? `Resend 0:${String(otpTimer).padStart(2, "0")}`
                          : "Resend code"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== REGISTER ===== */}
              {step === STEPS.REGISTER_BASICS && (
                <div className={animClass} key="register">
                  <div className="mb-7">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                      Create your account
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Join thousands of trusted users on SureLink.
                    </p>
                  </div>

                  {/* Social login */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      disabled={loading}
                      className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      <GoogleIcon />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      <i className="fab fa-apple text-lg"></i>
                      <span>Apple</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                      or
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <form onSubmit={submitSignIn} className="space-y-4">
                    <div>
                      <label
                        htmlFor="reg-id"
                        className="block text-sm font-semibold mb-1.5"
                      >
                        Email or phone
                      </label>
                      <div className={inputWrap}>
                        <Icon name="mail" size={16} className={iconBase} />
                        <input
                          id="reg-id"
                          type="text"
                          placeholder="you@example.com"
                          value={form.identifier}
                          disabled={loading}
                          onChange={(e) =>
                            updateField("identifier", e.target.value)
                          }
                          className={`${inputBase} ${fieldErrors.identifier ? inputErr : inputOk}`}
                        />
                      </div>
                      {fieldErrors.identifier && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 field-error-shake">
                          <AuthIcon name="alert-circle" size={12} />
                          {fieldErrors.identifier}
                        </p>
                      )}
                    </div>

                    <AuthButton
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Create account
                    </AuthButton>
                  </form>

                  <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-brand-500 hover:underline font-semibold"
                      onClick={() => changeStep(STEPS.SIGN_IN)}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}

              {/* ===================== NEW CODE PATH: ROLE SELECTION STEP ===================== */}
              {step === STEPS.ROLE_SELECTION && (
                <div className={animClass} key="role_selection">
                  <div className="mb-7">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                      Select Account Type
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Choose how you want to configure your profile footprint.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Customer Profile Selection */}
                    <button
                      type="button"
                      onClick={() => updateField("role", "customer")}
                      className={`w-full p-4 rounded-xl border text-left transition ${
                        form.role === "customer"
                          ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        Customer Account
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        I want to browse and request verified services.
                      </div>
                    </button>

                    {/* Option 2: Service Provider Profile Selection */}
                    <button
                      type="button"
                      onClick={() => updateField("role", "provider")}
                      className={`w-full p-4 rounded-xl border text-left transition ${
                        form.role === "provider"
                          ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        Task Provider / Specialist
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        I want to list skills, complete jobs, or fulfill orders.
                      </div>
                    </button>
                  </div>

                  {/* Submit Consent Routing Trigger */}
                  <div className="mt-6">
                    <AuthButton
                      onClick={submitRoleSelection}
                      loading={loading}
                      disabled={loading}
                    >
                      Continue
                    </AuthButton>
                  </div>
                </div>
              )}

              {/* ===================== NEW CODE PATH: TERMS CONSENT STEP ===================== */}
              {step === STEPS.TERMS_CONSENT && (
                <div className={animClass} key="terms_consent">
                  <div className="mb-7">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                      Operational Guidelines
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Accept platform conditions to access your registration
                      dashboard.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {/* Example form wrapper around your terms section layout */}
                    <form onSubmit={submitTermsConsent} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="terms-check"
                          checked={form.termsAccepted || false}
                          onChange={(e) =>
                            updateField("termsAccepted", e.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="terms-check"
                          className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
                        >
                          I agree to the SureLink Terms of Service and Privacy
                          Policy. I recognize that my profile data updates will
                          undergo secure processing.
                        </label>
                      </div>

                      {/* 🔑 Connect the button actions */}
                      <button
                        type="submit"
                        onClick={submitTermsConsent}
                        disabled={!form.termsAccepted || loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Accept & Continue"}
                      </button>
                    </form>
                  </div>

                  {/* <div className="mt-6">
                  <AuthButton 
                    disabled={!form.termsAccepted || loading} 
                    onClick={submitConsent}
                  >
                    Agree & Proceed
                  </AuthButton>
                </div> */}
                </div>
              )}
              {/* ===== ACCOUNT CREATED ===== */}
              {step === STEPS.ACCOUNT_CREATED && (
                <div
                  className="text-center space-y-5 py-8 step-fade-up"
                  key="created"
                >
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                    <Icon
                      name="check-circle"
                      size={40}
                      className="text-emerald-500"
                    />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    You're all set!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Setting up your experience…
                  </p>
                  {form.role === "provider" && (
                    <div className="rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 p-4 text-sm text-brand-700 dark:text-brand-400">
                      Next: Complete your provider profile to start getting
                      requests.
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
    </>
  );
};

export default Auth;
