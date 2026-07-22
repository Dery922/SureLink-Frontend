// src/pages/ProviderDashboard.jsx - Updated with real stats

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../APIs/api";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaWallet,
  FaBriefcase,
  FaArrowRight,
  FaChevronDown,
  FaPlus,
  FaTimes,
  FaShieldAlt,
  FaCrown,
  FaCheck,
  FaCreditCard,
  FaLock,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import { logoutUser } from "../../redux/features/auth/authSlice";
import ProfileOptimizationCenter from "../../components/ProfileOptimizationCenter";
import HighDemandAreas from "../../components/HighDemandArea";
import NavbarDashbaord from "../../components/NavbarDashboard";
import { useProviderDashboard } from "../../hooks/useProviderStats";

const ProviderDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ==========================================
  // USE PROVIDER DASHBOARD HOOK
  // ==========================================
  const { dashboardData, loading, error, refetch } = useProviderDashboard();

  // Refs for dropdown
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Subscription plans
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 49,
      currency: "GHS",
      interval: "monthly",
      features: [
        "Up to 10 job requests per month",
        "Basic analytics",
        "Email support",
        "Standard listing visibility",
      ],
      icon: FaShieldAlt,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "pro",
      name: "Professional",
      price: 99,
      currency: "GHS",
      interval: "monthly",
      features: [
        "Unlimited job requests",
        "Advanced analytics",
        "Priority support (24/7)",
        "Premium listing visibility",
        "Featured profile badge",
        "Early access to high-value jobs",
      ],
      icon: FaCrown,
      color: "from-amber-400 to-amber-600",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      currency: "GHS",
      interval: "monthly",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom analytics dashboard",
        "API access",
        "White-label solutions",
        "Multi-team management",
      ],
      icon: FaShieldAlt,
      color: "from-purple-400 to-purple-600",
    },
  ];

  // Sample data
  const requests = [
    {
      id: 1,
      consumer: "Jane Smith",
      service: "Plumbing Service",
      amount: "GH₵ 150",
      date: "2026-07-15",
      location: "Accra, Ghana",
      avatar: "/default-avatar.png",
    },
    // ... more requests
  ];

  const recentEarnings = [
    {
      id: 1,
      service: "Plumbing Service",
      consumer: "Jane Smith",
      amount: "GH₵ 150",
      date: "2026-07-14",
    },
    // ... more earnings
  ];

  // Paystack configuration
  const paystackConfig = {
    reference: `${user?.id}_${Date.now()}`,
    email: user?.email || "provider@example.com",
    amount: selectedPlan ? selectedPlan.price * 100 : 0,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "pk_test_...",
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: selectedPlan?.name || "",
        },
        {
          display_name: "User ID",
          variable_name: "user_id",
          value: user?.id || "",
        },
      ],
    },
  };

  // Initialize Paystack
  const initializePayment = usePaystackPayment(paystackConfig);

  const userFirstName = (() => {
    if (user?.first && typeof user.first === "string") return user.first;
    if (user?.firstName && typeof user.firstName === "string")
      return user.firstName;
    if (user?.name?.first && typeof user.name.first === "string")
      return user.name.first;

    const targetFullName = user?.full || user?.fullName || user?.name?.full;
    if (targetFullName && typeof targetFullName === "string") {
      const parts = targetFullName.trim().split(" ");
      if (parts.length > 0) return parts[0];
    }

    return "User";
  })();

  const initialLetter =
    userFirstName &&
    typeof userFirstName === "string" &&
    userFirstName !== "User"
      ? userFirstName.charAt(0).toUpperCase()
      : "U";

  // Handlers
  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("authToken");

      if (token) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (err) {
      console.warn(
        "Backend session invalidation rejected or unreachable:",
        err.message,
      );
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("profile_draft_key");

      dispatch(logoutUser());
      setDropdownOpen(false);
      setMenuOpen(false);
      navigate("/");
    }
  };

  const handleAccept = (requestId) => {
    console.log("Accepted request:", requestId);
  };

  const handleDecline = (requestId) => {
    console.log("Declined request:", requestId);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (dropdownOpen && event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [dropdownOpen]);

  // Handle subscription
  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowSubscribeModal(false);

    setIsProcessing(true);

    const config = {
      ...paystackConfig,
      amount: plan.price * 100,
      metadata: {
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: plan.name,
          },
          {
            display_name: "Plan ID",
            variable_name: "plan_id",
            value: plan.id,
          },
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user?.id || "",
          },
          {
            display_name: "Email",
            variable_name: "email",
            value: user?.email || "",
          },
        ],
      },
    };

    setTimeout(() => {
      setIsProcessing(false);
      setIsSubscribed(true);
      setSubscriptionPlan(plan);
      setShowSuccessModal(true);
      toast.success(`Successfully subscribed to ${plan.name} plan!`);
    }, 2000);
  };

  const onPaystackSuccess = (reference) => {
    setIsProcessing(false);
    setIsSubscribed(true);
    setSubscriptionPlan(selectedPlan);
    setShowSuccessModal(true);
    toast.success(`Successfully subscribed to ${selectedPlan?.name} plan!`);
  };

  const onPaystackClose = () => {
    setIsProcessing(false);
    toast.info("Payment cancelled");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (dropdownOpen && event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [dropdownOpen]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userServices = user?.services ||
    user?.provider_profile?.secondaryCategories || ["General Services"];

  // ==========================================
  // RENDER STAT CARDS WITH REAL DATA
  // ==========================================
  const renderStatCards = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8F0FF] animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-28" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="mt-2 text-sm text-[#0057FF] hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!dashboardData) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              title: "Total Earnings",
              value: "GH₵ 0",
              icon: FaWallet,
              color: "from-[#0057FF] to-[#0066FF]",
              subtitle: "No earnings yet",
            },
            {
              title: "Jobs Completed",
              value: "0",
              icon: FaCheckCircle,
              color: "from-emerald-500 to-emerald-600",
              subtitle: "Start your first job",
            },
            {
              title: "Pending Requests",
              value: "0",
              icon: FaClock,
              color: "from-amber-500 to-amber-600",
              subtitle: "No pending requests",
            },
            {
              title: "Average Rating",
              value: "0",
              icon: FaStar,
              color: "from-purple-500 to-purple-600",
              subtitle: "Be the first to get rated",
            },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden animate-fadeInUp`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/80 text-sm font-medium">
                    {stat.title}
                  </p>
                  <stat.icon className="text-white/60 text-lg" />
                </div>
                <p className="text-white text-3xl font-bold">{stat.value}</p>
                <p className="text-white/70 text-xs mt-2">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const {
      today,
      upcoming,
      pendingRequests,
      completedJobs,
      averageRating,
      totalRatings,
    } = dashboardData;

    const statCards = [
      {
        title: "Today's Earnings",
        value: `GH₵ ${today.revenue.toFixed(2)}`,
        icon: FaWallet,
        color: "from-[#0057FF] to-[#0066FF]",
        subtitle: `${today.bookings} jobs today`,
      },
      {
        title: "Jobs Completed",
        value: completedJobs.toString(),
        icon: FaCheckCircle,
        color: "from-emerald-500 to-emerald-600",
        subtitle: `${upcoming} upcoming jobs`,
      },
      {
        title: "Pending Requests",
        value: pendingRequests.toString(),
        icon: FaClock,
        color: "from-amber-500 to-amber-600",
        subtitle: "Awaiting response",
      },
      {
        title: "Average Rating",
        value: averageRating > 0 ? averageRating.toFixed(1) : "0.0",
        icon: FaStar,
        color: "from-purple-500 to-purple-600",
        subtitle: `⭐ ${totalRatings} reviews`,
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden animate-fadeInUp`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/80 text-sm font-medium">
                  {stat.title}
                </p>
                <stat.icon className="text-white/60 text-lg" />
              </div>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
              <p className="text-white/70 text-xs mt-2">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ==========================================
  // RENDER RECENT BOOKINGS
  // ==========================================
  const renderRecentBookings = () => {
    if (loading) {
      return (
        <div className="bg-white border border-[#E8F0FF] rounded-2xl overflow-hidden shadow-sm">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-5 ${
                index < 2 ? "border-b border-[#E8F0FF]" : ""
              } animate-pulse`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-24 mt-1" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-12 mt-1" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (
      !dashboardData ||
      !dashboardData.recentBookings ||
      dashboardData.recentBookings.length === 0
    ) {
      return (
        <div className="bg-white border border-[#E8F0FF] rounded-2xl p-12 text-center">
          <FaCheckCircle className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No recent bookings</p>
          <p className="text-sm text-gray-300">
            Your recent bookings will appear here
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-[#E8F0FF] rounded-2xl overflow-hidden shadow-sm">
        {dashboardData.recentBookings.map((booking, index) => (
          <div
            key={booking.id || index}
            className={`flex items-center justify-between p-5 hover:bg-[#F8FAFF] transition-colors duration-200 ${
              index < dashboardData.recentBookings.length - 1
                ? "border-b border-[#E8F0FF]"
                : ""
            } animate-fadeInRight`}
            style={{ animationDelay: `${0.4 + index * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0057FF]">
                <FaBriefcase className="text-sm" />
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A] text-sm">
                  {booking.serviceName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {booking.customerName} • {booking.bookingTime || "Flexible"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#1A1A1A] text-sm">
                GH₵ {booking.totalAmount?.toFixed(2) || "0.00"}
              </p>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                  booking.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : booking.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : booking.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                }`}
              >
                {booking.status || "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ==========================================
  // RENDER SUBSCRIPTION BANNER
  // ==========================================
  const renderSubscriptionBanner = () => {
    if (isSubscribed) {
      return (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-4 mb-10 animate-fadeInUp">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <FaCheck className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800">
                  Active Subscription
                </h3>
                <p className="text-sm text-emerald-600">
                  You're on the <strong>{subscriptionPlan?.name}</strong> plan •
                  Next billing:{" "}
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
                Active
              </span>
              <button className="text-sm text-emerald-700 hover:text-emerald-900 font-medium hover:underline">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-10 animate-fadeInUp">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0057FF] flex items-center justify-center text-white">
              <FaCrown className="text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                Unlock Premium Features
              </h3>
              <p className="text-sm text-gray-600">
                Subscribe to get more job requests, analytics, and priority
                support
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSubscribeModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <FaCrown className="text-sm" />
            Subscribe Now
          </button>
        </div>
      </div>
    );
  };

  // Subscribe Modal
  const renderSubscribeModal = () => {
    if (!showSubscribeModal) return null;

    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSubscribeModal(false)}
        />

        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl animate-fadeInUp p-6 md:p-8">
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4">
                <FaCrown className="text-3xl text-[#0057FF]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Choose Your Plan
              </h2>
              <p className="text-gray-500 mt-2">
                Select the perfect plan for your business needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isPopular = plan.popular;
                const isSelected = selectedPlan?.id === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border-[#0057FF] shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    } ${isPopular ? "md:scale-105" : ""}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full">
                        Most Popular
                      </div>
                    )}

                    <div className="p-6">
                      <div
                        className={`inline-block p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white mb-4`}
                      >
                        <Icon className="text-2xl" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {plan.name}
                      </h3>

                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-800">
                          GH₵{plan.price}
                        </span>
                        <span className="text-gray-500 text-sm">
                          /{plan.interval}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <FaCheck className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan)}
                        className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white shadow-lg shadow-blue-200 hover:shadow-xl"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected ? "Subscribe Now" : "Select Plan"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaLock className="text-xs" />
                <span>Secure payment with Paystack</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Cancel anytime • No hidden fees • 14-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Success Modal
  const renderSuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 z-[200] overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSuccessModal(false)}
        />

        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scaleIn p-8 text-center">
            <div className="inline-block p-4 rounded-full bg-emerald-100 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center">
                <FaCheck className="text-3xl text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Subscription Successful! 🎉
            </h2>
            <p className="text-gray-500 mb-6">
              You're now on the{" "}
              <strong className="text-gray-700">
                {subscriptionPlan?.name}
              </strong>{" "}
              plan. Start enjoying premium features immediately.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                <span className="text-gray-500">Plan</span>
                <span className="font-semibold text-gray-800">
                  {subscriptionPlan?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-gray-800">
                  GH₵{subscriptionPlan?.price}/{subscriptionPlan?.interval}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-300"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Processing overlay
  const renderProcessingOverlay = () => {
    if (!isProcessing) return null;

    return (
      <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full rounded-full border-4 border-[#0057FF] border-t-transparent animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Processing Payment
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we confirm your subscription...
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] min-h-screen pt-[72px]">
      {/* Navbar */}
      <NavbarDashbaord />

      {/* Page Content */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <ProfileOptimizationCenter
          user={user}
          onActionClick={(targetPath) => navigate(targetPath)}
        />
        {/* Welcome Section */}
        <div className="mb-10 animate-fadeInUp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                Welcome back, {userFirstName} 👋
              </h1>
              <p className="text-gray-500">
                Here's what's happening with your business today
              </p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <FaPlus className="text-sm" />
              Create New Service
            </button>
          </div>
        </div>

        {/* Subscription Banner */}
        {renderSubscriptionBanner()}

        {/* Stat Cards - NOW WITH REAL DATA */}
        {renderStatCards()}

        <div
          className="mb-10 animate-fadeInUp"
          style={{ animationDelay: "0.15s" }}
        >
          <HighDemandAreas
            userServices={userServices}
            isSubscribed={isSubscribed}
          />
        </div>

        {/* Requests and Earnings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Pending Requests
                </h2>
                <p className="text-sm text-gray-500">
                  Jobs waiting for your response
                </p>
              </div>
              <Link
                to="/provider/jobs"
                className="text-sm text-[#0057FF] hover:underline flex items-center gap-1"
              >
                See all
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white border border-[#E8F0FF] rounded-2xl p-12 text-center">
                <FaCheckCircle className="text-4xl text-emerald-500 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No pending requests</p>
                <p className="text-sm text-gray-300">
                  You're all caught up! 🎉
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {requests.map((request, index) => (
                  <div
                    key={request.id}
                    className="bg-white border border-[#E8F0FF] rounded-2xl p-5 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={request.avatar}
                        alt={request.consumer}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-[#1A1A1A]">
                          {request.consumer}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {request.service}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-[#0057FF]" />
                            {request.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#0057FF]" />
                            {request.location}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#0057FF] text-sm bg-blue-50 px-3 py-1 rounded-lg">
                        {request.amount}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Earnings - NOW WITH REAL DATA */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Recent Activity
                </h2>
                <p className="text-sm text-gray-500">
                  Your latest bookings and transactions
                </p>
              </div>
              <Link
                to="/provider/bookings"
                className="text-sm text-[#0057FF] hover:underline flex items-center gap-1"
              >
                See all
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {renderRecentBookings()}
          </div>
        </div>

        {/* Dashboard Stats Summary */}
        {dashboardData && !loading && (
          <div className="mt-8 p-4 bg-white border border-[#E8F0FF] rounded-xl animate-fadeInUp">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Today's Bookings</p>
                <p className="text-xl font-bold text-[#1A1A1A]">
                  {dashboardData.today?.bookings || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Upcoming</p>
                <p className="text-xl font-bold text-[#1A1A1A]">
                  {dashboardData.upcoming || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Completion Rate</p>
                <p className="text-xl font-bold text-emerald-600">
                  {dashboardData.completedJobs > 0 &&
                  dashboardData.pendingRequests > 0
                    ? `${Math.round((dashboardData.completedJobs / (dashboardData.completedJobs + dashboardData.pendingRequests)) * 100)}%`
                    : "0%"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Reviews</p>
                <p className="text-xl font-bold text-[#FF6B00]">
                  {dashboardData.totalRatings || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {renderSubscribeModal()}
      {renderSuccessModal()}
      {renderProcessingOverlay()}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInRight {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes dropDown {
          from {
            transform: translateY(-10px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }

        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-fadeInRight {
          opacity: 0;
          animation: fadeInRight 0.5s ease-out forwards;
        }

        .animate-dropDown {
          animation: dropDown 0.2s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ProviderDashboard;
