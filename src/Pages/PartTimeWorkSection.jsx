// components/PartTimeWorkSection.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PartTimeTicker from "../components/PartTimeWorkCard";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBriefcase,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaSpinner,
  FaBuilding,
  FaUsers,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";

function PartTimeWorkSection() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFormData, setApplyFormData] = useState({
    name: "",
    phone: "",
    email: "",
    experience: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Mock data for part-time work
  const mockWorkData = {
    id: 1,
    title: "Event Staff Needed - Tech Conference 2026",
    company: "EventPro Solutions",
    companyLogo:
      "https://ui-avatars.com/api/?name=EventPro&background=0057FF&color=fff&size=64",
    location: "Accra International Conference Centre",
    salary: "GH₵ 250/day",
    type: "Part-Time",
    category: "Events & Hospitality",
    urgency: "Urgent",
    postedDate: "2026-07-17",
    deadline: "2026-07-25",
    slotsAvailable: 5,
    applicantsCount: 12,
    rating: 4.5,
    reviews: 23,
    description: `We are looking for enthusiastic and reliable event staff to assist at the upcoming Tech Conference 2026. This is a great opportunity to gain experience in event management and networking.

Responsibilities:
- Assist with event setup and breakdown
- Manage registration desk
- Guide attendees to sessions
- Provide general support to event organizers
- Ensure smooth flow of activities

Requirements:
- Excellent communication skills
- Professional appearance
- Ability to stand for extended periods
- Previous event experience is a plus
- Must be punctual and reliable`,
    requirements: [
      "Must be 18 years or older",
      "Fluent in English",
      "Professional demeanor",
      "Available for full event duration",
      "Own transportation to venue",
    ],
    benefits: [
      "Competitive daily rate",
      "Free lunch and refreshments",
      "Networking opportunities",
      "Certificate of participation",
      "Potential for future events",
    ],
    schedule: "8:00 AM - 6:00 PM (3 days)",
    startDate: "2026-07-28",
    duration: "3 days",
  };

  // Handle View Details
  const handleViewDetails = (work) => {
    setSelectedWork(mockWorkData);
    setShowViewModal(true);
  };

  // Handle Apply
  const handleApply = (work) => {
    setSelectedWork(mockWorkData);
    setApplyFormData({
      name: "",
      phone: "",
      email: "",
      experience: "",
      message: "",
    });
    setApplySuccess(false);
    setShowApplyModal(true);
  };

  // Handle Apply Form Submit
  const handleApplySubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!applyFormData.name || !applyFormData.phone || !applyFormData.email) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setApplySuccess(true);

      // Reset after 2 seconds and close modal
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
        setApplyFormData({
          name: "",
          phone: "",
          email: "",
          experience: "",
          message: "",
        });
      }, 2000);
    }, 1500);
  };

  // Handle Apply Form Change
  const handleApplyChange = (e) => {
    setApplyFormData({
      ...applyFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="bg-[#F5F8FF] py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
                🔥 Part-Time Work
              </h2>
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Scroll through live opportunities • Updated in real-time
            </p>
          </div>
          <Link
            to="/part-time/all"
            className="text-sm text-[#0057FF] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View all
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0FF] text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#0057FF]">156</div>
            <div className="text-xs text-gray-500">Active Opportunities</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0FF] text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-500">12</div>
            <div className="text-xs text-gray-500">Urgent Jobs</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F0FF] text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#00A86B]">89</div>
            <div className="text-xs text-gray-500">Active Providers</div>
          </div>
        </div>

        {/* Ticker Component */}
        <PartTimeTicker onViewDetails={handleViewDetails} onApply={handleApply}>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails()}
              className="px-3 py-2 border border-[#aaabb1] rounded-lg text-[#0057FF]"
            >
              View
            </button>

            <button
              onClick={() => handleApply()}
              className="px-3 py-2 bg-[#f7f9fc] text-white rounded-lg"
            >
              Apply
            </button>
          </div>
        </PartTimeTicker>

        {/* Quick Action for Providers */}
        <div className="mt-6 text-center">
          <Link
            to="/provider/create-part-time"
            className="inline-flex items-center gap-2 bg-[#0057FF] text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-[#0057FF]/20"
          >
            <i className="fa-solid fa-plus"></i>
            Post a Part-Time Opportunity
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Providers: Find skilled workers for your projects
          </p>
        </div>
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedWork && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          />
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl animate-scaleIn p-6 md:p-8">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={selectedWork.companyLogo}
                  alt={selectedWork.company}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">
                      {selectedWork.title}
                    </h2>
                    {selectedWork.urgency === "Urgent" && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaBuilding className="text-[#0057FF]" />
                    {selectedWork.company}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <FaMapMarkerAlt className="text-[#0057FF]" />
                      {selectedWork.location}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <FaMoneyBillWave className="text-[#0057FF]" />
                      {selectedWork.salary}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <FaClock className="text-[#0057FF]" />
                      {selectedWork.schedule}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <FaUsers className="text-[#0057FF]" />
                      {selectedWork.slotsAvailable} slots left
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Description</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedWork.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">
                    Requirements
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedWork.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <FaCheckCircle className="text-[#0057FF] text-sm mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">Benefits</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedWork.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <FaStar className="text-amber-400 text-sm mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">Posted</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {new Date(selectedWork.postedDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">Deadline</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {new Date(selectedWork.deadline).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">Start Date</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {new Date(selectedWork.startDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {selectedWork.duration}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-amber-400" />
                    <span className="font-bold text-gray-800">
                      {selectedWork.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({selectedWork.reviews} reviews)
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {selectedWork.applicantsCount} applicants
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleApply(selectedWork);
                  }}
                  className="flex-1 min-w-[100px] px-4 py-3 bg-gradient-to-r from-[#0057FF] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 min-w-[100px] px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedWork && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowApplyModal(false)}
          />
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scaleIn p-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>

              {applySuccess ? (
                // Success State
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your application for "{selectedWork.title}" has been sent
                    successfully. The provider will contact you soon.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#0057FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaBriefcase className="text-2xl text-[#0057FF]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      Apply for Position
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedWork.title} - {selectedWork.company}
                    </p>
                  </div>

                  {/* Apply Form */}
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={applyFormData.name}
                          onChange={handleApplyChange}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={applyFormData.phone}
                          onChange={handleApplyChange}
                          placeholder="Enter your phone number"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={applyFormData.email}
                          onChange={handleApplyChange}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <select
                        name="experience"
                        value={applyFormData.experience}
                        onChange={handleApplyChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all bg-white"
                      >
                        <option value="">Select experience level</option>
                        <option value="entry">Entry Level (0-1 years)</option>
                        <option value="intermediate">
                          Intermediate (2-4 years)
                        </option>
                        <option value="experienced">
                          Experienced (5+ years)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Message
                      </label>
                      <textarea
                        name="message"
                        value={applyFormData.message}
                        onChange={handleApplyChange}
                        placeholder="Why are you a good fit for this role?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all resize-none"
                        rows="3"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <FaInfoCircle className="text-amber-500 text-sm mt-0.5" />
                        <p className="text-xs text-amber-700">
                          By applying, you agree to share your contact
                          information with the provider.
                          {selectedWork.slotsAvailable > 0 && (
                            <span className="block mt-1">
                              <span className="font-bold">
                                {selectedWork.slotsAvailable}
                              </span>{" "}
                              slots available
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0057FF] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default PartTimeWorkSection;
