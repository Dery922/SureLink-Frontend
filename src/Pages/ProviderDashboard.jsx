import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../APIs/api";
import { logoutUser } from "../redux/features/auth/authSlice";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAccept = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleDecline = (id) => {
    setRequests(requests.filter((r) => r.id !== id));
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
    <div className="bg-[#F5F8FF] min-h-screen pt-[72px]">
      {/* Provider Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 fixed top-0 left-0 z-50 h-[72px]">
        <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-[#0057FF] font-bold text-xl tracking-tight"
          >
            SureLink
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/provider/dashboard"
              className="text-sm font-bold text-[#0057FF] border-b-2 border-[#0057FF] pb-0.5"
            >
              Dashboard
            </Link>
            <Link
              to="/provider/jobs"
              className="text-sm text-gray-500 hover:text-[#0057FF] transition-colors"
            >
              Job Requests
            </Link>
            <Link
              to="/provider/earnings"
              className="text-sm text-gray-500 hover:text-[#0057FF] transition-colors"
            >
              Earnings
            </Link>
          </div>

          {/* Avatar */}
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
                  <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-white rounded-t-xl relative z-10">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Account Type
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {/* Base Role Badge */}
                      <span className="inline-block text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-[#0057FF] rounded-full capitalize shadow-sm">
                        {user?.role || "Client"}
                      </span>

                      {/* 🎯 Dynamic Business Type Specification Badge */}
                      {user?.role === "provider" &&
                        user?.job &&
                        user?.job !== "Not In Services" && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full shadow-sm animate-in fade-in zoom-in-95 duration-150">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                            {user.job} Professional
                          </span>
                        )}
                    </div>
                  </div>

                  <Link
                    to={user?.role === "provider" ? "/provider-dashbaord" : "/"}
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
        </div>
      </nav>

      {/* Page content */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        {/* Welcome */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8">
          Welcome back, Kwame
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Earnings */}
          <div className="bg-[#0057FF] rounded-2xl p-6">
            <p className="text-blue-100 text-sm mb-3">Total Earnings</p>
            <p className="text-white text-3xl font-bold">GH₵ 4,200</p>
          </div>

          {/* Jobs Completed */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8F0FF]">
            <p className="text-gray-500 text-sm mb-3">Jobs Completed</p>
            <p className="text-[#1A1A1A] text-3xl font-bold">24</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8F0FF]">
            <p className="text-gray-500 text-sm mb-3">Pending Requests</p>
            <p className="text-[#1A1A1A] text-3xl font-bold">3</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8F0FF]">
            <p className="text-gray-500 text-sm mb-3">Average Rating</p>
            <p className="text-[#1A1A1A] text-3xl font-bold">4.8</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Pending Requests
              </h2>
              <Link
                to="/provider/jobs"
                className="text-sm text-[#0057FF] hover:underline"
              >
                See all
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white border border-[#E8F0FF] rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white border border-[#E8F0FF] rounded-2xl p-5"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={request.avatar}
                        alt={request.consumer}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-[#1A1A1A] text-sm">
                          {request.consumer}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {request.service}
                        </p>
                      </div>
                      <span className="font-bold text-[#0057FF] text-sm">
                        {request.amount}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="fa-solid fa-calendar text-[#0057FF]"></i>
                        <span>{request.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="fa-solid fa-location-dot text-[#0057FF]"></i>
                        <span>{request.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 py-2.5 bg-[#0057FF] text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Recent Earnings
              </h2>
              <Link
                to="/provider/earnings"
                className="text-sm text-[#0057FF] hover:underline"
              >
                See all
              </Link>
            </div>

            <div className="bg-white border border-[#E8F0FF] rounded-2xl overflow-hidden">
              {recentEarnings.map((earning, index) => (
                <div
                  key={earning.id}
                  className={`flex items-center justify-between p-5 ${index < recentEarnings.length - 1 ? "border-b border-[#E8F0FF]" : ""}`}
                >
                  <div>
                    <p className="font-bold text-[#1A1A1A] text-sm">
                      {earning.service}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {earning.consumer} • {earning.date}
                    </p>
                  </div>
                  <p className="font-bold text-[#1A1A1A] text-sm">
                    {earning.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
