import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORY_OPTIONS = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Tutoring",
  "Catering",
  "Beauty",
  "Delivery",
];

const ID_OPTIONS = ["National ID", "Driver's license", "Passport", "Voter ID"];
const STEPS = ["profile", "verification", "review"];

function ProviderOnboardingGate() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState("profile");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
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
    consent: false,
  });

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

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (form.category) score += 25;
    if (form.area) score += 20;
    if (form.bio.length >= 40) score += 25;
    if (form.idType && form.idNumber) score += 20;
    if (form.docName) score += 10;
    return score;
  }, [form]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");
  };

  const validateProfileStep = () => {
    const nextErrors = {
      category: form.category ? "" : "Choose your primary service category.",
      area: form.area.trim() ? "" : "Service area is required.",
      bio: form.bio.trim().length >= 40 ? "" : "Tell customers about your experience (minimum 40 characters).",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const validateVerificationStep = () => {
    const nextErrors = {
      idType: form.idType ? "" : "Select an ID type.",
      idNumber: form.idNumber.trim().length >= 6 ? "" : "Enter a valid ID number.",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const validateReviewStep = () => {
    const nextErrors = {
      consent: form.consent ? "" : "You must confirm this information is accurate.",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleNextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentStep === "profile" && !validateProfileStep()) return;
    if (currentStep === "verification" && !validateVerificationStep()) return;
    const next = STEPS[currentIndex + 1];
    if (next) setCurrentStep(next);
  };

  const handleBackStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    const prev = STEPS[currentIndex - 1];
    if (prev) setCurrentStep(prev);
  };

  const handleFinalSubmit = async () => {
    if (offline) {
      setFormError("No internet connection. Check your network and retry.");
      return;
    }
    if (!validateReviewStep()) return;

    setLoading(true);
    setFormError("");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1100));
      setSubmitted(true);
    } catch (error) {
      setFormError("We couldn't submit your profile. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-[#D9E7FF] bg-white px-4 py-3 text-sm text-[#1A1A1A] shadow-sm transition focus:border-[#3A9AFF] focus:outline-none focus:ring-2 focus:ring-[#E8F0FF]";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F7FAFF] pt-[72px]">
        <div className="mx-auto max-w-[1040px] px-5 py-10">
          <div className="mb-6 rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#3A9AFF]">Provider onboarding</p>
            <h1 className="mb-2 text-3xl font-bold text-[#1A1A1A]">Complete profile + verification</h1>
            <p className="text-sm text-gray-600">Complete your profile to start receiving requests.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full px-3 py-1 font-medium ${currentStep === "profile" ? "bg-[#EAF2FF] text-[#2C5DB6]" : "bg-[#F2F4F7] text-[#535862]"}`}>Step 1: Profile</span>
              <span className={`rounded-full px-3 py-1 font-medium ${currentStep === "verification" ? "bg-[#FFF4E9] text-[#CC6D1E]" : "bg-[#F2F4F7] text-[#535862]"}`}>Step 2: Verification</span>
              <span className={`rounded-full px-3 py-1 font-medium ${currentStep === "review" ? "bg-[#EAFBF2] text-[#1F8A57]" : "bg-[#F2F4F7] text-[#535862]"}`}>Step 3: Review</span>
            </div>
          </div>

          {offline ? (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              No internet connection. Check your network and retry.
            </div>
          ) : null}
          {formError ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

          {submitted ? (
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <section className="rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <span>⏳</span>
                  Verification pending
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-[#1A1A1A]">Profile submitted for review</h2>
                <p className="mb-6 text-sm text-gray-600">
                  Your details are under review. We will notify you when verification is complete.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>- We verify identity and service information for trust and safety.</p>
                  <p>- Keep your availability updated so requests can be matched quickly.</p>
                  <p>- You can return to edit profile details while review is pending.</p>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-lg bg-[#0057FF] px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    onClick={() => setSubmitted(false)}
                  >
                    Edit profile
                  </button>
                  <Link to="/" className="rounded-lg border border-[#E8F0FF] px-5 py-3 font-semibold text-[#1A1A1A]">
                    Back to home
                  </Link>
                </div>
              </section>

              <aside className="rounded-2xl border border-[#DCE9FF] bg-[#F8FBFF] p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Profile preview</h3>
                <div className="mb-2 text-sm font-semibold text-[#1A1A1A]">SureLink Provider</div>
                <div className="mb-3 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  Pending review
                </div>
                <p className="mb-2 text-sm text-gray-700">{form.category}</p>
                <p className="mb-2 text-sm text-gray-700">{form.area} + {form.radius}km radius</p>
                <p className="mb-2 text-sm text-gray-700">{form.openForWork ? "Open for work" : "Currently unavailable"}</p>
                <p className="text-sm text-gray-700">ID: {form.idType}</p>
              </aside>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <form onSubmit={(event) => event.preventDefault()} className="space-y-5 rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                {currentStep === "profile" && (
                <section className="rounded-xl border border-[#E9F1FF] bg-[#FAFCFF] p-5">
                  <h2 className="mb-1 text-lg font-semibold text-[#1A1A1A]">Service details</h2>
                  <p className="mb-4 text-sm text-gray-600">How customers discover and understand your services. (Similar to Upwork and Fiverr profile basics)</p>

                  <div className="mb-4">
                    <label htmlFor="category" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                      Primary service category
                    </label>
                    <select
                      id="category"
                      value={form.category}
                      disabled={loading}
                      onChange={(event) => updateField("category", event.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {fieldErrors.category ? <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p> : null}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="secondaryCategory" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                      Secondary category (optional)
                    </label>
                    <select
                      id="secondaryCategory"
                      value={form.secondaryCategory}
                      disabled={loading}
                      onChange={(event) => updateField("secondaryCategory", event.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Optional</option>
                      {CATEGORY_OPTIONS.filter((option) => option !== form.category).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="area" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                        Service area
                      </label>
                      <input
                        id="area"
                        type="text"
                        placeholder="e.g. East Legon, Accra"
                        value={form.area}
                        disabled={loading}
                        onChange={(event) => updateField("area", event.target.value)}
                        className={fieldClass}
                      />
                      {fieldErrors.area ? <p className="mt-1 text-xs text-red-600">{fieldErrors.area}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="radius" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                        Service radius
                      </label>
                      <select
                        id="radius"
                        value={form.radius}
                        disabled={loading}
                        onChange={(event) => updateField("radius", event.target.value)}
                        className={fieldClass}
                      >
                        <option value="3">3 km</option>
                        <option value="5">5 km</option>
                        <option value="10">10 km</option>
                        <option value="20">20 km</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                      Professional bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={form.bio}
                      disabled={loading}
                      onChange={(event) => updateField("bio", event.target.value)}
                      placeholder="Describe your experience, strengths, and what customers can expect."
                      className={fieldClass}
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>Minimum 40 characters.</span>
                      <span>{form.bio.length}/240</span>
                    </div>
                    {fieldErrors.bio ? <p className="mt-1 text-xs text-red-600">{fieldErrors.bio}</p> : null}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="basePrice" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                        Starting price (GHS, optional)
                      </label>
                      <input
                        id="basePrice"
                        type="number"
                        min="0"
                        value={form.basePrice}
                        disabled={loading}
                        onChange={(event) => updateField("basePrice", event.target.value)}
                        placeholder="e.g. 120"
                        className={fieldClass}
                      />
                    </div>
                    <label className="mt-8 flex items-start gap-3 text-sm text-gray-700 sm:mt-9">
                      <input
                        type="checkbox"
                        checked={form.openForWork}
                        disabled={loading}
                        onChange={(event) => updateField("openForWork", event.target.checked)}
                        className="mt-1"
                      />
                      <span>Open for work now</span>
                    </label>
                  </div>
                </section>
                )}

                {currentStep === "verification" && (
                <section className="rounded-xl border border-[#FFE9D8] bg-[#FFF9F5] p-5">
                  <h3 className="mb-1 text-lg font-semibold text-[#1A1A1A]">Verification details</h3>
                  <p className="mb-4 text-sm text-gray-600">
                    This is used only for trust and safety review, similar to identity checks in Uber and Taskrabbit onboarding.
                  </p>

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="idType" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                        ID type
                      </label>
                      <select
                        id="idType"
                        value={form.idType}
                        disabled={loading}
                        onChange={(event) => updateField("idType", event.target.value)}
                        className={fieldClass}
                      >
                        <option value="">Select ID type</option>
                        {ID_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {fieldErrors.idType ? <p className="mt-1 text-xs text-red-600">{fieldErrors.idType}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="idNumber" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                        ID number
                      </label>
                      <input
                        id="idNumber"
                        type="text"
                        value={form.idNumber}
                        disabled={loading}
                        onChange={(event) => updateField("idNumber", event.target.value)}
                        placeholder="Enter ID number"
                        className={fieldClass}
                      />
                      {fieldErrors.idNumber ? <p className="mt-1 text-xs text-red-600">{fieldErrors.idNumber}</p> : null}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label htmlFor="docUpload" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                      Upload ID document (optional in MVP)
                    </label>
                    <input
                      id="docUpload"
                      type="file"
                      disabled={loading}
                      onChange={(event) => updateField("docName", event.target.files?.[0]?.name || "")}
                      className="w-full rounded-xl border border-[#D9E7FF] bg-white px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF2FF] file:px-3 file:py-2 file:font-medium file:text-[#2C5DB6]"
                    />
                    {form.docName ? <p className="mt-1 text-xs text-gray-500">Selected: {form.docName}</p> : null}
                  </div>
                </section>
                )}

                {currentStep === "review" && (
                <section className="space-y-4 rounded-xl border border-[#DCE9FF] bg-[#FAFCFF] p-5">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Review your profile</h3>
                  <p className="text-sm text-gray-600">
                    Final confirmation before submission. This mirrors the summary step used in most leading onboarding systems.
                  </p>
                  <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                    <p><span className="font-semibold text-[#1A1A1A]">Primary category:</span> {form.category || "-"}</p>
                    <p><span className="font-semibold text-[#1A1A1A]">Secondary category:</span> {form.secondaryCategory || "-"}</p>
                    <p><span className="font-semibold text-[#1A1A1A]">Service area:</span> {form.area || "-"}</p>
                    <p><span className="font-semibold text-[#1A1A1A]">Radius:</span> {form.radius} km</p>
                    <p><span className="font-semibold text-[#1A1A1A]">Starting price:</span> {form.basePrice ? `GHS ${form.basePrice}` : "Not set"}</p>
                    <p><span className="font-semibold text-[#1A1A1A]">Availability:</span> {form.openForWork ? "Open for work" : "Currently unavailable"}</p>
                    <p><span className="font-semibold text-[#1A1A1A]">ID type:</span> {form.idType || "-"}</p>
                    <p><span className="font-semibold text-[#1A1A1A]">ID number:</span> {form.idNumber || "-"}</p>
                  </div>
                  <div className="rounded-lg border border-[#E8F0FF] bg-white p-3 text-sm text-gray-700">
                    <p className="mb-1 font-semibold text-[#1A1A1A]">Professional bio</p>
                    <p>{form.bio || "-"}</p>
                  </div>
                <label className="flex items-start gap-3 rounded-xl border border-[#E8F0FF] bg-white p-4 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    disabled={loading}
                    onChange={(event) => updateField("consent", event.target.checked)}
                    className="mt-1"
                  />
                  <span>I confirm these details are accurate and agree to verification review.</span>
                </label>
                {fieldErrors.consent ? <p className="text-xs text-red-600">{fieldErrors.consent}</p> : null}
                </section>
                )}

                <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-xl border border-[#DCE9FF] bg-white/95 p-3 shadow-md backdrop-blur">
                  {currentStep !== "profile" ? (
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="rounded-lg border border-[#D9E7FF] px-5 py-3 font-semibold text-[#1A1A1A]"
                    >
                      Back
                    </button>
                  ) : null}
                  {currentStep !== "review" ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={loading}
                      className="rounded-lg bg-[#3A9AFF] px-5 py-3 font-semibold text-white hover:bg-[#2B8DEB] disabled:opacity-60"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={loading || !form.consent}
                      className="rounded-lg bg-[#3A9AFF] px-5 py-3 font-semibold text-white hover:bg-[#2B8DEB] disabled:opacity-60"
                    >
                      {loading ? "Submitting..." : "Submit profile"}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={loading}
                    className="rounded-lg border border-[#E8F0FF] px-5 py-3 font-semibold text-[#1A1A1A]"
                  >
                    Save draft
                  </button>
                  <Link to="/" className="rounded-lg border border-[#E8F0FF] px-5 py-3 font-semibold text-[#1A1A1A]">
                    Back to home
                  </Link>
                </div>
              </form>

              <aside className="h-fit rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm md:sticky md:top-24">
                <h3 className="mb-2 text-lg font-semibold text-[#1A1A1A]">Profile readiness</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Complete your profile to improve trust and receive more matched requests.
                </p>
                <div className="mb-2 h-2 w-full rounded-full bg-[#E8F0FF]">
                  <div className="h-2 rounded-full bg-[#3A9AFF]" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="mb-5 text-xs text-gray-600">{profileCompletion}% complete</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>- Add service category, pricing, and availability.</p>
                  <p>- Add verification details before going live.</p>
                  <p>- Review your provider profile preview.</p>
                </div>
                <div className="mt-5 rounded-lg bg-[#F5F8FF] p-3 text-xs text-[#2C5DB6]">
                  Tip: Top-performing marketplace profiles combine a clear service bio, strong area details, and completed ID verification.
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderOnboardingGate;
