import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubNavbar from "./SubNavbar";
import { useDispatch } from "react-redux";
import { loginSuccess, logoutUser } from "../redux/features/auth/authSlice";
import { useSelector } from "react-redux";

import api from "../APIs/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user);

  const mockUser = {
    name: "Gideon Franklin",
  };
  const isLoggedIn = isAuthenticated || !!user?.id || !!user?._id;

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
      // 🔑 Fix: Try both common local storage token key names dynamically
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

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
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("profile_draft_key"); // Wipes lingering wizard draft cache flags

      dispatch(logoutUser()); // Triggers your Redux auth state reset
      setDropdownOpen(false);
      setMenuOpen(false);
      navigate("/"); // Redirects the viewport immediately
    }
  };

  return (
    <nav className="w-full bg-white fixed top-0 left-0 z-50">
      {/* Main Navbar Core Contents */}
      <div className="max-w-[1280px] mx-auto px-5 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-[#0057FF] font-bold text-xl tracking-tight shrink-0"
        >
          <img
            src="/Logo.png"
            alt="SureLink logo"
            className="h-20 w-auto ml-4 object-contain"
            loading="eager"
          />
        </Link>

        {/* Search bar — hidden on mobile */}
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

        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
          <Link
            to="/become-provider"
            className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors whitespace-nowrap"
          >
            Become a Provider
          </Link>
          {isLoggedIn ? (
            /* 👤 Desktop Dropdown Switch Container */
            <div className="relative flex items-center h-full">
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

                  {/* Dropdown Container with Inline Color Gradient */}
                  <div
                    style={{
                      border: "1.5px solid transparent",
                      backgroundImage:
                        "linear-gradient(white, white), linear-gradient(to right, #0057FF, #FF9900, #FF3333)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }}
                    className="absolute right-0 top-[60px] w-56 bg-white rounded-xl shadow-xl py-2 z-50
                  before:content-[''] before:absolute before:-top-[6px] before:right-6 before:w-3 before:h-3 before:bg-[#0057FF] before:rotate-45 before:-z-10"
                  >
                    {/* Account Type Header */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-1 bg-white rounded-t-xl relative z-10">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Account Type
                      </p>
                      <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-[#0057FF] rounded-full capitalize">
                        {user?.role || "Client"}
                      </span>
                    </div>

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

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa-solid fa-user text-gray-400 w-4"></i>
                      My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa-solid fa-gear text-gray-400 w-4"></i>
                      Settings
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

        {/* Burger menu — mobile only */}
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* 🌟 3-Color Gradient Divider Line — Explicitly separates Navbar and SubNavbar */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, #0057FF, #FF9900, #FF3333)",
        }}
        className="w-full h-[2px]"
      />

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3"></i>
            <input
              type="text"
              placeholder="What service do you need?"
              className="bg-transparent outline-none text-sm text-gray-500 w-full"
            />
          </div>
          <Link to="/become-provider" className="text-sm text-gray-700">
            Become a Provider
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/signin" className="text-sm text-gray-700">
                Sign in
              </Link>
              <Link
                to="/get-started"
                className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                <span className="text-sm font-semibold text-gray-800">
                  Hi, {user?.fullName?.split(" ") || "User"}
                </span>
                <span className="text-xs font-medium text-gray-400 capitalize">
                  Role: {user?.role || "Client"}
                </span>
              </div>
              <Link to="/profile" className="text-sm text-gray-700">
                My Profile
              </Link>
              <Link to="/settings" className="text-sm text-gray-700">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 font-medium text-left mt-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <SubNavbar />
      {isSearchFocused && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
