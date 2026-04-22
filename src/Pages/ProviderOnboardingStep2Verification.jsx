import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ID_OPTIONS = ["National ID", "Driver's license", "Passport", "Voter ID"];

function ProviderOnboardingStep2Verification() {
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

  const validateVerificationStep = () => {
    const nextErrors = {
      idType: form.idType ? "" : "Select an ID type.",
      idNumber: form.idNumber.trim().length >= 6 ? "" : "Enter a valid ID number.",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleContinue = () => {
    if (!validateVerificationStep()) return;
    navigate("/provider-onboarding/review");
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
            <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A]">Step 2: Verification</h1>
            <p className="mb-6 text-sm text-gray-600">Verify your identity for trust and safety. This helps customers feel confident working with you.</p>
            
            {/* Step indicators */}
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A9AFF] text-sm font-bold text-white"><i className="fas fa-check"></i></div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Profile</span>
              </div>
              <div className="flex items-center gap-1 text-[#D9E7FF]">—</div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A9AFF] text-sm font-bold text-white">2</div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Verification</span>
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
              <section className="rounded-xl border border-[#FFE9D8] bg-[#FFF9F5] p-5">
                <h3 className="mb-1 text-lg font-semibold text-[#1A1A1A]">Identity verification</h3>
                <p className="mb-4 text-sm text-gray-600">
                  This is used only for trust and safety review. Your information is kept secure and private.
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
                      onChange={(e) => updateField("idType", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select ID type</option>
                      {ID_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {fieldErrors.idType && <p className="mt-1 text-xs text-red-600">{fieldErrors.idType}</p>}
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
                      onChange={(e) => updateField("idNumber", e.target.value)}
                      placeholder="Enter ID number"
                      className={fieldClass}
                    />
                    {fieldErrors.idNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.idNumber}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="docUpload" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                    Upload ID document (optional in MVP)
                  </label>
                  <input
                    id="docUpload"
                    type="file"
                    disabled={loading}
                    onChange={(e) => updateField("docName", e.target.files?.[0]?.name || "")}
                    className="w-full rounded-xl border border-[#D9E7FF] bg-white px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#EAF2FF] file:px-3 file:py-2 file:font-medium file:text-[#2C5DB6]"
                  />
                  {form.docName && <p className="mt-1 text-xs text-gray-500">✓ Selected: {form.docName}</p>}
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
                  <p className="font-semibold mb-1"><i className="fas fa-lock mr-2"></i>Your data is secure</p>
                  <p>We use industry-standard encryption and comply with data protection regulations.</p>
                </div>
              </section>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/provider-onboarding/profile")}
                  className="rounded-lg border border-[#E8F0FF] px-6 py-3 font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
                >
                  ← Back to profile
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
                  Continue to review →
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="h-fit rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm md:sticky md:top-24">
              <h3 className="mb-2 text-lg font-semibold text-[#1A1A1A]">Why we verify</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-check-circle text-[#1F8A57]"></i>
                    <p className="font-semibold text-[#1A1A1A]">Build trust</p>
                  </div>
                  <p className="text-xs mt-1 ml-6">Verified providers get more customer confidence and bookings.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-shield-alt text-[#CC6D1E]"></i>
                    <p className="font-semibold text-[#1A1A1A]">Safety first</p>
                  </div>
                  <p className="text-xs mt-1 ml-6">Protects both you and customers from fraud and disputes.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-bolt text-[#3A9AFF]"></i>
                    <p className="font-semibold text-[#1A1A1A]">Faster approval</p>
                  </div>
                  <p className="text-xs mt-1 ml-6">Complete verification within 24-48 hours typically.</p>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[#F5F8FF] p-3 text-xs text-[#2C5DB6]">
                <i className="fas fa-lightbulb mr-2"></i>
                Your ID is only used for verification. We never share it publicly.
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderOnboardingStep2Verification;
