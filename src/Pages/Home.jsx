// src/pages/Home.jsx - Fixed with provider self-booking prevention

import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsentEnhanced from "../components/CookieConsent";
import TrustMatrix from "../components/TrustMatrix";
import ComingSoon from "./ComingSoon";
import PopularServicesToday from "../components/PopulaServices";
import { useSelector } from "react-redux";
import axios from "axios";
import { getAllProviders } from "../services/services";
import { useState, useEffect } from "react";
import { mockProvidersList } from "../mockMainData";

import PartTimeWorkSection from "./PartTimeWorkSection";

const categories = [
  { icon: "fa-wrench", label: "Plumbing", id: "plumbing" },
  { icon: "fa-broom", label: "Cleaning", id: "cleaning" },
  { icon: "fa-book-open", label: "Tutoring", id: "tutoring" },
  { icon: "fa-bolt", label: "Electrical", id: "electrical" },
  { icon: "fa-hammer", label: "Carpentry", id: "carpentry" },
  { icon: "fa-utensils", label: "Catering", id: "catering" },
  { icon: "fa-scissors", label: "Beauty", id: "beauty" },
  { icon: "fa-ellipsis", label: "More", id: "all" },
];

const steps = [
  {
    icon: "fa-magnifying-glass",
    title: "Search",
    description:
      "Find the right service provider in your area quickly and easily.",
  },
  {
    icon: "fa-calendar-check",
    title: "Book",
    description:
      "Schedule a time that works for you and confirm your booking instantly.",
  },
  {
    icon: "fa-circle-check",
    title: "Get it done",
    description:
      "Your provider shows up and gets the job done. Rate and review after.",
  },
];

