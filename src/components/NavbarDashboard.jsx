// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaCog,
  FaHouseUser,
  FaAirbnb,
  FaBell,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaWallet,
  FaChevronDown,
} from "react-icons/fa";
import api from "../APIs/api";
import { logoutUser } from "../redux/features/auth/authSlice";

const NavbarDashbaord = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Refs for dropdown
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
      navigate("/");
    }
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

  const navLinks = [
    {
      to: "/provider-dashbaord",
      label: "Home",
      icon: FaHouseUser, // Font Awesome home icon
    },
    {
      to: "/provider/manage/profile-page",
      label: "Manager Profile",
      icon: FaUser, // Font Awesome user settings icon
    },
    { to: "/provider/earnings", label: "Earnings", icon: FaWallet },
    {
      to: "/provider/bookings/management", // Add this
      label: "Bookings",
      icon: FaCalendarAlt,
    },
  ];

  const dropdownItems = [
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
  ];

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100/80 fixed top-0 left-0 z-50 h-[72px] shadow-sm animate-slideDown">
      <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo - Hidden on mobile */}
        <Link
          to="/"
          className="text-[#0057FF] font-bold text-xl tracking-tight hidden md:block"
        >
          <img
            src="/Logo.png"
            alt="SureLink logo"
            className="h-20 w-auto ml-4 object-contain"
            loading="eager"
          />
        </Link>

        {/* Logo - Mobile (smaller) */}
        <Link
          to="/"
          className="text-[#0057FF] font-bold text-xl tracking-tight md:hidden"
        >
          <img
            src="/Logo.png"
            alt="SureLink logo"
            className="h-12 w-auto object-contain"
            loading="eager"
          />
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
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

        {/* Nav Links - Mobile (Icons only, centered) */}
        <div className="flex md:hidden items-center justify-center gap-12 flex-1">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative group ${
                  isActive
                    ? "text-[#0057FF]"
                    : "text-gray-500 hover:text-[#0057FF]"
                }`}
              >
                <item.icon className="text-2xl" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#0057FF] rounded-full" />
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
            {/* Hide "Hi, Name" on mobile */}
            <span className="text-sm font-semibold text-gray-800 items-center gap-1 hidden sm:flex">
              Hi, {userFirstName}
              <FaChevronDown
                className={`text-xs text-gray-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </span>
            {/* Show just the chevron on very small screens */}
            <FaChevronDown
              className={`text-xs text-gray-400 transition-transform duration-200 sm:hidden ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
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

              {dropdownItems.map((item) => (
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
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
      `}</style>
    </nav>
  );
};

export default NavbarDashbaord;
