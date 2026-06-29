import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../APIs/api";
import { logoutUser } from "../redux/features/auth/authSlice";
import HighDemandAreas from "../components/HighDemandArea";
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
} from "react-icons/fa";

const pendingRequests = [
  {
    id: 1,
    consumer: "Abena Darko",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    service: "Pipe Repair",
    date: "Mon, May 6 — 10:00 AM",
    location: "East Legon, Accra",
    amount: "GH₵ 150",
  },
  {
    id: 2,
    consumer: "Kofi Boateng",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    service: "Drainage Fix",
    date: "Tue, May 7 — 2:00 PM",
    location: "Osu, Accra",
    amount: "GH₵ 120",
  },
  {
    id: 3,
    consumer: "Ama Sarpong",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    service: "Installation",
    date: "Wed, May 8 — 8:00 AM",
    location: "Tema, Accra",
    amount: "GH₵ 200",
  },
];

const recentEarnings = [
  {
    id: 1,
    service: "Pipe Repair",
    consumer: "Yaw Mensah",
    date: "Apr 30, 2026",
    amount: "GH₵ 150",
  },
  {
    id: 2,
    service: "Installation",
    consumer: "Akosua Asante",
    date: "Apr 28, 2026",
    amount: "GH₵ 200",
  },
  {
    id: 3,
    service: "Drainage Fix",
    consumer: "Kwesi Agyeman",
    date: "Apr 25, 2026",
    amount: "GH₵ 120",
  },
];

function ProviderDashboard() {
  const [requests, setRequests] = useState(pendingRequests);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [notificationCount, setNotificationCount] = useState(3);
  const location = useLocation();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the dropdown button and the dropdown menu
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

    // Handle ESC key
    const handleEscKey = (event) => {
      if (dropdownOpen && event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [dropdownOpen]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userServices = user?.services ||
    user?.provider_profile?.secondaryCategories || ["General Services"];

  const handleAccept = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleDecline = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };
  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

  const handleLogout = async () => {
    try {
      // 🔑 Fix: Try both common local storage token key names dynamically
      const token =
        localStorage.getItem("authToken") || localStorage.getItem("authToken");

      if (token) {
        // 🚀 Dispatch the POST request with the correctly structured header layout
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
      // Catch any backend 401/500 drops without locking up your user's viewport interface
      console.warn(
        "Backend session invalidation rejected or unreachable:",
        err.message,
      );
    } finally {
      // 🧹 ALWAYS RUNS: This guarantees a clean client logout regardless of backend response codes

      localStorage.removeItem("authToken");
      localStorage.removeItem("profile_draft_key"); // Wipes lingering wizard draft cache flags

      dispatch(logoutUser()); // Triggers your Redux auth state reset
      setDropdownOpen(false);
      setMenuOpen(false);
      navigate("/"); // Redirects the viewport immediately
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F8FF] via-white to-[#F5F8FF] min-h-screen pt-[72px]">
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
                to: "/provider/dashboard",
                label: "Dashboard",
                icon: FaTachometerAlt,
              },
              {
                to: "/provider/jobs",
                label: "Job Requests",
                icon: FaBriefcase,
              },
              { to: "/provider/earnings", label: "Earnings", icon: FaWallet },
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
              ref={buttonRef}
              onClick={toggleDropdown}
              className="flex items-center gap-3 cursor-pointer outline-none select-none group focus:outline-none"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
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
                  className={`text-xs text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                style={{
                  border: "1.5px solid transparent",
                  backgroundImage:
                    "linear-gradient(white, white), linear-gradient(to right, #0057FF, #FF9900, #FF3333)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
                className="absolute right-0 top-[60px] w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-dropDown"
                role="menu"
              >
                {/* Account Type Header */}
                <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-white rounded-t-2xl relative z-10">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Account Type
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0057FF] rounded-full capitalize shadow-sm">
                      {user?.role || "Client"}
                    </span>
                    {user?.role === "provider" &&
                      user?.job &&
                      user?.job !== "Not In Services" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full shadow-sm">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                          {user.job} Professional
                        </span>
                      )}
                  </div>
                </div>

                {[
                  {
                    to: "/provider-dashboard",
                    icon: FaTachometerAlt,
                    label: "Dashboard",
                  },
                  {
                    to: "/provider-onboarding/profile",
                    icon: FaUser,
                    label: "My Profile",
                  },
                  { to: "/settings", icon: FaCog, label: "Settings" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                    role="menuitem"
                  >
                    <item.icon className="text-gray-400 w-4 group-hover:text-[#0057FF] transition-colors" />
                    {item.label}
                  </Link>
                ))}

                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group relative"
                  role="menuitem"
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
                  role="menuitem"
                >
                  <FaSignOutAlt className="w-4 group-hover:rotate-180 transition-transform duration-300" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

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
                Here's what's happening with your business today
              </p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <FaPlus className="text-sm" />
              Create New Service
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              title: "Total Earnings",
              value: "GH₵ 4,200",
              icon: FaWallet,
              color: "from-[#0057FF] to-[#0066FF]",
              subtitle: "+12.5% this month",
            },
            {
              title: "Jobs Completed",
              value: "24",
              icon: FaCheckCircle,
              color: "from-emerald-500 to-emerald-600",
              subtitle: "5 this week",
            },
            {
              title: "Pending Requests",
              value: "3",
              icon: FaClock,
              color: "from-amber-500 to-amber-600",
              subtitle: "Awaiting response",
            },
            {
              title: "Average Rating",
              value: "4.8",
              icon: FaStar,
              color: "from-purple-500 to-purple-600",
              subtitle: "⭐ 128 reviews",
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

          {/* Recent Earnings */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  Recent Earnings
                </h2>
                <p className="text-sm text-gray-500">
                  Your latest transactions
                </p>
              </div>
              <Link
                to="/provider/earnings"
                className="text-sm text-[#0057FF] hover:underline flex items-center gap-1"
              >
                See all
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="bg-white border border-[#E8F0FF] rounded-2xl overflow-hidden shadow-sm">
              {recentEarnings.map((earning, index) => (
                <div
                  key={earning.id}
                  className={`flex items-center justify-between p-5 hover:bg-[#F8FAFF] transition-colors duration-200 ${
                    index < recentEarnings.length - 1
                      ? "border-b border-[#E8F0FF]"
                      : ""
                  } animate-fadeInRight`}
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#0057FF]">
                      <FaWallet className="text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A] text-sm">
                        {earning.service}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {earning.consumer} • {earning.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1A1A1A] text-sm">
                      {earning.amount}
                    </p>
                    <span className="inline-block text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
            transform: scale(0);
          }
          to {
            transform: scale(1);
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
      `}</style>
    </div>
  );
}

export default ProviderDashboard;
