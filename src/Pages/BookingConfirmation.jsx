// src/pages/BookingConfirmation.jsx
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BookingConfirmation() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const bookingData = location.state?.booking;
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingData) {
      setBooking(bookingData);
      setLoading(false);
      return;
    }

    if (!bookingId) {
      navigate("/");
    }

    setLoading(false);
  }, [bookingData, bookingId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateReference = () => {
    if (bookingId) return `#BK${String(bookingId).slice(-6).toUpperCase()}`;
    return `#BK${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-[100px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E8F0FF] border-t-[#0057FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (!booking) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-[100px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
              Booking Not Found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't find your booking details. Please try again.
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Destructure booking data
  const {
    providerName = "Provider",
    serviceName = "Service",
    servicePrice = 0,
    date = "",
    time = "",
    address = "",
    city = "",
    landmark = "",
    paymentMethod = "mobile-money",
    specialInstructions = "",
    customerName = user?.name?.full || user?.email || "Customer",
    totalAmount = servicePrice,
    providerId: bookingProviderId = providerId,
  } = booking;

  const providerAvatar =
    booking.providerAvatar ||
    "https://ui-avatars.com/api/?name=Provider&background=0057FF&color=fff&size=200";

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      "mobile-money": "Mobile Money",
      "debit-card": "Debit Card",
      cash: "Cash on Delivery",
    };
    return methods[method] || method;
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ✅ FIXED: Proper padding with pt-[100px] */}
      <div className="pt-[130px] pb-12 bg-[#F5F8FF] min-h-[calc(100vh-72px)]">
        <div className="max-w-[600px] w-full mx-auto px-5">
          {/* Success icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-[#E8F0FF] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-check text-[#0057FF] text-5xl"></i>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2 text-center">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-8 text-center">
            Your service request has been sent to the provider
          </p>

          {/* Booking details card */}
          <div className="bg-white border border-[#E8F0FF] rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-[#1A1A1A]">
                Booking Details
              </h2>
              <span className="text-xs bg-blue-50 text-[#0057FF] px-3 py-1 rounded-full font-semibold">
                {generateReference()}
              </span>
            </div>

            {/* Provider Info */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#E8F0FF]">
              <img
                src={providerAvatar}
                alt={providerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80";
                }}
              />
              <div className="flex-1">
                <p className="font-bold text-[#1A1A1A]">{providerName}</p>
                <p className="text-sm text-gray-500">{serviceName}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0057FF]">GH₵ {totalAmount}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  <i className="fa-solid fa-receipt mr-2 text-[#0057FF]"></i>
                  Booking ID
                </span>
                <span className="font-bold text-[#1A1A1A] text-sm">
                  {generateReference()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  <i className="fa-solid fa-calendar mr-2 text-[#0057FF]"></i>
                  Date & Time
                </span>
                <span className="font-bold text-[#1A1A1A] text-sm">
                  {formatDate(date)} at {time || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  <i className="fa-solid fa-map-marker-alt mr-2 text-[#0057FF]"></i>
                  Location
                </span>
                <span className="font-bold text-[#1A1A1A] text-sm text-right">
                  {address}, {city}
                  {landmark && ` (${landmark})`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  <i className="fa-solid fa-user mr-2 text-[#0057FF]"></i>
                  Customer
                </span>
                <span className="font-bold text-[#1A1A1A] text-sm">
                  {customerName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  <i className="fa-solid fa-clock mr-2 text-[#0057FF]"></i>
                  Status
                </span>
                <span className="font-bold text-[#22C55E] text-sm flex items-center gap-1">
                  <i className="fa-solid fa-check-circle text-sm"></i>
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  <i className="fa-solid fa-credit-card mr-2 text-[#0057FF]"></i>
                  Payment Method
                </span>
                <span className="font-bold text-[#1A1A1A] text-sm capitalize">
                  {getPaymentMethodDisplay(paymentMethod)}
                </span>
              </div>

              {specialInstructions && (
                <div className="flex items-start justify-between pt-3 border-t border-[#E8F0FF]">
                  <span className="text-gray-500 text-sm">
                    <i className="fa-solid fa-pen mr-2 text-[#0057FF]"></i>
                    Special Instructions
                  </span>
                  <span className="font-bold text-[#1A1A1A] text-sm text-right max-w-[60%]">
                    {specialInstructions}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#E8F0FF]">
                <span className="text-gray-500 text-sm font-bold">Total</span>
                <span className="font-bold text-2xl text-[#0057FF]">
                  GH₵ {totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-[#F5F8FF] rounded-2xl p-6 mb-8 text-left border border-[#E8F0FF]">
            <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <i className="fa-solid fa-clock text-[#0057FF]"></i>
              What Happens Next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1A1A1A]">
                    Provider reviews your request
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    The provider will review your request within 30 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1A1A1A]">
                    You receive confirmation
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You'll get a notification via SMS and in-app
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1A1A1A]">
                    Service is completed
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Payment is collected upon completion of service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              to={`/provider/${bookingProviderId}`}
              className="w-full sm:w-auto px-8 py-3 border border-[#0057FF] text-[#0057FF] font-bold rounded-lg hover:bg-[#F5F8FF] transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-user"></i>
              View Provider
            </Link>
            <Link
              to="/customer/dashboard"
              className="w-full sm:w-auto px-8 py-3 bg-[#0057FF] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <i className="fa-solid fa-home"></i>
              My Bookings
            </Link>
          </div>

          {/* Support info */}
          <div className="mt-10 pt-6 border-t border-[#E8F0FF] text-center">
            <p className="text-gray-500 text-sm mb-2">
              Need help with your booking?
            </p>
            <button
              onClick={() => navigate("/support")}
              className="text-[#0057FF] text-sm font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              <i className="fa-solid fa-message"></i>
              Chat with support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingConfirmation;
