// src/pages/customer/CustomerDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaClock,
  FaStar,
  FaHeart,
  FaHistory,
  FaWallet,
  FaUser,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaChevronDown,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowRight,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaInfoCircle,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

import { logoutUser } from "../../redux/features/auth/authSlice";
import api from "../../APIs/api";

// ===================== MOCK DATA =====================
const mockBookings = [
  {
    id: 1,
    provider: "Kwame Mensah",
    service: "Electrical Installation",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    date: "Mon, Jul 14 — 10:00 AM",
    location: "East Legon, Accra",
    status: "upcoming",
    price: "GH₵ 150",
    rating: 4.8,
  },
  {
    id: 2,
    provider: "Mawuli Agbeko",
    service: "Plumbing Repair",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    date: "Wed, Jul 16 — 2:00 PM",
    location: "Osu, Accra",
    status: "upcoming",
    price: "GH₵ 120",
    rating: 4.5,
  },
  {
    id: 3,
    provider: "Akua Dansoa",
    service: "Interior Design",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80",
    date: "Fri, Jul 18 — 8:00 AM",
    location: "Tema, Accra",
    status: "completed",
    price: "GH₵ 200",
    rating: 4.9,
  },
  {
    id: 4,
    provider: "Kofi Amoah",
    service: "Painting Services",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    date: "Sat, Jul 19 — 9:00 AM",
    location: "Spintex, Accra",
    status: "pending",
    price: "GH₵ 80",
    rating: 4.3,
  },
];

const mockFavorites = [
  {
    id: 1,
    name: "Efua Asantewaa",
    service: "Cleaning Services",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 4.7,
    location: "Dzorwulu, Accra",
    price: "GH₵ 60/hr",
  },
  {
    id: 2,
    name: "Kwame Mensah",
    service: "Electrical Services",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 4.8,
    location: "East Legon, Accra",
    price: "GH₵ 150",
  },
];

// ===================== TOAST COMPONENT =====================
let toastId = 0;

