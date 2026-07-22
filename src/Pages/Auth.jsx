import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AuthButton,
  AuthIcon,
  FeedbackBanner,
  OtpInputGroup,
} from "../components/auth/AuthComponents";
import api from "../APIs/api";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  loginFailure,
  loginStart,
} from "../redux/features/auth/authSlice";
import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaGoogle,
  FaApple,
  FaGlobe,
  FaStar,
  FaUsers,
  FaAddressBook,
  FaInfoCircle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

// ===================== CONSTANTS =====================
const STEPS = {
  WELCOME: "welcome",
  SIGN_IN: "sign_in",
  REGISTER_BASICS: "register_basics",
  OTP_SIGN_IN: "otp_sign_in",
  OTP_SIGNUP: "otp_signup",
  ROLE_SELECTION: "role_selection",
  PROVIDER_PROFILE: "provider_profile",
  CUSTOMER_PROFILE: "customer_profile",
  TERMS_CONSENT: "terms_consent",
  ACCOUNT_CREATED: "account_created",
};

const OTP_RESEND_SECONDS = 30;

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

// ===================== GOOGLE ICON =====================
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
  const [direction, setDirection] = useState("forward");
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    identifier: "",
    fullName: "",
    otp: "",
    role: "customer",
    password: "",
    termsAccepted: false,
  });

  // ===================== EFFECTS =====================
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

  const handleNetworkGuard = () => {
    if (offline) {
      setGlobalError(mapErrorToMicrocopy("NETWORK_OFFLINE"));
      return false;
    }
    return true;
  };

  const goToLandingByRole = (role) => {
    const storedUserString = localStorage.getItem("user");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : {};

    const mergedUserPayload = {
      ...storedUser,
      role: role,
      type: role,
      identifier: form.identifier,
    };

    localStorage.setItem("user", JSON.stringify(mergedUserPayload));
    dispatch(loginSuccess(mergedUserPayload));

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
        { role: form.role },
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

      setForm((prev) => ({
        ...prev,
        maskedIdentifier,
      }));

      setOtpTimer(60);

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
    if (isSubmitting) return;

    setLoading(true);
    setSlowNetwork(false);
    setGlobalError("");
    setIsSubmitting(true);

    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);

    try {
      const res = await api.post("/auth/request-otp", {
        identifier: form.identifier,
        type: targetStep === STEPS.OTP_SIGNUP ? "signup" : "login",
      });

      const { purpose } = res.data;

      setOtpTimer(OTP_RESEND_SECONDS);
      setGlobalSuccess("A verification code was dispatched successfully.");

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

        const freshUserPayload = JSON.parse(JSON.stringify(user));
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

      const res = await api.post(
        "/auth/accept-terms",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      const confirmedRole = res.data.data?.role || user?.role || user?.type;

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

  const inputWrap = "relative";
  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 input-glow bg-white text-gray-900 placeholder:text-gray-400";
  const inputOk =
    "border-gray-200 focus:border-[#0057FF] focus:ring-[#0057FF]/20";
  const inputErr = "border-red-300 focus:ring-red-100 bg-red-50/50";
  const iconBase =
    "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  const isSignInOrWelcome = step === STEPS.WELCOME || step === STEPS.SIGN_IN;
  const isRegister = step === STEPS.REGISTER_BASICS;

  const heroContent = useMemo(() => {
    if (isRegister)
      return {
        badge: "Join 50,000+ users",
        title: "Start finding trusted services today",
        subtitle:
          "Create your free SureLink account and connect with verified professionals in your area.",
        stats: [
          { icon: FaUsers, value: "50K+", label: "Active users" },
          { icon: FaStar, value: "4.9", label: "Average rating" },
          { icon: FaGlobe, value: "100+", label: "Service areas" },
        ],
      };
    return {
      badge: "Welcome back",
      title: "Your trusted marketplace for local services",
      subtitle:
        "Sign in to access verified professionals, manage bookings, and grow your business.",
      stats: [
        { icon: FaShieldAlt, value: "100%", label: "Verified pros" },
        { icon: FaAddressBook, value: "<5 min", label: "Avg. match time" },
        { icon: FaStar, value: "4.9★", label: "User rating" },
      ],
    };
  }, [isRegister]);

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] font-sans">
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
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(0,87,255,0.12); }
        .glass-card { background: rgba(255,255,255,0.12); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.2); }
        .hero-gradient { background: linear-gradient(135deg, #0057FF 0%, #3A9AFF 50%, #7CC4FF 100%); }
        .social-btn { transition: all 0.15s ease; }
        .social-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .social-btn:active { transform: translateY(0); }
      `}</style>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* ===== LEFT - HERO PANEL ===== */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] relative overflow-hidden hero-gradient">
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

              <p className="text-lg text-blue-100 leading-relaxed max-w-lg">
                {heroContent.subtitle}
              </p>

              {/* Stats */}
              <div className="flex gap-6 pt-2">
                {heroContent.stats.map((s) => {
                  const IconComponent = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="glass-card rounded-xl px-5 py-4 text-center min-w-[100px]"
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <IconComponent className="text-blue-200 text-lg" />
                        <span className="text-2xl font-extrabold">
                          {s.value}
                        </span>
                      </div>
                      <div className="text-xs text-blue-200 font-medium">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial */}
            <div className="glass-card rounded-xl p-5 mt-auto">
              <div className="flex items-center gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>
              <p className="text-sm text-blue-100 italic leading-relaxed">
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
                  <div className="text-xs text-blue-200">Accra, Ghana</div>
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
              <span className="text-2xl font-extrabold tracking-tight text-[#0057FF]">
                SureLink
              </span>
            </div>

            {/* Offline Banner */}
            {offline && (
              <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-700 flex items-center gap-2">
                <FaInfoCircle className="shrink-0" />
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
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-2">
                    Get started
                  </h2>
                  <p className="text-gray-500">
                    Sign in or create an account to continue.
                  </p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    <FaApple className="text-lg" />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
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
                    <button className="text-[#0057FF] hover:underline font-medium">
                      Terms
                    </button>{" "}
                    and{" "}
                    <button className="text-[#0057FF] hover:underline font-medium">
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
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-2">
                    Welcome back
                  </h2>
                  <p className="text-gray-500">
                    Enter your details to sign in.
                  </p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    disabled={loading}
                    className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <FaApple className="text-lg" />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={submitSignIn} className="space-y-4">
                  <div>
                    <label
                      htmlFor="signin-id"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Phone or Email
                    </label>
                    <div className={inputWrap}>
                      <FaGlobe className={`${iconBase} text-base`} />
                      <input
                        id="signin-id"
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
                        <FaInfoCircle className="text-xs" />
                        {fieldErrors.identifier}
                      </p>
                    )}
                  </div>

                  <AuthButton
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    Sign in
                  </AuthButton>
                </form>

                <div className="mt-4 text-center text-sm text-gray-500 flex flex-wrap items-center justify-center gap-1">
                  <button
                    type="button"
                    className="text-[#0057FF] hover:underline font-medium"
                    onClick={() => requestOtp(STEPS.OTP_SIGN_IN)}
                  >
                    Continue with OTP
                  </button>
                  <span>·</span>
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    className="text-[#0057FF] hover:underline font-semibold"
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
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-2">
                    Verify your identity
                  </h2>
                  <p className="text-gray-500">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-[#1A1A1A]">
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
                      <FaInfoCircle className="text-xs" />
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
                    {step === STEPS.OTP_SIGN_IN ? "Verify & sign in" : "Verify"}
                  </AuthButton>

                  <div className="flex justify-between text-sm">
                    <button
                      type="button"
                      className="text-[#0057FF] hover:underline font-medium"
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
                      className="text-[#0057FF] hover:underline font-medium disabled:text-gray-400"
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
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-2">
                    Create your account
                  </h2>
                  <p className="text-gray-500">
                    Join thousands of trusted users on SureLink.
                  </p>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    disabled={loading}
                    className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="social-btn flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    <FaApple className="text-lg" />
                    <span>Apple</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={submitSignIn} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reg-id"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Email or phone
                    </label>
                    <div className={inputWrap}>
                      <FaEnvelope className={`${iconBase} text-base`} />
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
                        <FaInfoCircle className="text-xs" />
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

                <p className="mt-4 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-[#0057FF] hover:underline font-semibold"
                    onClick={() => changeStep(STEPS.SIGN_IN)}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {/* ===== ROLE SELECTION ===== */}
            {step === STEPS.ROLE_SELECTION && (
              <div className={animClass} key="role_selection">
                <div className="mb-7">
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-2">
                    Select Account Type
                  </h2>
                  <p className="text-gray-500">
                    Choose how you want to use SureLink.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => updateField("role", "customer")}
                    className={`w-full p-4 rounded-xl border text-left transition ${
                      form.role === "customer"
                        ? "border-[#0057FF] bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-[#0057FF]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          form.role === "customer"
                            ? "bg-[#0057FF] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <FaUser />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">
                          Customer Account
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          I want to browse and request verified services.
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("role", "provider")}
                    className={`w-full p-4 rounded-xl border text-left transition ${
                      form.role === "provider"
                        ? "border-[#0057FF] bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-[#0057FF]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          form.role === "provider"
                            ? "bg-[#0057FF] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <FaBriefcase />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">
                          Provider Account
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          I want to offer services and get hired.
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

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

            {/* ===== TERMS CONSENT ===== */}
            {step === STEPS.TERMS_CONSENT && (
              <div className={animClass} key="terms_consent">
                <div className="mb-7">
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-2">
                    Terms & Conditions
                  </h2>
                  <p className="text-gray-500">
                    Please review and accept our terms to continue.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-check"
                      checked={form.termsAccepted || false}
                      onChange={(e) =>
                        updateField("termsAccepted", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
                    />
                    <label
                      htmlFor="terms-check"
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-[#0057FF] hover:underline font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-[#0057FF] hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                      . I understand that my information will be processed
                      securely.
                    </label>
                  </div>
                </div>

                <AuthButton
                  onClick={submitTermsConsent}
                  loading={loading}
                  disabled={!form.termsAccepted || loading}
                >
                  Accept & Continue
                </AuthButton>
              </div>
            )}

            {/* ===== ACCOUNT CREATED ===== */}
            {step === STEPS.ACCOUNT_CREATED && (
              <div
                className="text-center space-y-5 py-8 step-fade-up"
                key="created"
              >
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                  <FaCheckCircle className="text-emerald-500 text-4xl" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
                  You're all set!
                </h2>
                <p className="text-gray-500">Setting up your experience…</p>
                {form.role === "provider" && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                    <FaInfoCircle className="inline mr-2" />
                    Next: Complete your provider profile to start getting
                    requests.
                  </div>
                )}
              </div>
            )}

            {/* Trust badges */}
            {(isSignInOrWelcome || isRegister) && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-5 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <FaLock className="text-xs" />
                  <span>256-bit SSL</span>
                </div>
                <div className="w-px h-3.5 bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <FaShieldAlt className="text-xs" />
                  <span>GDPR Ready</span>
                </div>
                <div className="w-px h-3.5 bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-xs" />
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