function Home() {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Avatar lightbox states
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false);

  // Cover image lightbox states
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [selectedCoverProvider, setSelectedCoverProvider] = useState(null);
  const [isCoverLightboxOpen, setIsCoverLightboxOpen] = useState(false);

  // Helper function to check if the current user is the provider
  const isCurrentUserProvider = (provider) => {
    if (!user || !isAuthenticated) return false;
    const providerId = provider._id || provider.id;
    const userId = user._id || user.id;
    return providerId === userId;
  };

  const handleAvatarClick = (provider) => {
    const displayName =
      provider.business_profile?.businessName ||
      provider.name?.full ||
      `${provider.name?.first || ""} ${provider.name?.last || ""}`.trim() ||
      "Professional Provider";

    const avatarUrl =
      provider.avatar?.url ||
      provider.provider_profile?.avatar_url ||
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(displayName) +
        "&background=0057FF&color=fff";

    setSelectedAvatar(avatarUrl);
    setSelectedProvider(provider);
    setIsAvatarLightboxOpen(true);
  };

  const closeAvatarLightbox = () => {
    setIsAvatarLightboxOpen(false);
    setSelectedAvatar(null);
    setSelectedProvider(null);
  };

  // Handle cover image click
  const handleCoverClick = (provider) => {
    const coverUrl = getCoverImageUrl(provider);
    setSelectedCoverImage(coverUrl);
    setSelectedCoverProvider(provider);
    setIsCoverLightboxOpen(true);
  };

  const closeCoverLightbox = () => {
    setIsCoverLightboxOpen(false);
    setSelectedCoverImage(null);
    setSelectedCoverProvider(null);
  };

  // Helper function to get cover image URL
  const getCoverImageUrl = (provider) => {
    if (provider.coverPicture?.url) {
      return provider.coverPicture.url;
    }
    if (provider.coverPicture) {
      return provider.coverPicture;
    }
    if (provider.provider_profile?.cover_picture) {
      return provider.provider_profile.cover_picture;
    }
    if (provider.provider_profile?.cover_picture?.url) {
      return provider.provider_profile.cover_picture.url;
    }
    if (provider.cover_image) {
      return provider.cover_image;
    }
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";
  };

  // Helper function to get avatar URL
  const getAvatarUrl = (provider) => {
    const displayName =
      provider.business_profile?.businessName ||
      provider.name?.full ||
      `${provider.name?.first || ""} ${provider.name?.last || ""}`.trim() ||
      "Professional Provider";

    if (provider.avatar?.url) {
      return provider.avatar.url;
    }
    if (provider.avatar) {
      return provider.avatar;
    }
    if (provider.provider_profile?.avatar_url) {
      return provider.provider_profile.avatar_url;
    }
    if (provider.profile_picture) {
      return provider.profile_picture;
    }
    return (
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(displayName) +
      "&background=0057FF&color=fff"
    );
  };

  useEffect(() => {
    async function fetchTopProviders() {
      try {
        setLoading(true);
        setError(null);

        const result = await getAllProviders();

        console.log("🔍 Live backend response dataset:", result);

        if (result && result.success && Array.isArray(result.data)) {
          setProviders(result.data);
        } else if (
          result &&
          result.success &&
          Array.isArray(result.data?.users)
        ) {
          setProviders(result.data.users);
        } else {
          setProviders([]);
          setError("No providers found in your area.");
        }
      } catch (error) {
        console.error(
          "❌ Failed to load providers from backend registry:",
          error,
        );
        setError(
          "Unable to connect to the server. Please check your network or server status.",
        );
        setProviders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTopProviders();
  }, []);

  const handleProviderClick = (providerId) => {
    window.location.href = `/provider/${providerId}`;
  };
  const handleViewProfile = (providerId) => {
    window.location.href = `/provider/${providerId}`;
  };
  const handleChatNow = (providerId) => {
    window.location.href = `/chat/${providerId}`;
  };

  // ⭐ FIXED: Render function for the providers section
  const renderProvidersSection = () => {
    // Case 1: Loading
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8F0FF] shadow-sm animate-pulse"
            >
              <div className="h-[160px] bg-gray-200" />
              <div className="p-4 pt-6 relative">
                <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white absolute -top-6 left-4" />
                <div className="flex items-start justify-between mt-2 mb-4">
                  <div className="space-y-2 w-2/3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg w-14 flex-shrink-0" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-8 bg-[#F5F8FF] rounded-lg mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 h-10 bg-gray-200 rounded-lg" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Case 2: Error
    if (error && providers.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-red-100 shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-server text-3xl text-red-500"></i>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
            Connection Error
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-rotate-right"></i>
            Try Again
          </button>
        </div>
      );
    }

    // Case 3: No providers found
    if (!loading && !error && providers.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-[#E8F0FF]">
          <div className="w-20 h-20 bg-[#F5F8FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-regular fa-user-slash text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
            No Providers Available Right Now
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            We're growing our network of trusted professionals. New providers
            join daily. Please check back soon or explore all categories.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/category/all"
              className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-search"></i>
              Browse All Services
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate-right"></i>
              Refresh
            </button>
          </div>
        </div>
      );
    }

    // Case 4: Providers exist - show the grid
    if (providers.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider) => {
            const providerId = provider._id || provider.id;
            const isOwnProfile = isCurrentUserProvider(provider);

            const displayName =
              provider.business_profile?.businessName ||
              provider.name?.full ||
              `${provider.name?.first || ""} ${provider.name?.last || ""}`.trim() ||
              "Professional Provider";

            const avatarUrl = getAvatarUrl(provider);
            const coverUrl = getCoverImageUrl(provider);

            const serviceCategory =
              provider.provider_profile?.category || "General Services";
            const serviceCity =
              provider.business_profile?.address?.city ||
              provider.location?.home_address?.city ||
              "Accra";

            const basePrice = provider.provider_profile?.base_price || 0;
            const completedJobs =
              provider.provider_profile?.experience_years || 0;

            return (
              <div
                key={providerId}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8F0FF] shadow-sm hover:shadow-md transition-shadow group relative"
              >
                {/* "Your Profile" Badge for own profile */}
                {isOwnProfile && (
                  <div className="absolute top-2 left-2 z-10 bg-[#0057FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <i className="fa-solid fa-user-check text-[10px]"></i>
                    Your Profile
                  </div>
                )}

                {/* Cover Image */}
                <div className="relative h-[160px] overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={`${displayName} cover`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onClick={() => handleCoverClick(provider)}
                    style={{ cursor: "pointer" }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";
                    }}
                  />

                  {/* Cover Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCoverClick(provider);
                      }}
                      className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-white transition shadow-sm flex items-center gap-1"
                    >
                      <i className="fa-regular fa-image mr-1"></i>
                      View Cover
                    </button>
                  </div>

                  <div className="absolute top-2 right-2">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-white transition shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <i className="fa-regular fa-clock text-[#0057FF] text-[10px]"></i>
                      Response fast
                    </button>
                  </div>

                  <div className="absolute top-2 left-2">
                    <div className="bg-[#00A86B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <i className="fa-solid fa-circle-check text-[10px]"></i>
                      <span>
                        {provider.status === "verified" ? "Verified" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-6 relative">
                  {/* Avatar */}
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    onClick={() => handleAvatarClick(provider)}
                    title="Click to view full size"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white absolute -top-6 left-4 cursor-pointer hover:ring-2 hover:ring-[#0057FF] hover:ring-offset-2 transition-all duration-300"
                    onError={(e) => {
                      const name = displayName || "Provider";
                      e.target.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(name) +
                        "&background=0057FF&color=fff";
                    }}
                  />

                  <div className="flex items-start justify-between mt-2">
                    <div>
                      <h3 className="font-bold text-[15px] text-[#1A1A1A] line-clamp-1">
                        {displayName}
                        {isOwnProfile && (
                          <span className="ml-2 text-[10px] font-medium text-[#0057FF] bg-[#F5F8FF] px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 capitalize">
                        {serviceCategory} Service
                      </p>
                    </div>
                    <div className="bg-[#F5F8FF] px-2.5 py-1 rounded-lg text-center flex-shrink-0">
                      <p className="text-[10px] font-bold text-[#0057FF]">
                        GHS {basePrice}
                      </p>
                      <p className="text-[8px] text-gray-400 leading-none mt-0.5">
                        Base
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star text-xs ${
                          i < Math.floor(provider.trust?.average_rating || 5)
                            ? "text-[#FF6B00]"
                            : "text-gray-200"
                        }`}
                      ></i>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      ({provider.trust?.total_ratings || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                    <span className="text-xs text-gray-400">{serviceCity}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-4 p-2 bg-[#F5F8FF] rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-check text-[#00A86B] text-[10px]"></i>
                      <span className="text-[10px] text-gray-600">
                        ID Verified
                      </span>
                    </div>
                    <div className="w-px h-4 bg-[#E8F0FF]"></div>
                    <div className="flex items-center gap-1.5">
                      <i className="fa-regular fa-briefcase text-[#0057FF] text-[10px]"></i>
                      <span className="text-[10px] text-gray-600">
                        {completedJobs} yrs exp
                      </span>
                    </div>
                    <div className="w-px h-4 bg-[#E8F0FF]"></div>
                    <div className="flex items-center gap-1.5">
                      <i className="fa-regular fa-clock text-[#FF6B00] text-[10px]"></i>
                      <span className="text-[10px] text-gray-600">⚡ Fast</span>
                    </div>
                  </div>

                  {/* ✅ FIXED: Conditional rendering based on isOwnProfile */}
                  {isOwnProfile ? (
                    // Show "Manage Your Profile" button for own profile
                    <Link
                      to="/dashboard"
                      className="w-full bg-[#0057FF] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                      Manage Your Profile
                    </Link>
                  ) : (
                    // Show Book/Chat/View buttons for other providers
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/booking/${provider._id || provider.id}`}
                        state={{ from: location.pathname + location.search }}
                        className="col-span-1 bg-[#0057FF] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-regular fa-calendar-check text-xs"></i>
                        Book Now
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatNow(providerId);
                          }}
                          className="col-span-1 bg-[#F5F8FF] text-[#0057FF] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#E8F0FF] transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <i className="fa-regular fa-comment text-xs"></i>
                          Chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(providerId);
                          }}
                          className="col-span-1 bg-gray-100 text-gray-700 font-semibold text-sm py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <i className="fa-regular fa-eye text-xs"></i>
                          View
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#F5F8FF] pt-[72px]">
        <div className="max-w-[1280px] mx-auto px-5 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 max-w-full md:max-w-[560px] text-center md:text-left">
            <span className="inline-block bg-blue-100 text-[#0057FF] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🔒 100% Vetted & Verified Artisans
            </span>
            <h1 className="text-4xl md:text-[56px] font-bold text-[#1A1A1A] leading-tight mb-4">
              Find trusted service providers near you
            </h1>
            <p className="text-base md:text-lg text-gray-500 mb-8">
              Browse our full network of verified home and property specialists.
              Select the right professionals you need and get the job done
              safely.
            </p>
            <Link
              to="/category/all"
              className="inline-block bg-[#0057FF] text-white font-bold text-base px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              Browse Services
            </Link>
          </div>
          <div className="flex-1 w-full max-w-full md:max-w-[560px]">
            <img
              src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1469&auto=format&fit=crop"
              alt="Service providers"
              className="w-full h-[280px] md:h-[440px] object-cover rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="bg-white py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-8">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {categories.map((cat, index) => (
              <Link
                to={`/category/${cat.id}`}
                key={index}
                className="flex flex-col items-center justify-center bg-white border border-[#E8F0FF] rounded-2xl p-4 h-[110px] hover:border-[#0057FF] hover:bg-[#F5F8FF] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E8F0FF] rounded-xl flex items-center justify-center mb-2">
                  <i
                    className={`fa-solid ${cat.icon} text-[#0057FF] text-base md:text-lg`}
                  ></i>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-[#1A1A1A] text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PartTimeWorkSection />

      {/* Top Providers Section */}
      <section className="bg-[#F5F8FF] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
              Top providers near you
            </h2>
            <Link
              to="/category/all"
              className="text-sm text-[#0057FF] hover:underline"
            >
              See all
            </Link>
          </div>

          {renderProvidersSection()}
        </div>
      </section>

      {/* Cover Image Lightbox Modal */}
      {isCoverLightboxOpen && selectedCoverImage && selectedCoverProvider && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeCoverLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCoverLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <div className="relative">
              <img
                src={selectedCoverImage}
                alt={`${selectedCoverProvider.business_profile?.businessName || "Provider"} cover`}
                className="w-full h-auto max-h-[75vh] object-contain bg-gray-50"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80";
                }}
              />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A1A]">
                    {selectedCoverProvider.business_profile?.businessName ||
                      selectedCoverProvider.name?.full ||
                      "Service Provider"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedCoverProvider.provider_profile?.category ||
                      "Service Provider"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star text-xs ${
                            i <
                            Math.floor(
                              selectedCoverProvider.trust?.average_rating || 0,
                            )
                              ? "text-[#FF6B00]"
                              : "text-gray-200"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({selectedCoverProvider.trust?.total_ratings || 0}{" "}
                      reviews)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <i className="fa-regular fa-image"></i>
                    Cover Image
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCoverLightbox();
                    const providerId =
                      selectedCoverProvider._id || selectedCoverProvider.id;
                    window.location.href = `/provider/${providerId}`;
                  }}
                  className="px-4 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Lightbox Modal */}
      {isAvatarLightboxOpen && selectedAvatar && selectedProvider && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeAvatarLightbox}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAvatarLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <div className="relative">
              <img
                src={selectedAvatar}
                alt={
                  selectedProvider.business_profile?.businessName || "Provider"
                }
                className="w-full h-auto max-h-[70vh] object-contain bg-gray-50"
              />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A1A]">
                    {selectedProvider.business_profile?.businessName ||
                      selectedProvider.name?.full ||
                      "Service Provider"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedProvider.provider_profile?.category ||
                      "Service Provider"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star text-xs ${
                            i <
                            Math.floor(
                              selectedProvider.trust?.average_rating || 0,
                            )
                              ? "text-[#FF6B00]"
                              : "text-gray-200"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({selectedProvider.trust?.total_ratings || 0} reviews)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <i className="fa-regular fa-user"></i>
                    Profile Picture
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeAvatarLightbox();
                    const providerId =
                      selectedProvider._id || selectedProvider.id;
                    window.location.href = `/provider/${providerId}`;
                  }}
                  className="px-4 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ComingSoon />
      <TrustMatrix />

      {/* How it Works Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-center mb-12">
            <span className="bg-[#F5F8FF] text-[#0057FF] text-xs font-bold px-4 py-1.5 rounded-full">
              Simple & Secure
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#1A1A1A] mt-3 mb-3">
              How <span className="text-[#0057FF]">SureLink</span> works
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Get trusted services in your area with confidence. Here's how it
              works in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-[#E8F0FF] -translate-y-1/2"></div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white border border-[#E8F0FF] rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#1A1A1A] text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: "#F5F8FF" }}
                  >
                    <i
                      className={`fa-solid ${step.icon}`}
                      style={{ color: "#0057FF" }}
                    ></i>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "#F5F8FF",
                      color: "#0057FF",
                    }}
                  >
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#F5F8FF] to-white rounded-2xl p-6 md:p-8 border border-[#E8F0FF]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <i className="fa-solid fa-shield text-[#0057FF]"></i>
                  <span className="font-bold text-[#1A1A1A]">100%</span>
                </div>
                <p className="text-xs text-gray-500">Verified providers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <i className="fa-regular fa-star text-[#FF6B00]"></i>
                  <span className="font-bold text-[#1A1A1A]">4.9/5</span>
                </div>
                <p className="text-xs text-gray-500">Average rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <i className="fa-regular fa-clock text-[#00A86B]"></i>
                  <span className="font-bold text-[#1A1A1A]">&lt; 5 min</span>
                </div>
                <p className="text-xs text-gray-500">Average response</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <i className="fa-regular fa-user text-[#6B46C1]"></i>
                  <span className="font-bold text-[#1A1A1A]">2,847+</span>
                </div>
                <p className="text-xs text-gray-500">Happy customers</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/category/all"
              className="inline-flex items-center gap-2 bg-[#0057FF] text-white font-bold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find a provider now
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      <CookieConsentEnhanced />
      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;