function Toast({ id, title, message, type, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const colorMap = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  const iconMap = {
    success: FaCheckCircle,
    error: FaInfoCircle,
    info: FaInfoCircle,
  };

  const IconComponent = iconMap[type];

  return (
    <div
      className={`pointer-events-auto rounded-xl border ${colorMap[type]} p-3.5 shadow-lg flex items-start gap-3 ${exiting ? "toast-exit" : "toast-enter"}`}
    >
      <IconComponent className="shrink-0 mt-0.5 text-lg" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs opacity-80 mt-0.5">{message}</p>
      </div>
      <button
        className="shrink-0 opacity-60 hover:opacity-100 transition"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(id), 300);
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
function CustomerDashboard() {
  const [bookings, setBookings] = useState(mockBookings);
  const [favorites, setFavorites] = useState(mockFavorites);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ===================== TOASTS =====================
  const addToast = useCallback((title, message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ===================== USER INFO =====================
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
    return "Customer";
  })();

  const initialLetter =
    userFirstName &&
    typeof userFirstName === "string" &&
    userFirstName !== "Customer"
      ? userFirstName.charAt(0).toUpperCase()
      : "C";

  // ===================== FILTER BOOKINGS =====================
  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "upcoming") return booking.status === "upcoming";
    if (activeFilter === "completed") return booking.status === "completed";
    if (activeFilter === "pending") return booking.status === "pending";
    return true;
  });

  // ===================== STATS =====================
  const stats = {
    activeBookings: bookings.filter((b) => b.status === "upcoming").length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    favorites: favorites.length,
  };

  // ===================== HANDLERS =====================
  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("authToken");
      if (token) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    } catch (err) {
      console.warn("Backend logout failed:", err.message);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("profile_draft_key");
      dispatch(logoutUser());
      setDropdownOpen(false);
      navigate("/");
    }
  };

  const handleCancelBooking = (id) => {
    setBookings(bookings.filter((b) => b.id !== id));
    addToast(
      "Booking cancelled",
      "Your booking has been cancelled successfully.",
      "success",
    );
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((f) => f.id !== id));
    addToast(
      "Removed from favorites",
      "Provider removed from your favorites list.",
      "info",
    );
  };

  // ===================== RENDER STARS =====================
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#FF6B00] text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-[#FF6B00] text-sm" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  // ===================== GET STATUS BADGE =====================
  const getStatusBadge = (status) => {
    const badges = {
      upcoming: "bg-blue-50 text-blue-700 border-blue-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return badges[status] || badges.pending;
  };

  // ===================== RENDER =====================
  return (
    <div className="bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] min-h-screen pt-[72px]">
      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInRight {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes dropDown {
          from { transform: translateY(-10px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100%) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(100%) scale(0.95); }
        }
        .animate-slideDown { animation: slideDown 0.5s ease-out forwards; }
        .animate-fadeInUp { opacity: 0; animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeInRight { opacity: 0; animation: fadeInRight 0.5s ease-out forwards; }
        .animate-dropDown { animation: dropDown 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .toast-enter { animation: toastIn 0.35s ease-out forwards; }
        .toast-exit { animation: toastOut 0.25s ease-in forwards; }
      `}</style>

      {/* Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100/80 fixed top-0 left-0 z-50 h-[72px] shadow-sm animate-slideDown">
        <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
          <Link
            to="/"
            className="text-[#0057FF] font-bold text-xl tracking-tight"
          >
            <img
              src="/Logo.png"
              alt="SureLink logo"
              className="h-20 w-auto ml-4 object-contain"
              loading="eager"
            />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              {
                to: "/customer/dashboard",
                label: "Dashboard",
                icon: FaTachometerAlt,
              },
              {
                to: "/customer/bookings/management",
                label: "My Bookings",
                icon: FaCalendarCheck,
              },
              { to: "/customer/favorites", label: "Favorites", icon: FaHeart },
            ].map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    isActive
                      ? "text-[#0057FF]"
                      : "text-gray-500 hover:text-[#0057FF]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="text-sm" />
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0057FF] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Avatar & Dropdown */}
          <div className="relative flex items-center h-full">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 cursor-pointer outline-none select-none group focus:outline-none"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white flex items-center justify-center font-bold shadow-md group-hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      className="w-9 h-9 rounded-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    initialLetter
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                Hi, {userFirstName}
                <FaChevronDown
                  className={`text-xs text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-[60px] w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-dropDown"
                style={{
                  border: "1.5px solid transparent",
                  backgroundImage:
                    "linear-gradient(white, white), linear-gradient(to right, #0057FF, #FF9900, #FF3333)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-white rounded-t-2xl relative z-10">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Account Type
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0057FF] rounded-full capitalize shadow-sm">
                      {user?.role || "Customer"}
                    </span>
                  </div>
                </div>

                {[
                  {
                    to: "/customer/dashboard",
                    icon: FaTachometerAlt,
                    label: "Dashboard",
                  },
                  {
                    to: "/customer/profile",
                    icon: FaUser,
                    label: "My Profile",
                  },
                  {
                    to: "/customer/bookings",
                    icon: FaCalendarCheck,
                    label: "My Bookings",
                  },
                  {
                    to: "/customer/favorites",
                    icon: FaHeart,
                    label: "Favorites",
                  },
                  { to: "/settings", icon: FaCog, label: "Settings" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <item.icon className="text-gray-400 w-4 group-hover:text-[#0057FF] transition-colors" />
                    {item.label}
                  </Link>
                ))}

                <Link
                  to="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group relative"
                >
                  <div className="relative">
                    <FaBell className="text-gray-400 w-4 group-hover:text-[#0057FF] transition-colors" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white animate-scaleIn">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </div>
                  <span>Notifications</span>
                </Link>

                <hr className="border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium text-left transition-colors group"
                >
                  <FaSignOutAlt className="w-4 group-hover:rotate-180 transition-transform duration-300" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Toasts */}
      <div
        className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 380 }}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            title={t.title}
            message={t.message}
            type={t.type}
            onDismiss={dismissToast}
          />
        ))}
      </div>

      {/* Page Content */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        {/* Welcome Section */}
        <div className="mb-10 animate-fadeInUp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                Welcome back, {userFirstName} 👋
              </h1>
              <p className="text-gray-500">
                Here's what's happening with your bookings
              </p>
            </div>
            <Link
              to="/search"
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaSearch className="text-sm" />
              Find Service Providers
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              title: "Active Bookings",
              value: stats.activeBookings,
              icon: FaCalendarCheck,
              color: "from-[#0057FF] to-[#0066FF]",
            },
            {
              title: "Completed",
              value: stats.completedBookings,
              icon: FaCheckCircle,
              color: "from-emerald-500 to-emerald-600",
            },
            {
              title: "Pending Requests",
              value: stats.pendingBookings,
              icon: FaClock,
              color: "from-amber-500 to-amber-600",
            },
            {
              title: "Favorites",
              value: stats.favorites,
              icon: FaHeart,
              color: "from-red-500 to-red-600",
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
              </div>
            </div>
          ))}
        </div>

        {/* Bookings and Favorites Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Recent Bookings
                </h2>
                <p className="text-sm text-gray-500">
                  Your upcoming and past bookings
                </p>
              </div>
              <Link
                to="/customer/bookings"
                className="text-sm text-[#0057FF] hover:underline flex items-center gap-1"
              >
                See all
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {[
                { key: "all", label: "All" },
                { key: "upcoming", label: "Upcoming" },
                { key: "pending", label: "Pending" },
                { key: "completed", label: "Completed" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    activeFilter === filter.key
                      ? "bg-[#0057FF] text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="bg-white border border-[#E8F0FF] rounded-2xl p-12 text-center">
                <FaCalendarCheck className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No bookings found</p>
                <p className="text-sm text-gray-300">
                  {activeFilter === "all"
                    ? "You haven't made any bookings yet"
                    : `No ${activeFilter} bookings`}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredBookings.slice(0, 3).map((booking, index) => (
                  <div
                    key={booking.id}
                    className="bg-white border border-[#E8F0FF] rounded-2xl p-5 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={booking.avatar}
                        alt={booking.provider}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-[#1A1A1A]">
                              {booking.provider}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {booking.service}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(booking.status)}`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaClock className="text-[#0057FF]" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#0057FF]" />
                            {booking.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-[#0057FF] text-sm bg-blue-50 px-3 py-1 rounded-lg">
                            {booking.price}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {renderStars(booking.rating)}
                            </div>
                            <span className="text-xs text-gray-500">
                              {booking.rating}
                            </span>
                          </div>
                        </div>
                        {booking.status === "upcoming" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium transition"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Favorite Providers
                </h2>
                <p className="text-sm text-gray-500">
                  Your saved service providers
                </p>
              </div>
              <Link
                to="/customer/favorites"
                className="text-sm text-[#0057FF] hover:underline flex items-center gap-1"
              >
                See all
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-white border border-[#E8F0FF] rounded-2xl p-12 text-center">
                <FaHeart className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No favorites yet</p>
                <p className="text-sm text-gray-300">
                  Start saving providers you trust
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {favorites.map((provider, index) => (
                  <div
                    key={provider.id}
                    className="bg-white border border-[#E8F0FF] rounded-2xl p-5 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300 animate-fadeInRight"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-[#1A1A1A]">
                              {provider.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {provider.service}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveFavorite(provider.id)}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#0057FF]" />
                            {provider.location}
                          </span>
                          <span className="font-bold text-[#0057FF]">
                            {provider.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(provider.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {provider.rating}
                          </span>
                        </div>
                        <Link
                          to={`/provider/${provider.id}`}
                          className="mt-2 inline-block text-xs text-[#0057FF] hover:underline font-medium"
                        >
                          View Profile →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div
          className="mt-8 animate-fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-white border border-[#E8F0FF] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                to="/search"
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition border border-blue-100"
              >
                <FaSearch className="text-[#0057FF] text-xl" />
                <span className="text-sm font-semibold text-gray-700">
                  Find Services
                </span>
              </Link>
              <Link
                to="/customer/bookings"
                className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition border border-emerald-100"
              >
                <FaCalendarCheck className="text-emerald-600 text-xl" />
                <span className="text-sm font-semibold text-gray-700">
                  My Bookings
                </span>
              </Link>
              <Link
                to="/customer/favorites"
                className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition border border-red-100"
              >
                <FaHeart className="text-red-500 text-xl" />
                <span className="text-sm font-semibold text-gray-700">
                  Favorites
                </span>
              </Link>
              <Link
                to="/customer/profile"
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition border border-purple-100"
              >
                <FaUser className="text-purple-600 text-xl" />
                <span className="text-sm font-semibold text-gray-700">
                  My Profile
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
