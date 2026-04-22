import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProviderOnboardingStep3Review() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const validateReviewStep = () => {
    const nextErrors = {
      consent: form.consent ? "" : "You must confirm this information is accurate.",
    };
    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!validateReviewStep()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1100));
      setSubmitted(true);
      localStorage.removeItem("providerOnboarding");
    } catch (error) {
      alert("We couldn't submit your profile. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-[#F7FAFF] pt-[72px]">
          <div className="mx-auto max-w-[1040px] px-5 py-10">
            <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
              <section className="rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <i className="fas fa-clock text-amber-600"></i>
                  Verification pending
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-[#1A1A1A]">Profile submitted for review</h2>
                <p className="mb-6 text-sm text-gray-600">
                  Your details are under review. We will notify you when verification is complete.
                </p>
                <div className="space-y-3 text-sm text-gray-700 mb-7">
                  <div className="flex gap-2">
                    <i className="fas fa-check text-[#1F8A57] mt-0.5"></i>
                    <p>We verify identity and service information for trust and safety.</p>
                  </div>
                  <div className="flex gap-2">
                    <i className="fas fa-check text-[#1F8A57] mt-0.5"></i>
                    <p>Keep your availability updated so requests can be matched quickly.</p>
                  </div>
                  <div className="flex gap-2">
                    <i className="fas fa-check text-[#1F8A57] mt-0.5"></i>
                    <p>You can return to edit profile details while review is pending.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-lg bg-[#0057FF] px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    onClick={() => setSubmitted(false)}
                  >
                    ← Edit profile
                  </button>
                  <Link to="/" className="rounded-lg border border-[#E8F0FF] px-6 py-3 font-semibold text-[#1A1A1A] hover:bg-gray-50">
                    Back to home
                  </Link>
                </div>
              </section>

              <aside className="rounded-2xl border border-[#DCE9FF] bg-[#F8FBFF] p-6 shadow-sm h-fit md:sticky md:top-24">
                <h3 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Profile preview</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">SureLink Provider</p>
                    <div className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 mt-1">
                      Pending review
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#E8F0FF]">
                    <p className="text-gray-600">{form.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{form.area} + {form.radius}km radius</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{form.openForWork ? <><i className="fas fa-check text-[#1F8A57] mr-1"></i>Open for work</> : <><i className="fas fa-times text-gray-400 mr-1"></i>Currently unavailable</>}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ID verified</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#F7FAFF] pt-[72px]">
        <div className="mx-auto max-w-[1040px] px-5 py-10">
          {/* Header with step indicator */}
          <div className="mb-8 rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#3A9AFF]">Provider onboarding</p>
            <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A]">Step 3: Review</h1>
            <p className="mb-6 text-sm text-gray-600">Review your information before final submission. Make sure everything is accurate.</p>
            
            {/* Step indicators */}
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A9AFF] text-sm font-bold text-white"><i className="fas fa-check"></i></div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Profile</span>
              </div>
              <div className="flex items-center gap-1 text-[#D9E7FF]">—</div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A9AFF] text-sm font-bold text-white"><i className="fas fa-check"></i></div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Verification</span>
              </div>
              <div className="flex items-center gap-1 text-[#D9E7FF]">—</div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A9AFF] text-sm font-bold text-white">3</div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Review</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
            {/* Main form */}
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* Service Details Section */}
              <section className="rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Service details</h3>
                <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#F8FBFF] p-3">
                    <p className="text-xs font-semibold text-[#3A9AFF] mb-1">Primary category</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.category || "-"}</p>
                  </div>
                  <div className="rounded-lg bg-[#F8FBFF] p-3">
                    <p className="text-xs font-semibold text-[#3A9AFF] mb-1">Secondary category</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.secondaryCategory || "-"}</p>
                  </div>
                  <div className="rounded-lg bg-[#F8FBFF] p-3">
                    <p className="text-xs font-semibold text-[#3A9AFF] mb-1">Service area</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.area || "-"}</p>
                  </div>
                  <div className="rounded-lg bg-[#F8FBFF] p-3">
                    <p className="text-xs font-semibold text-[#3A9AFF] mb-1">Service radius</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.radius} km</p>
                  </div>
                  <div className="rounded-lg bg-[#F8FBFF] p-3">
                    <p className="text-xs font-semibold text-[#3A9AFF] mb-1">Starting price</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.basePrice ? `GHS ${form.basePrice}` : "Not set"}</p>
                  </div>
                  <div className="rounded-lg bg-[#F8FBFF] p-3">
                    <p className="text-xs font-semibold text-[#3A9AFF] mb-1">Availability</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.openForWork ? <><i className="fas fa-check text-[#1F8A57] mr-1"></i>Open</> : <><i className="fas fa-times text-gray-400 mr-1"></i>Unavailable</>}</p>
                  </div>
                </div>
              </section>

              {/* Bio Section */}
              <section className="rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Professional bio</h3>
                <div className="rounded-lg bg-[#F8FBFF] p-4 text-sm text-gray-700 border border-[#E8F0FF]">
                  <p>{form.bio || "-"}</p>
                </div>
              </section>

              {/* Verification Section */}
              <section className="rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Verification details</h3>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-[#FFF9F5] p-3 border border-[#FFE9D8]">
                    <p className="text-xs font-semibold text-[#CC6D1E] mb-1">ID type</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.idType || "-"}</p>
                  </div>
                  <div className="rounded-lg bg-[#FFF9F5] p-3 border border-[#FFE9D8]">
                    <p className="text-xs font-semibold text-[#CC6D1E] mb-1">ID number</p>
                    <p className="font-semibold text-[#1A1A1A]">{form.idNumber ? `${form.idNumber.slice(0, -3)}***` : "-"}</p>
                  </div>
                </div>
              </section>

              {/* Consent Section */}
              <section className="rounded-2xl border border-[#DCE9FF] bg-white p-7 shadow-sm">
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    disabled={loading}
                    onChange={(e) => updateField("consent", e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#0057FF]"
                  />
                  <span className="font-semibold">I confirm these details are accurate and agree to the verification process.</span>
                </label>
                {fieldErrors.consent && <p className="text-xs text-red-600 mt-2">{fieldErrors.consent}</p>}
              </section>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/provider-onboarding/verification")}
                  className="rounded-lg border border-[#E8F0FF] px-6 py-3 font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
                >
                  ← Back to verification
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.consent}
                  className="ml-auto rounded-lg bg-[#3A9AFF] px-6 py-3 font-semibold text-white hover:bg-[#2B8DEB] disabled:opacity-60 transition"
                >
                  {loading ? "Submitting..." : "Submit profile"}
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="h-fit rounded-2xl border border-[#DCE9FF] bg-white p-6 shadow-sm md:sticky md:top-24">
              <h3 className="mb-4 text-lg font-semibold text-[#1A1A1A]">What happens next?</h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#EAF2FF] text-xs font-bold text-[#2C5DB6]">1</div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Submit profile</p>
                    <p className="text-xs text-gray-600 mt-1">Your information is securely submitted.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#FFF4E9] text-xs font-bold text-[#CC6D1E]">2</div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Verification review</p>
                    <p className="text-xs text-gray-600 mt-1">Usually 24-48 hours. We'll email you updates.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#EAFBF2] text-xs font-bold text-[#1F8A57]">3</div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">Go live</p>
                    <p className="text-xs text-gray-600 mt-1">Start receiving requests from customers.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[#F5F8FF] p-3 text-xs text-[#2C5DB6]">
                <i className="fas fa-lightbulb mr-2"></i>
                Questions? Check out our Provider Help Center.
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderOnboardingStep3Review;
