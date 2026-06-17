import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubNavbar from "./SubNavbar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../APIs/mockAuthApi";
import api from "../APIs/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🎯 Pull authentication state variables directly from your Redux store
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // 🔑 Double-check tokens to ensure session persists across browser page reloads
  const hasToken = !!(
    localStorage.getItem("token") || localStorage.getItem("authToken")
  );
  const isLoggedIn = isAuthenticated || hasToken;

  // 👤 Safely compute first names and initials to show on profile elements
  const userFirstName =
    user?.name?.first ||
    user?.firstName ||
    (user?.fullName ? user.fullName.split(" ")[0] : "User");
  const initialLetter =
    typeof userFirstName === "string"
      ? userFirstName.charAt(0).toUpperCase()
      : "U";

  const handleLogout = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      // 🚀 Call your backend session invalidation endpoint
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      console.error("Server logout request failed:", err);
    } finally {
      // 🧹 Wipe all client browser storage footprints cleanly
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("profile_draft_key");

      dispatch(logoutUser());
      setDropdownOpen(false);
      setMenuOpen(false);
      navigate("/signin");
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 fixed top-0 left-0 z-50">
      <div className="max-w-[1280px] mx-auto px-5 h-[72px] flex items-center justify-between">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-[#0057FF] font-bold text-xl tracking-tight shrink-0"
          onClick={() => {
            setDropdownOpen(false);
            setMenuOpen(false);
          }}
        >
          <img
            src="/Logo.png"
            alt="SureLink logo"
            className="h-20 w-auto ml-4 object-contain"
            loading="eager"
          />
        </Link>

        {/* Search Bar Section — Hidden on Mobile viewports */}
        <div
          className={`hidden md:flex items-center border rounded-full px-4 py-2 w-[400px] lg:w-[480px] transition-all relative ${
            isSearchFocused
              ? "bg-white border-[#0057FF] shadow-lg z-50"
              : "bg-gray-50 border-gray-200 z-50"
          }`}
        >
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3"></i>
          <input
            type="text"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
            placeholder="What service do you need?"
            className="bg-transparent outline-none text-sm text-gray-500 w-full"
          />
          <i className="fa-solid fa-location-dot text-gray-400 text-sm ml-3"></i>
        </div>

        {/* Desktop Control Panel Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
          <Link
            to="/become-provider"
            className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors whitespace-nowrap"
          >
            Become a Provider
          </Link>

          {isLoggedIn ? (
            /* 👤 Desktop Dropdown Switch Container */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 cursor-pointer outline-none select-none group focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-[#0057FF] text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-600 transition-colors overflow-hidden">
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
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  Hi, {userFirstName}
                  <i
                    className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  ></i>
                </span>
              </button>

              {/* Dropdown Options Cards Overlay Modal Element */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20">
                    <Link
                      to={
                        user?.role === "provider"
                          ? "/provider/dashboard"
                          : "/dashboard"
                      }
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa-solid fa-gauge text-gray-400 w-4"></i>
                      Dashboard
                    </Link>
                    <hr className="border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/50 font-medium text-left transition-colors focus:outline-none"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket w-4"></i>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/get-started"
                className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {isSearchFocused && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-150"
          onClick={() => setIsSearchFocused(false)}
        />
      )}

      <SubNavbar />
    </nav>
  );
}

export default Navbar;
