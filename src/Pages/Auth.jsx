import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  AuthButton,
  AuthTextInput,
  ConsentRow,
  FeedbackBanner,
  OtpInputGroup,
  RoleCard,
} from "../components/auth/AuthComponents";

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

function trackAuthEvent(eventName, payload = {}) {
  // Replace this with your analytics SDK when integrated.
  console.log(`[analytics] ${eventName}`, payload);
}

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

  useEffect(() => {
    if (location.pathname === "/login") setStep(STEPS.SIGN_IN);
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
    const id = window.setInterval(() => {
      setOtpTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
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

  const simulateRequest = (ms = 900) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const handleNetworkGuard = () => {
    if (offline) {
      setGlobalError(mapErrorToMicrocopy("NETWORK_OFFLINE"));
      return false;
    }
    return true;
  };

  const goToLandingByRole = (role) => {
    localStorage.setItem("user", JSON.stringify({ role, identifier: form.identifier }));
    if (role === "provider") {
      navigate("/provider/onboarding");
      return;
    }
    navigate("/");
  };

  const submitSignIn = async () => {
    const identifierError = validateIdentifier(form.identifier);
    const errors = {
      identifier: identifierError,
      password: form.password ? "" : "Password is required.",
    };
    setFieldErrors(errors);
    if (errors.identifier || errors.password || !handleNetworkGuard()) return;

    setLoading(true);
    setSlowNetwork(false);
    setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try {
      trackAuthEvent("login_started");
      await simulateRequest();
      trackAuthEvent("login_success");
      goToLandingByRole(form.role);
    } catch (error) {
      trackAuthEvent("login_failed");
      setGlobalError(mapErrorToMicrocopy("AUTH_LOGIN_FAILED"));
    } finally {
      window.clearTimeout(slowTimer);
      setLoading(false);
      setSlowNetwork(false);
    }
  };

  const requestOtp = async (targetStep) => {
    const identifierError = validateIdentifier(form.identifier);
    setFieldErrors({ identifier: identifierError });
    if (identifierError || !handleNetworkGuard()) return;

    setLoading(true);
    setSlowNetwork(false);
    setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try {
      trackAuthEvent("otp_requested", { flow: targetStep });
      await simulateRequest();
      setOtpTimer(OTP_RESEND_SECONDS);
      setGlobalSuccess("OTP sent successfully.");
      setStep(targetStep);
    } catch (error) {
      setGlobalError("Could not send OTP. Try again.");
    } finally {
      window.clearTimeout(slowTimer);
      setLoading(false);
      setSlowNetwork(false);
    }
  };

  const verifyOtpAndContinue = async (nextStep) => {
    const otpError = form.otp.length === 6 ? "" : "OTP must be 6 digits.";
    setFieldErrors({ otp: otpError });
    if (otpError || !handleNetworkGuard()) return;

    setLoading(true);
    setSlowNetwork(false);
    setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try {
      await simulateRequest();
      trackAuthEvent("otp_verified", { flow: step });
      setGlobalSuccess("OTP verified.");
      setForm((prev) => ({ ...prev, otp: "" }));
      if (nextStep === STEPS.ACCOUNT_CREATED) {
        goToLandingByRole(form.role);
      } else {
        setStep(nextStep);
      }
    } catch (error) {
      trackAuthEvent("otp_failed");
      setGlobalError(mapErrorToMicrocopy("AUTH_OTP_INVALID"));
    } finally {
      window.clearTimeout(slowTimer);
      setLoading(false);
      setSlowNetwork(false);
    }
  };

  const submitRegisterBasics = async () => {
    const identifierError = validateIdentifier(form.identifier);
    const errors = {
      fullName: form.fullName.trim() ? "" : "Full name is required.",
      identifier: identifierError,
      password: form.password.length >= 8 ? "" : "Password must be at least 8 characters.",
      confirmPassword:
        form.password === form.confirmPassword ? "" : "Passwords do not match.",
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean) || !handleNetworkGuard()) return;
    trackAuthEvent("signup_started");
    await requestOtp(STEPS.OTP_SIGNUP);
  };

  const submitConsent = async () => {
    if (!form.termsAccepted) {
      setGlobalError("Please accept Terms and Privacy to continue.");
      return;
    }
    if (!handleNetworkGuard()) return;

    setLoading(true);
    setSlowNetwork(false);
    setGlobalError("");
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 1200);
    try {
      await simulateRequest();
      trackAuthEvent("signup_completed");
      setStep(STEPS.ACCOUNT_CREATED);
      setTimeout(() => goToLandingByRole(form.role), 1300);
    } finally {
      window.clearTimeout(slowTimer);
      setLoading(false);
      setSlowNetwork(false);
    }
  };

  const renderHeader = () => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">SureLink</h1>
      <p className="text-sm text-gray-500 mt-2">
        Trust-first access for everyone, with role-based continuation after signup.
      </p>
    </div>
  );

  const renderStatus = () => (
    <div className="space-y-3 mb-5">
      {offline ? (
        <FeedbackBanner
          type="warning"
          message="No internet connection. Check your network and retry."
          onRetry={() => window.location.reload()}
        />
      ) : null}
      {slowNetwork ? (
        <FeedbackBanner
          type="warning"
          message="Network is slow. Hold on or retry if this takes too long."
        />
      ) : null}
      <FeedbackBanner type="error" message={globalError} onRetry={() => setGlobalError("")} />
      <FeedbackBanner type="success" message={globalSuccess} />
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="max-w-[560px] mx-auto px-5 py-12">
          {renderHeader()}
          <section className="bg-white border border-[#E8F0FF] rounded-2xl p-6 shadow-sm">
            {renderStatus()}

            {step === STEPS.WELCOME && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Access trusted local services with secure, role-based accounts.</p>
                <AuthButton onClick={() => setStep(STEPS.SIGN_IN)}>Sign in</AuthButton>
                <AuthButton variant="secondary" onClick={() => setStep(STEPS.REGISTER_BASICS)}>
                  Create account
                </AuthButton>
                <div className="flex gap-4 text-sm text-[#0057FF]">
                  <button type="button" className="hover:underline">Terms</button>
                  <button type="button" className="hover:underline">Privacy</button>
                  <button type="button" className="hover:underline">Help</button>
                </div>
              </div>
            )}

            {step === STEPS.SIGN_IN && (
              <div className="space-y-4">
                <AuthTextInput
                  id="signin-id"
                  label="Phone or Email"
                  placeholder="0244123456 or you@example.com"
                  value={form.identifier}
                  error={fieldErrors.identifier}
                  state={fieldErrors.identifier ? "error" : loading ? "disabled" : "default"}
                  onChange={(e) => updateField("identifier", e.target.value)}
                  disabled={loading}
                />
                <AuthTextInput
                  id="signin-password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  error={fieldErrors.password}
                  state={fieldErrors.password ? "error" : loading ? "disabled" : "default"}
                  onChange={(e) => updateField("password", e.target.value)}
                  disabled={loading}
                />
                <div className="flex justify-between text-sm">
                  <button type="button" className="text-[#0057FF] hover:underline">Forgot password?</button>
                  <button type="button" className="text-[#0057FF] hover:underline" onClick={() => requestOtp(STEPS.OTP_SIGN_IN)}>
                    Use OTP instead
                  </button>
                </div>
                <AuthButton onClick={submitSignIn} loading={loading} disabled={loading}>
                  Sign in
                </AuthButton>
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button type="button" className="text-[#0057FF] hover:underline" onClick={() => setStep(STEPS.REGISTER_BASICS)}>
                    Create account
                  </button>
                </p>
              </div>
            )}

            {(step === STEPS.OTP_SIGN_IN || step === STEPS.OTP_SIGNUP) && (
              <div className="space-y-4">
                <AuthTextInput
                  id="otp-id"
                  label="Phone or Email"
                  placeholder="0244123456 or you@example.com"
                  value={form.identifier}
                  error={fieldErrors.identifier}
                  onChange={(e) => updateField("identifier", e.target.value)}
                  disabled={loading}
                />
                <div className="text-sm text-gray-600">
                  Code sent to <span className="font-semibold">{maskedDestination || "your destination"}</span>
                </div>
                <OtpInputGroup value={form.otp} onChange={(value) => updateField("otp", value)} disabled={loading} />
                {fieldErrors.otp ? <p className="text-xs text-red-600">{fieldErrors.otp}</p> : null}
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    className="text-[#0057FF] hover:underline"
                    onClick={() => setStep(step === STEPS.OTP_SIGN_IN ? STEPS.SIGN_IN : STEPS.REGISTER_BASICS)}
                  >
                    Change phone/email
                  </button>
                  <button
                    type="button"
                    className="text-[#0057FF] hover:underline disabled:text-gray-400"
                    disabled={otpTimer > 0 || loading}
                    onClick={() => requestOtp(step)}
                  >
                    {otpTimer > 0 ? `Resend in 00:${String(otpTimer).padStart(2, "0")}` : "Resend code"}
                  </button>
                </div>
                <AuthButton
                  onClick={() =>
                    verifyOtpAndContinue(step === STEPS.OTP_SIGN_IN ? STEPS.ACCOUNT_CREATED : STEPS.ROLE_SELECTION)
                  }
                  loading={loading}
                  disabled={loading}
                >
                  {step === STEPS.OTP_SIGN_IN ? "Verify and sign in" : "Verify"}
                </AuthButton>
              </div>
            )}

            {step === STEPS.REGISTER_BASICS && (
              <div className="space-y-4">
                <AuthTextInput
                  id="reg-name"
                  label="Full name"
                  value={form.fullName}
                  error={fieldErrors.fullName}
                  state={fieldErrors.fullName ? "error" : loading ? "disabled" : "default"}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  disabled={loading}
                />
                <AuthTextInput
                  id="reg-id"
                  label="Phone or Email"
                  value={form.identifier}
                  error={fieldErrors.identifier}
                  state={fieldErrors.identifier ? "error" : loading ? "disabled" : "default"}
                  onChange={(e) => updateField("identifier", e.target.value)}
                  disabled={loading}
                />
                <AuthTextInput
                  id="reg-password"
                  label="Password"
                  type="password"
                  hint="Use at least 8 characters."
                  value={form.password}
                  error={fieldErrors.password}
                  state={fieldErrors.password ? "error" : loading ? "disabled" : "default"}
                  onChange={(e) => updateField("password", e.target.value)}
                  disabled={loading}
                />
                <AuthTextInput
                  id="reg-confirm-password"
                  label="Confirm password"
                  type="password"
                  value={form.confirmPassword}
                  error={fieldErrors.confirmPassword}
                  state={fieldErrors.confirmPassword ? "error" : loading ? "disabled" : "default"}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  disabled={loading}
                />
                <AuthButton onClick={submitRegisterBasics} loading={loading} disabled={loading}>
                  Continue
                </AuthButton>
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button type="button" className="text-[#0057FF] hover:underline" onClick={() => setStep(STEPS.SIGN_IN)}>
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {step === STEPS.ROLE_SELECTION && (
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1A1A]">Select your role</h3>
                <RoleCard
                  title="Consumer"
                  description="Book and manage trusted local services."
                  selected={form.role === "consumer"}
                  disabled={loading}
                  onClick={() => {
                    updateField("role", "consumer");
                    trackAuthEvent("role_selected", { role: "consumer" });
                  }}
                />
                <RoleCard
                  title="Provider"
                  description="Offer services and receive requests from consumers."
                  selected={form.role === "provider"}
                  disabled={loading}
                  onClick={() => {
                    updateField("role", "provider");
                    trackAuthEvent("role_selected", { role: "provider" });
                  }}
                />
                <AuthButton onClick={() => setStep(STEPS.CONSENT)}>Continue</AuthButton>
              </div>
            )}

            {step === STEPS.CONSENT && (
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1A1A1A]">Terms + Privacy</h3>
                <ConsentRow
                  id="terms-consent"
                  checked={form.termsAccepted}
                  disabled={loading}
                  onChange={(checked) => updateField("termsAccepted", checked)}
                >
                  I agree to the <span className="text-[#0057FF]">Terms</span> and{" "}
                  <span className="text-[#0057FF]">Privacy Policy</span>.
                </ConsentRow>
                <ConsentRow
                  id="marketing-consent"
                  checked={form.marketingOptIn}
                  disabled={loading}
                  onChange={(checked) => updateField("marketingOptIn", checked)}
                >
                  Send me product updates and offers (optional).
                </ConsentRow>
                <AuthButton onClick={submitConsent} loading={loading} disabled={loading || !form.termsAccepted}>
                  Create account
                </AuthButton>
              </div>
            )}

            {step === STEPS.ACCOUNT_CREATED && (
              <div className="text-center space-y-4 py-3">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">Account created</h3>
                <p className="text-sm text-gray-600">Setting up your experience...</p>
                {form.role === "provider" ? (
                  <p className="text-sm text-amber-700">Complete your profile to start receiving requests.</p>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
