import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function ProviderOnboardingStep1Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("providerOnboarding");
    return saved ? JSON.parse(saved) : {
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
    };
  });

  const updateField = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    localStorage.setItem("providerOnboarding", JSON.stringify(updated));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
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

  const handleContinue = () => {
    if (!validateProfileStep()) return;
    navigate("/provider-onboarding/verification");
  };

  const fieldClass =
    "w-full rounded-xl border border-[#D9E7FF] bg-white px-4 py-3 text-sm text-[#1A1A1A] shadow-sm transition focus:border-[#3A9AFF] focus:outline-none focus:ring-2 focus:ring-[#E8F0FF]";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F7FAFF] pt-[72px]">
        <div className="mx-auto max-w-[1040px] px-5 py-10">
          {/* Header with step indicator */}
          <div className="mb-8 rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#3A9AFF]">Provider onboarding</p>
            <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A]">Step 1: Profile</h1>
            <p className="mb-6 text-sm text-gray-600">Tell us about your services. This helps customers find and understand what you offer.</p>
            
            {/* Step indicators */}
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A9AFF] text-sm font-bold text-white">1</div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Profile</span>
              </div>
              <div className="flex items-center gap-1 text-[#D9E7FF]">—</div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FF] text-sm font-semibold text-[#3A9AFF]">2</div>
                <span className="text-sm font-semibold text-gray-500">Verification</span>
              </div>
              <div className="flex items-center gap-1 text-[#D9E7FF]">—</div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FF] text-sm font-semibold text-[#3A9AFF]">3</div>
                <span className="text-sm font-semibold text-gray-500">Review</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
            {/* Main form */}
            <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-5 rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
              <section className="rounded-xl border border-[#E9F1FF] bg-[#FAFCFF] p-5">
                <h2 className="mb-1 text-lg font-semibold text-[#1A1A1A]">Service details</h2>
                <p className="mb-4 text-sm text-gray-600">How customers discover and understand your services.</p>

                <div className="mb-4">
                  <label htmlFor="category" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                    Primary service category
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    disabled={loading}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="secondaryCategory" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                    Secondary category (optional)
                  </label>
                  <select
                    id="secondaryCategory"
                    value={form.secondaryCategory}
                    disabled={loading}
                    onChange={(e) => updateField("secondaryCategory", e.target.value)}
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
                      onChange={(e) => updateField("area", e.target.value)}
                      className={fieldClass}
                    />
                    {fieldErrors.area && <p className="mt-1 text-xs text-red-600">{fieldErrors.area}</p>}
                  </div>
                  <div>
                    <label htmlFor="radius" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                      Service radius
                    </label>
                    <select
                      id="radius"
                      value={form.radius}
                      disabled={loading}
                      onChange={(e) => updateField("radius", e.target.value)}
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
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Describe your experience, strengths, and what customers can expect."
                    className={fieldClass}
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Minimum 40 characters.</span>
                    <span>{form.bio.length}/240</span>
                  </div>
                  {fieldErrors.bio && <p className="mt-1 text-xs text-red-600">{fieldErrors.bio}</p>}
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
                      onChange={(e) => updateField("basePrice", e.target.value)}
                      placeholder="e.g. 120"
                      className={fieldClass}
                    />
                  </div>
                  <label className="mt-8 flex items-start gap-3 text-sm text-gray-700 sm:mt-9">
                    <input
                      type="checkbox"
                      checked={form.openForWork}
                      disabled={loading}
                      onChange={(e) => updateField("openForWork", e.target.checked)}
                      className="mt-1"
                    />
                    <span>Open for work now</span>
                  </label>
                </div>
              </section>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-lg border border-[#E8F0FF] px-6 py-3 font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const saved = localStorage.getItem("providerOnboarding");
                    localStorage.setItem("providerOnboarding", JSON.stringify({ ...form }));
                    alert("Profile saved as draft");
                  }}
                  className="rounded-lg border border-[#E8F0FF] px-6 py-3 font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
                >
                  Save draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto rounded-lg bg-[#3A9AFF] px-6 py-3 font-semibold text-white hover:bg-[#2B8DEB] disabled:opacity-60 transition"
                >
                  Continue to verification →
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="h-fit rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm md:sticky md:top-24">
              <h3 className="mb-2 text-lg font-semibold text-[#1A1A1A]">Tips</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-star text-[#3A9AFF]"></i>
                    <p className="font-semibold text-[#1A1A1A]">Stand out</p>
                  </div>
                  <p className="text-xs mt-1 ml-6">A clear, professional bio helps customers choose you.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-map-marker-alt text-[#3A9AFF]"></i>
                    <p className="font-semibold text-[#1A1A1A]">Location matters</p>
                  </div>
                  <p className="text-xs mt-1 ml-6">Be specific about your service area for better matches.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-dollar-sign text-[#3A9AFF]"></i>
                    <p className="font-semibold text-[#1A1A1A]">Pricing</p>
                  </div>
                  <p className="text-xs mt-1 ml-6">Your starting price helps customers understand cost expectations.</p>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[#F5F8FF] p-3 text-xs text-[#2C5DB6]">
                <i className="fas fa-lightbulb mr-2"></i>
                Complete Step 2 to verify your identity and go live.
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderOnboardingStep1Profile;
