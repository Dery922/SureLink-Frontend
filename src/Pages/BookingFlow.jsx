// src/pages/BookingFlow.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuthCheck from "../hooks/useAuthCheck";
import { getProviderById, createBooking } from "../services/services";
import toast from "react-hot-toast";

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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile-money");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const totalPrice = selectedService
    ? selectedService.basePrice || selectedService.price || 0
    : 0;

  // Check authentication on mount
  useEffect(() => {
    console.log("🔐 Running auth check...");

    // If already authenticated, set authChecked to true immediately
    if (isAuthenticated && user) {
      console.log("✅ User already authenticated, setting authChecked to true");
      setAuthChecked(true);
      setLoading(false);
      return;
    }

    // Otherwise, run the check
    try {
      const isAuthed = checkAuth();
      console.log("  - checkAuth result:", isAuthed);
      setAuthChecked(true);

      if (!isAuthed) {
        toast.error("Please log in to book a service");
        setLoading(false); // ✅ Set loading to false when not authenticated
        return;
      }

      setLoading(false); // ✅ Set loading to false when authenticated
    } catch (error) {
      console.error("❌ Auth check error:", error);
      setAuthChecked(true);
      setLoading(false); // ✅ Set loading to false on error
    }
  }, [isAuthenticated, user, checkAuth]);

  // Validate ID
  useEffect(() => {
    if (authChecked && isAuthenticated && !id) {
      console.error("❌ No ID provided");
      setError("Invalid provider ID");
      setLoading(false);
      toast.error("Invalid provider ID");
      navigate("/providers");
    }
  }, [authChecked, isAuthenticated, id, navigate]);

  // Fetch provider data using existing endpoint
  useEffect(() => {
    console.log("📡 Fetch effect triggered:", {
      authChecked,
      isAuthenticated,
      id,
      dataFetched,
      shouldFetch: authChecked && isAuthenticated && id && !dataFetched,
    });

    const fetchProviderData = async () => {
      if (!id) {
        console.error("❌ No ID provided");
        setError("Invalid provider ID");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching provider data for ID:", id);
        setLoading(true);
        setError(null);

        const response = await getProviderById(id);
        console.log("📦 Provider data response:", response);

        if (response && response.success) {
          const responseData = response.data;
          // Handle both possible response structures
          const providerData = responseData.provider || responseData;
          const servicesData = responseData.services || [];

          setProvider(providerData);
          setServices(servicesData);
          setDataFetched(true);

          console.log(
            "✅ Provider loaded:",
            providerData?.name?.full || providerData?.name,
          );
          console.log("✅ Services loaded:", servicesData.length);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch provider data");
        }
      } catch (err) {
        console.error("❌ Error fetching provider data:", err);
        setError(
          err.message || "Failed to load provider services. Please try again.",
        );
        toast.error("Failed to load services");
        setLoading(false);
      }
    };

    // Only fetch when auth is checked, user is authenticated, we have an id, and data hasn't been fetched
    if (authChecked && isAuthenticated && id && !dataFetched) {
      fetchProviderData();
    } else if (authChecked && !isAuthenticated) {
      // If auth checked but not authenticated, redirect to login
      console.log("🔒 Not authenticated, redirecting to login");
      setLoading(false);
      navigate("/login");
    } else if (authChecked && isAuthenticated && !id) {
      setLoading(false);
    }
  }, [id, authChecked, isAuthenticated, navigate, dataFetched]);

  // Show loading while checking auth or fetching data
  if (loading || !authChecked) {
    console.log(
      "⏳ Showing loading state - loading:",
      loading,
      "authChecked:",
      authChecked,
    );
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
            <p className="text-xs text-gray-400 mt-2">
              {!authChecked
                ? "Please wait..."
                : "Fetching provider services..."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not authenticated, don't render the rest
  if (!isAuthenticated) {
    console.log("🔒 Not authenticated, returning null");
    return null;
  }

  // If error or no provider
  if (error || !provider) {
    console.log("⚠️ Error or no provider:", error);
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
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

  // Helper to get icon for service
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

    if (service.serviceTypes && service.serviceTypes.length > 0) {
      const typeIcons = {
        pipe_repair: "fa-pipe",
        installation: "fa-download",
        drainage: "fa-water",
        leak_detection: "fa-search",
        deep_cleaning: "fa-spray-can",
        carpet_cleaning: "fa-broom",
        window_cleaning: "fa-window-maximize",
        move_in_out: "fa-truck-moving",
        wiring: "fa-plug",
        lighting: "fa-lightbulb",
        panel_upgrade: "fa-microchip",
        outlet_repair: "fa-plug",
        ceiling_fan: "fa-fan",
      };

      const firstType = service.serviceTypes[0];
      if (typeIcons[firstType]) {
        return typeIcons[firstType];
      }
    }

    return "fa-wrench";
  };

  // Step 1: Select Service
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
            <i className="fa-solid fa-tools text-3xl text-gray-400"></i>
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
                      {service.duration && (
                        <span>
                          <i className="fa-solid fa-clock mr-2"></i>
                          {service.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-xl text-[#0057FF]">
                      GH₵ {price}
                      {priceDisplay}
                    </p>
                    {service.pricingModel === "individual" &&
                      service.individualPrices && (
                        <p className="text-xs text-gray-400">
                          Multiple pricing options
                        </p>
                      )}
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
          Next
        </button>
      </div>
    </div>
  );

  // Step 2: Pick Date & Time
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
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!selectedDate || !selectedTime}
          className={`px-8 py-3 font-bold rounded-lg transition-colors ${
            selectedDate && selectedTime
              ? "bg-[#0057FF] text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 3: Enter Location
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
          Back
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
          Next
        </button>
      </div>
    </div>
  );

  // Step 4: Confirm & Pay
  const renderStep4 = () => {
    // Step 4: Confirm & Pay - Updated handleConfirmBooking
    // src/pages/BookingFlow.jsx - Updated handleConfirmBooking

    const handleConfirmBooking = async () => {
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
          specialInstructions,
          customerName: user?.name?.full || user?.email,
          totalAmount: totalPrice,
        };

        console.log("📝 Sending Booking Data:", bookingData);
        const response = await createBooking(bookingData);
        console.log("✅ Received Booking response:", response);

        if (response && response.success) {
          toast.success("Booking confirmed successfully!");

          // Turn off loading state BEFORE shifting screen contexts
          setIsSubmitting(false);

          return navigate(
            `/booking-confirmation/${provider._id || provider.id}`,
            {
              state: {
                booking: bookingData,
                bookingId: response.data?._id || response.data?.id,
              },
            },
          );
        }

        throw new Error(
          response?.message || "Booking failed. Please try again.",
        );
      } catch (error) {
        console.error("❌ Catch Block Triggered:", error);

        // Explicitly shut down loading if an error occurs
        setIsSubmitting(false);

        // Extract status safely whether it is standard Axios or a custom wrapper
        const statusCode = error.response?.status || error.status;
        const backendMessage = error.response?.data?.message || error.message;

        if (statusCode === 409) {
          toast.error(
            "The provider is already booked at this time. Please choose another time.",
          );
        } else if (statusCode === 401) {
          toast.error("Please log in to book a service.");
          navigate("/login");
        } else if (statusCode === 404) {
          toast.error("Provider or service not found.");
        } else if (statusCode === 400) {
          toast.error(
            backendMessage || "Invalid booking data. Please check inputs.",
          );
        } else if (statusCode === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(
            backendMessage || "Failed to create booking. Please try again.",
          );
        }
      }
    };

    const price = selectedService?.basePrice || selectedService?.price || 0;
    const priceType = selectedService?.priceType || "fixed";
    const priceDisplay = priceType === "hourly" ? "/hr" : "";

    return (
      <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Confirm & Pay
        </h2>
        <p className="text-gray-500 mb-8">
          Review your booking details and select a payment method
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <i className="fa-solid fa-user-check text-blue-600"></i>
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
                <i className="fa-solid fa-wrench mr-2"></i>
                Service
              </span>
              <span className="font-bold text-[#1A1A1A]">
                {selectedService?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <i className="fa-solid fa-calendar mr-2"></i>
                Date
              </span>
              <span className="font-bold text-[#1A1A1A]">{selectedDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <i className="fa-solid fa-clock mr-2"></i>
                Time
              </span>
              <span className="font-bold text-[#1A1A1A]">{selectedTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <i className="fa-solid fa-location-dot mr-2"></i>
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
            {[
              {
                id: "mobile-money",
                name: "Mobile Money",
                description: "MTN, Vodafone, AirtelTigo",
                icon: "fa-mobile",
              },
              {
                id: "debit-card",
                name: "Debit Card",
                description: "Visa, MasterCard",
                icon: "fa-credit-card",
              },
              {
                id: "cash",
                name: "Cash on Delivery",
                description: "Pay when service is complete",
                icon: "fa-money-bill",
              },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === method.id
                    ? "border-[#0057FF] bg-[#F5F8FF]"
                    : "border-[#E8F0FF] hover:border-[#0057FF]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F0FF] rounded-lg flex items-center justify-center">
                    <i className={`fa-solid ${method.icon} text-[#0057FF]`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{method.name}</p>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
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
            Back
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className={`px-8 py-3 font-bold rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FF6B00] text-white hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-[72px] bg-[#F5F8FF]">
        <div className="max-w-[1280px] mx-auto px-5 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    s <= step
                      ? "bg-[#0057FF] text-white"
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

        <div className="bg-white">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingFlow;
