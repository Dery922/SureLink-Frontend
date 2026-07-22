import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubNavbar from "./SubNavbar";
import { useDispatch } from "react-redux";
import { loginSuccess, logoutUser } from "../redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import SearchSection from "./SeachSection";

import api from "../APIs/api";

// LocationIQ API configuration
const LOCATIONIQ_API_KEY =
  process.env.REACT_APP_LOCATIONIQ_API_KEY || "your_api_key_here";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");

  // 📍 New state for location
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const locationFetched = useRef(false);

  const languages = ["English", "Twi", "French"];

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    setLangDropdownOpen(false);

    // Future i18n logic can go here
    // i18n.changeLanguage(lang);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = isAuthenticated || !!user?.id || !!user?._id;
  // 🚀 Check if user is a provider or customer
  const isProvider = user?.role === "provider" || user?.type === "provider";
  const isCustomer = user?.role === "customer" || user?.type === "customer";

  // 🚀 THE BULLETPROOF EXTRACTOR: Safely handles strings, arrays, or empty data structures without throwing errors
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

  // 📍 Fetch user location using LocationIQ (only for providers)
  const fetchUserLocation = async () => {
    if (locationFetched.current) return;

    setLocationLoading(true);

    try {
      // Get user's IP-based location using LocationIQ
      const response = await fetch(
        `https://api.locationiq.com/v1/ip?key=${LOCATIONIQ_API_KEY}&format=json`,
      );

      if (!response.ok) throw new Error("Failed to fetch location");

      const data = await response.json();

      // Extract city and region from response
      const location = {
        city: data.city || data.town || data.village || "Unknown City",
        state: data.state || data.region || "Unknown Region",
        country: data.country_name || "Unknown Country",
      };

      setUserLocation(location);
      locationFetched.current = true;

      // Store in localStorage for persistence
      localStorage.setItem("userLocation", JSON.stringify(location));
    } catch (error) {
      console.error("❌ Error fetching location:", error);

      // Try to load from localStorage as fallback
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          setUserLocation(JSON.parse(savedLocation));
          locationFetched.current = true;
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    } finally {
      setLocationLoading(false);
    }
  };

  // 🚀 Fetch location when user is a provider and logged in
  useEffect(() => {
    if (isLoggedIn && isProvider && !locationFetched.current) {
      fetchUserLocation();
    }
  }, [isLoggedIn, isProvider]);

  const handleLogout = async () => {
    try {
      // 🔑 Fix: Try both common local storage token key names dynamically
      const token = localStorage.getItem("authToken");

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
      localStorage.removeItem("userLocation"); // Clear location on logout

      dispatch(logoutUser()); // Triggers your Redux auth state reset
      setDropdownOpen(false);
      setMenuOpen(false);
      navigate("/"); // Redirects the viewport immediately
    }
  };

  // 📍 Format location display
  const getLocationDisplay = () => {
    if (locationLoading) return "Detecting...";
    if (userLocation) {
      return `${userLocation.city}, ${userLocation.state}`;
    }
    return "📍 Set Location";
  };

  // Handle search from the new component
  const handleSearch = (query, tags) => {
    console.log("Searching for:", query, "with tags:", tags);
    // You can implement additional search logic here
    // The navigation already happens in the SearchSection component
  };

  // 🚀 GET THE CORRECT DASHBOARD URL BASED ON USER ROLE
  const getDashboardUrl = () => {
    if (!isLoggedIn) return "/get-started";

    // Check if user has multiple roles
    const hasMultipleRoles = user?.roles?.length > 1;

    // If user has multiple roles, go to a role selection page or default to their primary type
    if (hasMultipleRoles) {
      // You could either:
      // 1. Go to a role selection page
      // return "/select-role";
      // 2. Or default to their primary type
      if (isProvider) return "/provider/dashboard";
      return "/customer/dashboard";
    }

    // Single role user
    if (isProvider) return "/provider/dashboard";
    if (isCustomer) return "/customer/dashboard";

    // Fallback
    return "/get-started";
  };

  // 🚀 GET DASHBOARD LABEL
  const getDashboardLabel = () => {
    if (!isLoggedIn) return "Get Started";

    if (isProvider) return "Dashboard";
    if (isCustomer) return "Dashboard";

    return "Get Started";
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

        {/* Search bar — REDESIGNED with click trigger */}
        <div
          className="hidden md:flex items-center border rounded-full px-4 py-2 w-[400px] lg:w-[480px] transition-all bg-gray-50 border-gray-200 hover:border-[#0057FF] hover:bg-white cursor-pointer group search-trigger"
          onClick={() => setSearchOpen(true)}
        >
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3 group-hover:text-[#0057FF]"></i>
          <span className="text-sm text-gray-400 flex-1">
            What service do you need?
          </span>
          <kbd className="hidden lg:inline-block px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-400 font-mono">
            ⌘K
          </kbd>
          <i className="fa-solid fa-location-dot text-gray-400 text-sm ml-3"></i>
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
          {isLoggedIn && isProvider ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <i className="fa-solid fa-location-dot text-[#0057FF]"></i>
              <span>{getLocationDisplay()}</span>
              {locationLoading && (
                <i className="fa-solid fa-spinner fa-spin text-gray-400 text-xs"></i>
              )}
            </div>
          ) : (
            <Link
              to="/become-provider"
              className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors whitespace-nowrap"
            >
              Become a Provider
            </Link>
          )}

          {/* Language Dropdown - UNCHANGED */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0057FF] transition-colors"
            >
              <i className="fa-solid fa-globe text-gray-500"></i>
              <span>{currentLang}</span>
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${
                  langDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 top-12 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentLang === lang
                          ? "bg-blue-50 text-[#0057FF] font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 🚀 FIXED: Dynamic Dashboard link based on user role */}
          {isLoggedIn ? (
            <Link
              to={getDashboardUrl()}
              className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
            >
              {getDashboardLabel()}
            </Link>
          ) : (
            <Link
              to="/get-started"
              className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
            >
              Get Started
            </Link>
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

      {/* Search Section Modal */}
      <SearchSection
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* 🌟 3-Color Gradient Divider Line */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, #0057FF, #FF9900, #0057FF)",
        }}
        className="w-full h-[2px]"
      />

      {/* Mobile menu - FIXED with dynamic dashboard link */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
          {/* Mobile search trigger */}
          <div
            className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 cursor-pointer"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3"></i>
            <span className="text-sm text-gray-400">
              What service do you need?
            </span>
          </div>

          {isLoggedIn && isProvider ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <i className="fa-solid fa-location-dot text-[#0057FF]"></i>
              <span>{getLocationDisplay()}</span>
              {locationLoading && (
                <i className="fa-solid fa-spinner fa-spin text-gray-400 text-xs"></i>
              )}
            </div>
          ) : (
            <Link to="/become-provider" className="text-sm text-gray-700">
              Become a Provider
            </Link>
          )}

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
                {isProvider && userLocation && (
                  <span className="text-xs text-gray-400">
                    📍 {userLocation.city}, {userLocation.state}
                  </span>
                )}
              </div>
              <Link to="/profile" className="text-sm text-gray-700">
                My Profile
              </Link>
              <Link to="/settings" className="text-sm text-gray-700">
                Settings
              </Link>
              {/* 🚀 FIXED: Dynamic dashboard link in mobile menu */}
              <Link
                to={getDashboardUrl()}
                className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
              >
                {getDashboardLabel()}
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
    </nav>
  );
}

export default Navbar;
