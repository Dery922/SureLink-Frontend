// src/pages/CustomerBookingManagement.jsx
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTimes,
  FaHistory,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaClockIcon,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTag,
  FaUserCircle,
  FaStore,
  FaSpinner,
  FaStar,
  FaInfoCircle,
  FaCreditCard,
  FaWallet,
  FaBuilding,
  FaMobileAlt,
  FaCalendarCheck,
  FaCommentDots,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import NavbarDashbaord from "../../components/NavbarDashboard";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import api from "../../APIs/api";

const CustomerBookingManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("active");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelBookingId, setCancelBookingId] = useState(null);

  // Tabs for customer
  const tabs = [
    {
      id: "active",
      label: "Active",
      icon: FaShoppingBag,
      count: stats.pending + stats.confirmed + stats.in_progress,
    },
    {
      id: "history",
      label: "History",
      icon: FaHistory,
      count: stats.completed + stats.cancelled,
    },
  ];

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let endpoint = "";

      switch (activeTab) {
        case "active":
          endpoint = "/bookings/outgoing";
          break;
        case "history":
          endpoint = "/bookings/history";
          break;
        default:
          endpoint = "/bookings/outgoing";
      }

      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
          status: filter !== "all" ? filter : undefined,
          search: searchTerm || undefined,
        },
      });

      if (response.data.success) {
        const bookingsData = response.data.data || [];
        setBookings(bookingsData);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalBookings(response.data.pagination?.total || 0);

        // Calculate stats
        const allBookings = bookingsData;
        setStats({
          total: allBookings.length,
          pending: allBookings.filter((b) => b.status === "pending").length,
          confirmed: allBookings.filter((b) => b.status === "confirmed").length,
          in_progress: allBookings.filter((b) => b.status === "in_progress")
            .length,
          completed: allBookings.filter((b) => b.status === "completed").length,
          cancelled: allBookings.filter((b) => b.status === "cancelled").length,
        });
      } else {
        toast.error(response.data.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load bookings. Please refresh the page.");
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, filter, searchTerm, currentPage]);

  // Handle Cancel Booking - Open Modal
  const handleCancelBooking = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  // Handle Cancel Booking - Confirm
  const handleCancelBookingConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    if (actionLoading) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await api.put(
        `/bookings/${cancelBookingId}/cancel`,
        { reason: cancelReason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        setShowCancelModal(false);
        setCancelBookingId(null);
        setCancelReason("");
        fetchBookings();
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        color: "bg-amber-50 border-amber-200 text-amber-700",
        label: "Pending",
        icon: FaClockIcon,
        dotColor: "bg-amber-500",
      },
      confirmed: {
        color: "bg-blue-50 border-blue-200 text-blue-700",
        label: "Confirmed",
        icon: FaCheckCircle,
        dotColor: "bg-blue-500",
      },
      in_progress: {
        color: "bg-indigo-50 border-indigo-200 text-indigo-700",
        label: "In Progress",
        icon: FaClockIcon,
        dotColor: "bg-indigo-500",
      },
      completed: {
        color: "bg-emerald-50 border-emerald-200 text-emerald-700",
        label: "Completed",
        icon: FaCheckCircle,
        dotColor: "bg-emerald-500",
      },
      cancelled: {
        color: "bg-red-50 border-red-200 text-red-700",
        label: "Cancelled",
        icon: FaTimesCircle,
        dotColor: "bg-red-500",
      },
    };
    return (
      statusMap[status] || {
        color: "bg-gray-50 border-gray-200 text-gray-700",
        label: status,
        icon: FaClockIcon,
        dotColor: "bg-gray-500",
      }
    );
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: {
        color: "bg-amber-50 text-amber-700",
        label: "Pending",
        icon: FaClockIcon,
      },
      paid: {
        color: "bg-emerald-50 text-emerald-700",
        label: "Paid",
        icon: FaCheckCircle,
      },
      failed: {
        color: "bg-red-50 text-red-700",
        label: "Failed",
        icon: FaTimesCircle,
      },
      refunded: {
        color: "bg-purple-50 text-purple-700",
        label: "Refunded",
        icon: FaCheckCircle,
      },
      partially_paid: {
        color: "bg-blue-50 text-blue-700",
        label: "Partially Paid",
        icon: FaClockIcon,
      },
    };
    return (
      statusMap[status] || {
        color: "bg-gray-50 text-gray-700",
        label: status || "Pending",
        icon: FaClockIcon,
      }
    );
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    const methods = {
      "mobile-money": FaMobileAlt,
      "debit-card": FaCreditCard,
      cash: FaMoneyBillWave,
      "bank-transfer": FaBuilding,
      wallet: FaWallet,
    };
    return methods[method] || FaMoneyBillWave;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return `GH₵ ${amount.toFixed(2)}`;
  };

  // Generate booking reference
  const generateReference = (id) => {
    if (!id)
      return `#BK${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`;
    return `#BK${String(id).slice(-6).toUpperCase()}`;
  };

  // Render booking ticket
  const renderBookingTicket = (booking) => {
    const status = getStatusBadge(booking.status);
    const StatusIcon = status.icon;
    const bookingRef = booking.bookingRef || generateReference(booking._id);
    const isPending = booking.status === "pending";

    // Get payment status
    const paymentStatus = getPaymentStatusBadge(booking.paymentStatus);
    const PaymentIcon = paymentStatus.icon;

    // Get payment method icon
    const PaymentMethodIcon = getPaymentMethodIcon(booking.paymentMethod);

    // Provider info
    const providerName = booking.providerName || "Service Provider";
    const providerAvatar =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(providerName) +
      "&background=6B7280&color=fff&size=64";

    return (
      <div
        key={booking._id}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#0057FF]/30 transition-all duration-300 animate-fadeInUp"
      >
        <div className={`h-1 ${status.dotColor.replace("bg-", "bg-")}`} />

        <div className="p-5 md:p-6">
          {/* Top Row - Reference & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {bookingRef}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color} flex items-center gap-1.5`}
              >
                <StatusIcon className="text-xs" />
                {status.label}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${paymentStatus.color} flex items-center gap-1.5`}
              >
                <PaymentIcon className="text-xs" />
                {paymentStatus.label}
              </span>
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FaCalendarAlt className="text-[#0057FF]" />
              {formatDate(booking.createdAt)}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <img
                  src={providerAvatar}
                  alt={providerName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shrink-0"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(providerName) +
                      "&background=6B7280&color=fff&size=64";
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1A1A1A] text-lg truncate">
                    {booking.serviceName || "Service Booking"}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaStore className="text-[#0057FF] text-xs" />
                    Provider: {providerName}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-[#0057FF]" />
                      {booking.location
                        ? `${booking.location.address}, ${booking.location.city}`
                        : "Not specified"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-[#0057FF]" />
                      {booking.bookingTime || "Flexible"}
                    </span>
                    {booking.serviceCategory && (
                      <span className="flex items-center gap-1">
                        <FaTag className="text-[#0057FF]" />
                        {booking.serviceCategory}
                      </span>
                    )}
                    {booking.serviceDuration &&
                      booking.serviceDuration !== "Variable" && (
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[#0057FF]" />
                          {booking.serviceDuration}
                        </span>
                      )}
                  </div>
                  {booking.specialInstructions && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <FaCommentDots className="text-[#0057FF]" />
                      {booking.specialInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Price & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-[#0057FF]">
                  {formatCurrency(booking.totalAmount)}
                </p>
                {booking.depositAmount > 0 && (
                  <p className="text-xs text-gray-400">
                    Deposit: {formatCurrency(booking.depositAmount)}
                    {booking.remainingAmount > 0 &&
                      ` | Remaining: ${formatCurrency(booking.remainingAmount)}`}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {isPending && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {actionLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaTimes className="text-xs" />
                        Cancel Booking
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetailsModal(true);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                >
                  <FaEye className="text-xs" />
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Bottom - Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <PaymentMethodIcon className="text-[#0057FF]" />
              {booking.paymentMethod || "No payment method"}
            </span>
            {booking.bookingDate && (
              <span className="flex items-center gap-1">
                <FaCalendarCheck className="text-[#0057FF]" />
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {booking.bookingTime && (
              <span className="flex items-center gap-1">
                <FaClock className="text-[#0057FF]" />
                {booking.bookingTime}
              </span>
            )}
            {booking.rating?.score && (
              <span className="flex items-center gap-1 text-amber-600">
                <FaStar className="text-amber-400" />
                {booking.rating.score}/5
                {booking.rating.comment && ` - ${booking.rating.comment}`}
              </span>
            )}
            {booking.notes && (
              <span className="flex items-center gap-1 truncate max-w-md">
                <FaInfoCircle className="text-[#0057FF]" />
                {booking.notes}
              </span>
            )}
            {booking.completedAt && (
              <span className="flex items-center gap-1 text-emerald-600">
                <FaCheckCircle className="text-emerald-500" />
                Completed: {formatDate(booking.completedAt)}
              </span>
            )}
            {booking.cancelledAt && (
              <span className="flex items-center gap-1 text-red-600">
                <FaTimesCircle className="text-red-500" />
                Cancelled: {formatDate(booking.cancelledAt)}
              </span>
            )}
            {booking.cancelledReason && (
              <span className="flex items-center gap-1 text-red-500">
                Reason: {booking.cancelledReason}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] min-h-screen">
      <NavbarDashbaord />

      <div className="max-w-[1280px] mx-auto px-5 pt-[100px] pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <FaShoppingBag className="text-[#0057FF] text-3xl" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                  My Bookings
                </h1>
                <p className="text-gray-500 mt-1">
                  View and manage all your service bookings
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <span className="font-bold text-[#0057FF]">{totalBookings}</span>{" "}
              total bookings
            </span>
          </div>
        </div>

        {/* Stats Cards - Customer Focused */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "from-blue-500 to-blue-600",
              icon: FaCalendarAlt,
            },
            {
              label: "Active",
              value: stats.confirmed + stats.in_progress,
              color: "from-emerald-500 to-emerald-600",
              icon: FaCheckCircle,
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "from-amber-500 to-amber-600",
              icon: FaClockIcon,
            },
            {
              label: "Completed",
              value: stats.completed,
              color: "from-purple-500 to-purple-600",
              icon: FaCheckCircle,
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              color: "from-red-500 to-red-600",
              icon: FaTimesCircle,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-medium">
                    {stat.label}
                  </p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className="text-white/50 text-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner - Customer */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-emerald-600 text-xl" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                You have{" "}
                <span className="font-bold text-emerald-600">
                  {stats.pending + stats.confirmed + stats.in_progress}
                </span>{" "}
                active bookings
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Track your bookings and manage cancellations
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-[#0057FF] text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="text-sm" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking ID, provider, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none bg-white min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="flex gap-2">
                          <div className="h-3 bg-gray-200 rounded w-20" />
                          <div className="h-3 bg-gray-200 rounded w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 bg-gray-200 rounded w-24" />
                    <div className="h-10 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-400">
              {activeTab === "active"
                ? "You don't have any active bookings"
                : "No booking history found"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">{bookings.map(renderBookingTicket)}</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowCancelModal(false);
              setCancelBookingId(null);
              setCancelReason("");
            }}
          />
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scaleIn p-6">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelBookingId(null);
                  setCancelReason("");
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTimesCircle className="text-3xl text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">
                  Cancel Booking
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Please provide a reason for cancelling this booking
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter the reason for cancellation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                  rows="4"
                  maxLength="500"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {cancelReason.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelBookingId(null);
                    setCancelReason("");
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelBookingConfirm}
                  disabled={actionLoading || !cancelReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl animate-scaleIn p-6 md:p-8">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">
                    Booking Details
                  </h2>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedBooking.bookingRef ||
                      generateReference(selectedBooking._id)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Complete information about your booking
                </p>
              </div>

              <div className="space-y-6">
                {/* Status & Payment Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className={`p-4 rounded-xl border ${getStatusBadge(selectedBooking.status).color} flex items-center gap-3`}
                  >
                    {React.createElement(
                      getStatusBadge(selectedBooking.status).icon,
                      { className: "text-xl" },
                    )}
                    <div>
                      <p className="font-semibold">
                        Status: {getStatusBadge(selectedBooking.status).label}
                      </p>
                      <p className="text-sm opacity-75">Your booking</p>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-xl border ${getPaymentStatusBadge(selectedBooking.paymentStatus).color} flex items-center gap-3`}
                  >
                    {React.createElement(
                      getPaymentStatusBadge(selectedBooking.paymentStatus).icon,
                      { className: "text-xl" },
                    )}
                    <div>
                      <p className="font-semibold">
                        Payment:{" "}
                        {
                          getPaymentStatusBadge(selectedBooking.paymentStatus)
                            .label
                        }
                      </p>
                      <p className="text-sm opacity-75">
                        {formatCurrency(selectedBooking.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Service Provider
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                          selectedBooking.providerName || "Provider",
                        ) +
                        "&background=6B7280&color=fff&size=64"
                      }
                      alt={selectedBooking.providerName || "Provider"}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(
                            selectedBooking.providerName || "Provider",
                          ) +
                          "&background=6B7280&color=fff&size=64";
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {selectedBooking.providerName || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaStore className="text-xs" />
                        Service Provider
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Service Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Service Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedBooking.serviceName || "N/A"}
                      </p>
                    </div>
                    {selectedBooking.serviceCategory && (
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-semibold text-gray-800">
                          {selectedBooking.serviceCategory}
                        </p>
                      </div>
                    )}
                    {selectedBooking.serviceDuration && (
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-800">
                          {selectedBooking.serviceDuration}
                        </p>
                      </div>
                    )}
                    {selectedBooking.serviceTypes &&
                      selectedBooking.serviceTypes.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Service Types</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedBooking.serviceTypes.map((type, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Date, Time & Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Date
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#0057FF]" />
                      {selectedBooking.bookingDate
                        ? new Date(
                            selectedBooking.bookingDate,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Time
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaClock className="text-[#0057FF]" />
                      {selectedBooking.bookingTime || "Flexible"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#0057FF]" />
                      {selectedBooking.location?.address || "Not specified"}
                    </p>
                    {selectedBooking.location?.city && (
                      <p className="text-sm text-gray-500">
                        {selectedBooking.location.city}
                        {selectedBooking.location?.landmark &&
                          `, ${selectedBooking.location.landmark}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Payment Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Method</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        {React.createElement(
                          getPaymentMethodIcon(selectedBooking.paymentMethod),
                          { className: "text-[#0057FF]" },
                        )}
                        {selectedBooking.paymentMethod || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(selectedBooking.totalAmount)}
                      </p>
                    </div>
                    {selectedBooking.depositAmount > 0 && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Deposit</p>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(selectedBooking.depositAmount)}
                          </p>
                        </div>
                        {selectedBooking.remainingAmount > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className="font-semibold text-gray-800">
                              {formatCurrency(selectedBooking.remainingAmount)}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {selectedBooking.paymentReference && (
                      <div>
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {selectedBooking.paymentReference}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes & Special Instructions */}
                {(selectedBooking.notes ||
                  selectedBooking.specialInstructions ||
                  selectedBooking.internalNotes) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                      Additional Information
                    </p>
                    <div className="space-y-2">
                      {selectedBooking.specialInstructions && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Special Instructions
                          </p>
                          <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">
                            {selectedBooking.specialInstructions}
                          </p>
                        </div>
                      )}
                      {selectedBooking.notes && (
                        <div>
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm text-gray-700 bg-white p-2 rounded-lg">
                            {selectedBooking.notes}
                          </p>
                        </div>
                      )}
                      {selectedBooking.internalNotes && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Internal Notes
                          </p>
                          <p className="text-sm text-gray-700 bg-white p-2 rounded-lg border-l-4 border-blue-400">
                            {selectedBooking.internalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    Timeline
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500">Created</span>
                      <span className="font-medium text-gray-700">
                        {formatDate(selectedBooking.createdAt)}
                      </span>
                    </div>
                    {selectedBooking.confirmedAt && (
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-500">Confirmed</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(selectedBooking.confirmedAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.startedAt && (
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-500">Started</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(selectedBooking.startedAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.completedAt && (
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-500">Completed</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(selectedBooking.completedAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.cancelledAt && (
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-500">Cancelled</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(selectedBooking.cancelledAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.rating?.ratedAt && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Rated</span>
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          <FaStar className="text-amber-400" />
                          {formatDate(selectedBooking.rating.ratedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {selectedBooking.rating?.score && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 uppercase tracking-wider mb-2">
                      Rating
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`${
                              index < selectedBooking.rating.score
                                ? "text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {selectedBooking.rating.score}/5
                      </span>
                      {selectedBooking.rating.comment && (
                        <span className="text-sm text-gray-600">
                          "{selectedBooking.rating.comment}"
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 min-w-[100px] px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Close
                </button>
                {selectedBooking.status === "pending" && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking._id);
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] px-4 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all font-medium disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Cancel Booking"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
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

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomerBookingManagement;
