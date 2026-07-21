// src/pages/BookingFlow.jsx - Updated with animated modal

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PaystackPop from "@paystack/inline-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuthCheck from "../hooks/useAuthCheck";
import {
  getProviderById,
  createBooking,
  checkBookingAvailability,
} from "../services/services";
import {
  initializePaystackPayment,
  verifyPaystackPayment,
} from "../services/paystackService";
import toast from "react-hot-toast";
import { useCustomMessage } from "../components/CustomMessage";
import {
  FaMobile,
  FaCreditCard,
  FaMoneyBillWave,
  FaSpinner,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaWrench,
  FaTools,
  FaArrowLeft,
  FaArrowRight,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { PaystackIcon } from "../components/PaystackIcon";

const timeSlots = [
  "8:00 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
];

function BookingFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { checkAuth } = useAuthCheck();

  // Form state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile-money");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedMobileNetwork, setSelectedMobileNetwork] = useState("mtn");
  const [paymentReference, setPaymentReference] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paystackHandler, setPaystackHandler] = useState(null);
  const [showBookingError, setShowBookingError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const {
    success,
    error: showError,
    info,
    warning,
    loading: showLoading,
    errorModal,
  } = useCustomMessage();
  const totalPrice = selectedService
    ? selectedService.basePrice || selectedService.price || 0
    : 0;

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      setAuthChecked(true);
      setLoading(false);
      return;
    }

    try {
      const isAuthed = checkAuth();
      setAuthChecked(true);

      if (!isAuthed) {
        errorModal("error", "Please login or signup to book a service");
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ Auth check error:", error);
      setAuthChecked(true);
      setLoading(false);
    }
  }, [isAuthenticated, user, checkAuth]);

  useEffect(() => {
    if (authChecked && isAuthenticated && !id) {
      setError("Invalid provider ID");
      setLoading(false);
      toast.error("Invalid provider ID");
      navigate("/providers");
    }
  }, [authChecked, isAuthenticated, id, navigate]);

  // Fetch provider data
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!id) {
        setError("Invalid provider ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getProviderById(id);

        if (response && response.success) {
          const responseData = response.data;
          const providerData = responseData.provider || responseData;
          const servicesData = responseData.services || [];

          setProvider(providerData);
          setServices(servicesData);
          setDataFetched(true);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch provider data");
        }
      } catch (err) {
        console.error("❌ Error fetching provider data:", err);
        setError(
          err.message || "Failed to load provider services. Please try again.",
        );
        errorModal("error", "Failed to load services");
        setLoading(false);
      }
    };

    if (authChecked && isAuthenticated && id && !dataFetched) {
      fetchProviderData();
    } else if (authChecked && !isAuthenticated) {
      setLoading(false);
      navigate("/login");
    } else if (authChecked && isAuthenticated && !id) {
      setLoading(false);
    }
  }, [id, authChecked, isAuthenticated, navigate, dataFetched]);

  // ✅ FIXED: Initialize Paystack Inline Modal
  const openPaystackModal = (accessCode, email, amount, reference) => {
    try {
      console.log("🔑 Opening Paystack Modal with:", {
        accessCode,
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      });

      // 1. Initialize Paystack V2 engine instance
      const paystack = new PaystackPop();

      // 2. Open new transaction with correct V2 properties
      paystack.newTransaction({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,

        // ✅ FIX 1: Change to camelCase 'accessCode' without underscores
        accessCode: accessCode,

        // ✅ FIX 2: V2 Callbacks map directly to onSuccess and onCancel
        onSuccess: function (response) {
          console.log("✅ Payment successful:", response);
          setPaymentStatus("success");
          setShowPaymentModal(false);
          setIsProcessingPayment(false);

          // Verify and create booking
          verifyAndCreateBooking(response.reference || reference);
        },
        onCancel: function () {
          console.log("❌ Payment modal closed");
          setPaymentStatus("failed");
          setShowPaymentModal(false);
          setIsProcessingPayment(false);
          toast.error("Payment was cancelled");
        },
      });

      setShowPaymentModal(true);
    } catch (error) {
      console.error("❌ Error opening Paystack modal:", error);
      setPaymentStatus("failed");
      setShowPaymentModal(false);
      setIsProcessingPayment(false);
      toast.error("Failed to open payment modal. Please try again.");
    }
  };

  // Verify payment and create booking
  const verifyAndCreateBooking = async (reference) => {
    try {
      console.log("🔍 Verifying payment:", reference);
      const verification = await verifyPaystackPayment(reference);

      if (verification.success) {
        await createBookingAfterPayment(reference);
      } else {
        setPaymentStatus("failed");
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error("❌ Verification error:", error);
      setPaymentStatus("failed");
      toast.error("Payment verification failed");
    }
  };

  // Handle payment initialization
  const handlePayment = async () => {
    // Validate booking details
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }
    if (!address || !city) {
      toast.error("Please provide your location");
      return;
    }

    // For Cash on Delivery, skip Paystack
    if (paymentMethod === "cash") {
      createBookingWithoutPayment();
      return;
    }

    // For Mobile Money and Debit Card, use Paystack
    setIsProcessingPayment(true);
    setPaymentStatus("processing");

    try {
      // Prepare booking data for Paystack initialization
      const bookingData = {
        providerId: provider._id || provider.id,
        providerName: provider?.name?.full || provider?.name || "Provider",
        serviceId: selectedService._id || selectedService.id,
        serviceName: selectedService.name,
        servicePrice: totalPrice,
        serviceCategory: selectedService.category,
        date: selectedDate,
        time: selectedTime,
        address,
        city,
        paymentMethod,
        mobileNetwork: selectedMobileNetwork,
        customerName: user?.name?.full || user?.email,
        customerEmail: user?.email,
        totalAmount: totalPrice,
      };

      // Initialize payment with backend
      const response = await initializePaystackPayment(bookingData);
      console.log("📦 Paystack initialization response:", response);

      if (response && response.success) {
        const { reference, access_code } = response.data;
        setPaymentReference(reference);

        // ✅ Open the Paystack modal smoothly
        openPaystackModal(
          access_code,
          user?.email || "customer@example.com",
          totalPrice,
          reference,
        );
      } else {
        throw new Error(response?.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("❌ Payment initialization error:", error);
      setIsProcessingPayment(false);
      setPaymentStatus("failed");
      setShowPaymentModal(false);
      toast.error(
        error.message || "Failed to initialize payment. Please try again.",
      );
    }
  };

  // Create booking after successful payment
  const createBookingAfterPayment = async (paymentReference) => {
    if (!selectedService) return toast.error("Please select a service");
    if (!selectedDate) return toast.error("Please select a date");
    if (!selectedTime) return toast.error("Please select a time");
    if (!address || !city) return toast.error("Please provide your location");

    setIsSubmitting(true);

    try {
      const bookingData = {
        providerId: provider._id || provider.id,
        providerName: provider?.name?.full || provider?.name || "Provider",
        serviceId: selectedService._id || selectedService.id,
        serviceName: selectedService.name,
        servicePrice: totalPrice,
        serviceCategory: selectedService.category,
        serviceTypes: selectedService.serviceTypes || [],
        date: selectedDate,
        time: selectedTime,
        address,
        city,
        landmark,
        paymentMethod,
        paymentMethodDetails: {
          network: selectedMobileNetwork,
          reference: paymentReference,
        },
        specialInstructions,
        customerName: user?.name?.full || user?.email,
        totalAmount: totalPrice,
        paymentReference: paymentReference,
        paymentStatus: "completed",
        mobileNetwork: selectedMobileNetwork,
      };

      console.log("📝 Sending Booking Data:", bookingData);
      const response = await createBooking(bookingData);
      console.log("✅ Received Booking response:", response);

      if (response && response.success) {
        toast.success("Booking confirmed successfully!");
        setIsSubmitting(false);
        setPaymentStatus("success");
        setShowPaymentModal(false);

        return navigate(
          `/booking-confirmation/${provider._id || provider.id}`,
          {
            state: {
              booking: bookingData,
              bookingId: response.data?._id || response.data?.id,
              paymentReference: paymentReference,
              paymentStatus: "completed",
            },
          },
        );
      }

      throw new Error(response?.message || "Booking failed. Please try again.");
    } catch (error) {
      console.error("❌ Catch Block Triggered:", error);
      setIsSubmitting(false);
      setPaymentStatus("failed");
      toast.error(
        error.message || "Failed to create booking. Please try again.",
      );
    }
  };

  // Create booking without payment (for Cash on Delivery)
  const createBookingWithoutPayment = async () => {
    if (!selectedService) return toast.error("Please select a service");
    if (!selectedDate) return toast.error("Please select a date");
    if (!selectedTime) return toast.error("Please select a time");
    if (!address || !city) return toast.error("Please provide your location");

    setIsSubmitting(true);

    try {
      const bookingData = {
        providerId: provider._id || provider.id,
        providerName: provider?.name?.full || provider?.name || "Provider",
        serviceId: selectedService._id || selectedService.id,
        serviceName: selectedService.name,
        servicePrice: totalPrice,
        serviceCategory: selectedService.category,
        serviceTypes: selectedService.serviceTypes || [],
        date: selectedDate,
        time: selectedTime,
        address,
        city,
        landmark,
        paymentMethod: "cash",
        specialInstructions,
        customerName: user?.name?.full || user?.email,
        totalAmount: totalPrice,
        paymentStatus: "pending",
      };

      console.log("📝 Sending Booking Data (Cash):", bookingData);
      const response = await createBooking(bookingData);
      console.log("✅ Received Booking response:", response);

      if (response && response.success) {
        toast.success("Booking confirmed successfully!");
        setIsSubmitting(false);

        return navigate(
          `/booking-confirmation/${provider._id || provider.id}`,
          {
            state: {
              booking: bookingData,
              bookingId: response.data?._id || response.data?.id,
              paymentStatus: "pending",
            },
          },
        );
      }

      throw new Error(response?.message || "Booking failed. Please try again.");
    } catch (error) {
      console.error("❌ Catch Block Triggered:", error);
      setIsSubmitting(false);
      toast.error(
        error.message || "Failed to create booking. Please try again.",
      );
    }
  };

  // Get service icon helper
  const getServiceIcon = (service) => {
    const categoryIcons = {
      Plumbing: "fa-wrench",
      Cleaning: "fa-broom",
      Electrical: "fa-bolt",
      Carpentry: "fa-hammer",
      Painting: "fa-paint-roller",
      Gardening: "fa-seedling",
      Photography: "fa-camera",
      Catering: "fa-utensils",
      "Event Planning": "fa-calendar-plus",
      "IT Services": "fa-laptop-code",
      "Mobile Car Wash": "fa-car",
      "Auto Repair": "fa-car-repair",
      Handyman: "fa-toolbox",
      "Moving Services": "fa-truck",
      "Junk Removal": "fa-trash",
      "Security Systems": "fa-shield-halved",
      "Smart Home": "fa-house-signal",
      "Interior Design": "fa-pencil-ruler",
      "Pool Maintenance": "fa-water",
      HVAC: "fa-snowflake",
      Roofing: "fa-house",
      Flooring: "fa-layer-group",
      Tiling: "fa-th-large",
      Landscaping: "fa-tree",
      "Appliance Repair": "fa-tools",
      "Pest Control": "fa-bug",
      "Glass Repair": "fa-window-maximize",
      Locksmith: "fa-lock",
      "Fitness Training": "fa-dumbbell",
      "Massage Therapy": "fa-hand-sparkles",
      "Hair & Beauty": "fa-cut",
      Tutoring: "fa-graduation-cap",
      "Music Lessons": "fa-music",
      "Video Editing": "fa-video",
      "Graphic Design": "fa-palette",
      "Web Development": "fa-code",
      "Digital Marketing": "fa-bullhorn",
      "Content Writing": "fa-pen-fancy",
    };

    if (service.category && categoryIcons[service.category]) {
      return categoryIcons[service.category];
    }

    return "fa-wrench";
  };

  // ✅ FIXED: handleStep2Next now properly checks availability
  const handleStep2Next = async () => {
    if (isCheckingAvailability) return;

    setIsCheckingAvailability(true);
    try {
      const response = await checkBookingAvailability({
        providerId: provider._id,
        date: selectedDate,
        time: selectedTime,
      });

      if (response.success) {
        setStep(3);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setModalMessage(error.response.data.message);
        setShowBookingError(true);
        return;
      }

      console.error(error);
      setModalMessage(
        "Unable to check booking availability. Please try again.",
      );
      setShowBookingError(true);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Loading state
  if (loading || !authChecked) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E8F0FF] border-t-[#0057FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">
              {!authChecked
                ? "Checking authentication..."
                : "Loading booking details..."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error || !provider) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
              Unable to Load Services
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {error || "The provider you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/providers")}
              className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Browse Providers
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Step render functions
  const renderStep1 = () => (
    <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
            Select a Service
          </h2>
          <p className="text-gray-500">
            Choose the service you need from{" "}
            {provider?.name?.full || provider?.name || "Provider"}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-gray-400">Booking as</p>
          <p className="font-medium text-[#1A1A1A]">
            {user?.name?.full || user?.email || "User"}
          </p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTools className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            No Services Available
          </h3>
          <p className="text-sm text-gray-400">
            This provider hasn't added any services yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {services.map((service) => {
            const price = service.basePrice || service.price || 0;
            const priceType = service.priceType || "fixed";
            const priceDisplay = priceType === "hourly" ? "/hr" : "";

            return (
              <button
                key={service._id || service.id}
                onClick={() => setSelectedService(service)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedService?._id === service._id ||
                  selectedService?.id === service.id
                    ? "border-[#0057FF] bg-[#F5F8FF]"
                    : "border-[#E8F0FF] hover:border-[#0057FF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E8F0FF] rounded-lg flex items-center justify-center">
                        <i
                          className={`fa-solid ${getServiceIcon(service)} text-[#0057FF]`}
                        ></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#1A1A1A]">
                          {service.name}
                        </h3>
                        {service.category && (
                          <span className="text-xs text-gray-400">
                            {service.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {service.description || "No description available"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      {service.serviceTypes &&
                        service.serviceTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {service.serviceTypes.map((type, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-xl text-[#0057FF]">
                      GH₵ {price}
                      {priceDisplay}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!selectedService}
          className={`px-8 py-3 font-bold rounded-lg transition-colors ${
            selectedService
              ? "bg-[#0057FF] text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <FaArrowRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );

  // ✅ FIXED: renderStep2 now calls handleStep2Next
  const renderStep2 = () => (
    <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
        Pick a Date & Time
      </h2>
      <p className="text-gray-500 mb-8">When do you need the service?</p>

      <div className="mb-8">
        <label className="block text-sm font-bold text-[#1A1A1A] mb-3">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-[#1A1A1A] mb-3">
          Select Time
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-3 rounded-xl border-2 font-bold transition-all ${
                selectedTime === time
                  ? "border-[#0057FF] bg-[#0057FF] text-white"
                  : "border-[#E8F0FF] text-gray-700 hover:border-[#0057FF]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
        >
          <FaArrowLeft className="inline mr-2" /> Back
        </button>
        <button
          onClick={handleStep2Next}
          disabled={!selectedDate || !selectedTime || isCheckingAvailability}
          className={`px-8 py-3 font-bold rounded-lg transition-colors flex items-center gap-2 ${
            selectedDate && selectedTime && !isCheckingAvailability
              ? "bg-[#0057FF] text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isCheckingAvailability ? (
            <>
              <FaSpinner className="animate-spin" />
              Checking...
            </>
          ) : (
            <>
              Next <FaArrowRight className="inline ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
        Enter Your Location
      </h2>
      <p className="text-gray-500 mb-8">
        Where should the service be provided?
      </p>

      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
            Street Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 123 Main Street"
            className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Accra"
              className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Near the market"
              className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
        >
          <FaArrowLeft className="inline mr-2" /> Back
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!address || !city}
          className={`px-8 py-3 font-bold rounded-lg transition-colors ${
            address && city
              ? "bg-[#0057FF] text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <FaArrowRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 4: Confirm & Pay
  const renderStep4 = () => {
    const price = selectedService?.basePrice || selectedService?.price || 0;
    const priceType = selectedService?.priceType || "fixed";
    const priceDisplay = priceType === "hourly" ? "/hr" : "";

    const mobileNetworks = [
      { id: "mtn", name: "MTN", icon: "📱" },
      { id: "vodafone", name: "Vodafone", icon: "📱" },
      { id: "airteltigo", name: "AirtelTigo", icon: "📱" },
    ];

    return (
      <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Confirm & Pay
        </h2>
        <p className="text-gray-500 mb-8">
          Review your booking details and select a payment method
        </p>

        {/* Test Mode Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <FaInfoCircle className="text-amber-600 text-xl mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700">
              Test Mode Active
            </p>
            <p className="text-xs text-amber-600">
              Use test card: 4242 4242 4242 4242 | Exp: 12/25 | CVV: 123
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <FaUser className="text-blue-600" />
          <div>
            <p className="text-sm text-blue-700">
              Booking as <strong>{user?.name?.full || user?.email}</strong>
            </p>
            <p className="text-xs text-blue-500">
              You're logged in and ready to book
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E8F0FF] rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
            Booking Summary
          </h3>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E8F0FF]">
            <img
              src={
                provider?.avatar?.url ||
                provider?.avatar ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
              }
              alt={provider?.name?.full || provider?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-[#1A1A1A]">
                {provider?.name?.full || provider?.name || "Provider"}
              </p>
              <p className="text-sm text-gray-500">{selectedService?.name}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 pb-6 border-b border-[#E8F0FF]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <FaWrench className="inline mr-2" />
                Service
              </span>
              <span className="font-bold text-[#1A1A1A]">
                {selectedService?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <FaCalendarAlt className="inline mr-2" />
                Date
              </span>
              <span className="font-bold text-[#1A1A1A]">{selectedDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <FaClock className="inline mr-2" />
                Time
              </span>
              <span className="font-bold text-[#1A1A1A]">{selectedTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <FaMapMarkerAlt className="inline mr-2" />
                Location
              </span>
              <span className="font-bold text-[#1A1A1A]">{city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1A1A1A]">Total</span>
            <span className="font-bold text-2xl text-[#0057FF]">
              GH₵ {price}
              {priceDisplay}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">
            Payment Method
          </h3>

          <div className="space-y-3">
            {/* Mobile Money */}
            <div
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "mobile-money"
                  ? "border-[#0057FF] bg-[#F5F8FF]"
                  : "border-[#E8F0FF] hover:border-[#0057FF]"
              }`}
            >
              <button
                onClick={() => setPaymentMethod("mobile-money")}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F0FF] rounded-lg flex items-center justify-center">
                    <FaMobile className="text-[#0057FF] text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1A1A1A]">Mobile Money</p>
                    <p className="text-sm text-gray-500">
                      MTN, Vodafone, AirtelTigo
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PaystackIcon size={28} className="text-[#0057FF]" />
                    <span className="text-xs text-gray-400">
                      Secured by Paystack
                    </span>
                  </div>
                </div>
              </button>

              {paymentMethod === "mobile-money" && (
                <div className="mt-4 pt-4 border-t border-[#E8F0FF]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Select your network:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {mobileNetworks.map((network) => (
                      <button
                        key={network.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMobileNetwork(network.id);
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          selectedMobileNetwork === network.id
                            ? "border-[#0057FF] bg-[#F5F8FF]"
                            : "border-gray-200 hover:border-[#0057FF]"
                        }`}
                      >
                        <div className="text-2xl">{network.icon}</div>
                        <p className="text-xs font-medium mt-1">
                          {network.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Debit Card */}
            <button
              onClick={() => setPaymentMethod("debit-card")}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === "debit-card"
                  ? "border-[#0057FF] bg-[#F5F8FF]"
                  : "border-[#E8F0FF] hover:border-[#0057FF]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F0FF] rounded-lg flex items-center justify-center">
                  <FaCreditCard className="text-[#0057FF] text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1A1A1A]">Debit Card</p>
                  <p className="text-sm text-gray-500">Visa, MasterCard</p>
                </div>
                <div className="flex items-center gap-2">
                  <PaystackIcon size={28} className="text-[#0057FF]" />
                  <span className="text-xs text-gray-400">
                    Secured by Paystack
                  </span>
                </div>
              </div>
            </button>

            {/* Cash on Delivery */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === "cash"
                  ? "border-[#0057FF] bg-[#F5F8FF]"
                  : "border-[#E8F0FF] hover:border-[#0057FF]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F0FF] rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="text-[#0057FF] text-xl" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Pay when service is complete
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests or instructions for the provider..."
            className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF] resize-none h-[100px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(3)}
            className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
          >
            <FaArrowLeft className="inline mr-2" /> Back
          </button>
          <button
            onClick={handlePayment}
            disabled={isSubmitting || isProcessingPayment}
            className={`px-8 py-3 font-bold rounded-lg transition-colors flex items-center gap-2 ${
              isSubmitting || isProcessingPayment
                ? "bg-gray-400 cursor-not-allowed"
                : paymentMethod === "cash"
                  ? "bg-[#FF6B00] text-white hover:bg-orange-600"
                  : "bg-[#0057FF] text-white hover:bg-blue-700"
            }`}
          >
            {isProcessingPayment ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Confirming...
              </>
            ) : (
              <>{paymentMethod === "cash" ? "Confirm Booking" : "Pay Now"}</>
            )}
          </button>
        </div>

        {/* ✅ Paystack Modal Container - This will host the inline modal */}
        <div id="paystack-iframe-container" />
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-[100px] pb-12 bg-[#F5F8FF]">
        <div className="max-w-[1280px] mx-auto px-5 py-8 md:py-12">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    s <= step
                      ? "bg-[#0057FF] text-white shadow-lg shadow-blue-200"
                      : "bg-white border-2 border-[#E8F0FF] text-gray-400"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? "bg-[#0057FF]" : "bg-[#E8F0FF]"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500">
              Step {step} of 4 • {step === 1 && "Select Service"}{" "}
              {step === 2 && "Pick Date & Time"}{" "}
              {step === 3 && "Enter Location"} {step === 4 && "Confirm & Pay"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-t-3xl">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>

      <Footer />

      {/* ✅ Enhanced Booking Error Modal with Blur & Animation */}
      {showBookingError && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
          onClick={() => setShowBookingError(false)}
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowBookingError(false)}
          ></div>

          {/* Modal - Slides from bottom to middle */}
          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-2xl p-6 mx-4 animate-in slide-in-from-bottom duration-300 md:slide-in-from-bottom-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowBookingError(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimesCircle className="text-2xl" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-3xl text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-center text-[#1A1A1A] mb-3">
              Booking Unavailable
            </h2>

            <p className="text-gray-600 text-center mb-6">{modalMessage}</p>

            <button
              onClick={() => setShowBookingError(false)}
              className="w-full bg-[#0057FF] text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFlow;
