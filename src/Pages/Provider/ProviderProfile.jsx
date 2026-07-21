// src/pages/ProviderProfile.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getProviderById } from "../../services/services";
import { useSelector } from "react-redux";

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [showFullBio, setShowFullBio] = useState(false);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const loggedInUserId = user?._id || user?.id;
  const profileUserId = id;
  const location = useLocation();
  const isOwnProfile = loggedInUserId === profileUserId;

  // Mock gallery data for testing (fallback only)
  const mockGallery = [
    // ... your mock gallery data
  ];

  const getServiceIcon = (service) => {
    // Map categories to icons
    const categoryIcons = {
      Plumbing: "fa-wrench",
      Cleaning: "fa-broom",
      Electrical: "fa-bolt",
      Carpentry: "fa-hammer",
      Painting: "fa-paint-roller",
      Gardening: "fa-seedling",
      "Pest Control": "fa-bug",
      "Appliance Repair": "fa-tools",
      HVAC: "fa-snowflake",
      Roofing: "fa-house",
      Flooring: "fa-layer-group",
      Tiling: "fa-th-large",
      Landscaping: "fa-tree",
      "Pool Maintenance": "fa-water",
      "Security Systems": "fa-shield-halved",
      "Smart Home": "fa-house-signal",
      "Interior Design": "fa-pencil-ruler",
      "Event Planning": "fa-calendar-plus",
      Catering: "fa-utensils",
      Photography: "fa-camera",
      "IT Services": "fa-laptop-code",
      "Web Development": "fa-code",
      "Mobile App Development": "fa-mobile-alt",
      "Digital Marketing": "fa-bullhorn",
      "Content Writing": "fa-pen-fancy",
      "Graphic Design": "fa-palette",
      "Video Editing": "fa-video",
      "Music Lessons": "fa-music",
      Tutoring: "fa-graduation-cap",
      "Fitness Training": "fa-dumbbell",
      "Massage Therapy": "fa-hand-sparkles",
      "Hair & Beauty": "fa-cut",
      "Mobile Car Wash": "fa-car",
      "Auto Repair": "fa-car-repair",
      "Glass Repair": "fa-window-maximize",
      Locksmith: "fa-lock",
      Handyman: "fa-toolbox",
      "Moving Services": "fa-truck",
      "Junk Removal": "fa-trash",
      Other: "fa-circle-plus",
    };

    // Check if service has a category that maps to an icon
    if (service.category && categoryIcons[service.category]) {
      return categoryIcons[service.category];
    }

    // Check if service has service types and use the first one
    if (service.serviceTypes && service.serviceTypes.length > 0) {
      const typeIcons = {
        pipe_repair: "fa-pipe",
        installation: "fa-download",
        drainage: "fa-water",
        leak_detection: "fa-search",
        water_heater: "fa-fire",
        bathroom_repair: "fa-bath",
        kitchen_plumbing: "fa-kitchen-set",
        pipe_insulation: "fa-snowflake",
        deep_cleaning: "fa-spray-can",
        carpet_cleaning: "fa-broom",
        window_cleaning: "fa-window-maximize",
        move_in_out: "fa-truck-moving",
        commercial: "fa-building",
        wiring: "fa-plug",
        lighting: "fa-lightbulb",
        panel_upgrade: "fa-microchip",
        outlet_repair: "fa-plug",
        ceiling_fan: "fa-fan",
        // Add more as needed
      };

      const firstType = service.serviceTypes[0];
      if (typeIcons[firstType]) {
        return typeIcons[firstType];
      }
    }

    // Default fallback
    return "fa-wrench";
  };

  // Fetch provider data when component mounts or id changes
  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) {
        setError("Provider ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getProviderById(id);

        // The response structure: { success: true, data: { provider, services, gallery } }
        const responseData = response.data;

        // Extract provider, services, and gallery from the response
        const providerData = responseData.provider || responseData;
        const servicesData = responseData.services || [];
        const galleryData = responseData.gallery || [];

        // Combine into a single provider object with services and gallery
        const combinedProvider = {
          ...providerData,
          services: servicesData,
          gallery: galleryData,
        };

        // If no gallery, use mock data for testing
        if (
          !combinedProvider.gallery ||
          combinedProvider.gallery.length === 0
        ) {
          combinedProvider.gallery = mockGallery;
        }

        setProvider(combinedProvider);
        console.log("Provider data:", combinedProvider);
        console.log("Services:", combinedProvider.services);
        console.log("Gallery:", combinedProvider.gallery);
      } catch (err) {
        console.error("Error fetching provider:", err);
        setError(err.message || "Failed to load provider profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fa-solid fa-star text-[#FF6B00]"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i
            key={i}
            className="fa-solid fa-star-half-stroke text-[#FF6B00]"
          ></i>,
        );
      } else {
        stars.push(
          <i key={i} className="fa-regular fa-star text-gray-300"></i>,
        );
      }
    }
    return stars;
  };

  // Get unique categories from gallery items
  const getGalleryCategories = () => {
    if (!provider?.gallery || provider.gallery.length === 0) return [];
    const categories = new Set();
    provider.gallery.forEach((item) => {
      if (item.category) categories.add(item.category);
    });
    return ["all", ...Array.from(categories)];
  };

  // Filter gallery items
  const getFilteredGallery = () => {
    if (!provider?.gallery) return [];
    if (galleryFilter === "all") return provider.gallery;
    return provider.gallery.filter((item) => item.category === galleryFilter);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E8F0FF] border-t-[#0057FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading provider profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
              Unable to Load Profile
            </h3>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/providers")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Browse Providers
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!provider) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa-solid fa-user-slash text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">
              Provider Not Found
            </h2>
            <p className="text-gray-400 mt-2">
              The provider you're looking for doesn't exist.
            </p>
            <Link
              to="/providers"
              className="inline-block mt-6 px-6 py-3 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Browse Providers
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get services and gallery from provider object
  const servicesList = provider.services || [];
  const galleryList = provider.gallery || [];
  const userProfile = provider.provider_profile || {};

  return (
    <div className="bg-[#F8FAFB] min-h-screen">
      <Navbar />

      <div className="pt-[72px]">
        {/* Cover photo - Using provider.coverPicture.url */}
        <div className="relative w-full h-[200px] md:h-[300px] lg:h-[350px]">
          <img
            src={
              provider.coverPicture?.url ||
              provider.coverPicture ||
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
            }
            alt={provider.name?.full || provider.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

          {/* Status badge - Using userProfile.open_for_work */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span
                className={`w-2 h-2 rounded-full ${
                  userProfile?.open_for_work !== false
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
              ></span>
              <span className="text-xs font-medium text-gray-800">
                {userProfile?.open_for_work !== false
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile header */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-5 -mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left section - Avatar & Info */}
              <div className="flex flex-col md:flex-row items-start gap-5">
                <div className="relative">
                  <img
                    src={
                      provider.avatar?.url ||
                      provider.avatar ||
                      userProfile?.avatar_url ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                    }
                    alt={provider.name?.full || provider.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80";
                    }}
                  />
                  {/* Verification badge */}
                  {provider.verification?.status === "verified" && (
                    <div className="absolute -bottom-1 -right-1 bg-[#0057FF] text-white rounded-full p-1.5 border-2 border-white">
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Name - Using provider.name.full */}
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                      {provider.name?.full ||
                        provider.name ||
                        "Service Provider"}
                    </h1>
                    {/* Display name badge */}
                    {provider.name?.display && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#0057FF]/10 text-[#0057FF] border border-[#0057FF]/20">
                        @{provider.name.display}
                      </span>
                    )}
                    {/* Trust status badge */}
                    {provider.trust?.status === "verified" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-600 border border-green-200">
                        <i className="fa-solid fa-circle-check mr-1"></i>
                        Verified
                      </span>
                    )}
                    {provider.trust?.status === "verification_pending" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                        <i className="fa-solid fa-clock mr-1"></i>
                        Pending Verification
                      </span>
                    )}
                  </div>

                  {/* Category - Using userProfile.category */}
                  <p className="text-gray-500 text-sm mt-1">
                    {userProfile?.category ||
                      provider.service ||
                      "Service Provider"}
                  </p>

                  {/* Rating & Location */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {renderStars(
                          provider.trust?.average_rating ||
                            provider.rating ||
                            0,
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {provider.trust?.average_rating || provider.rating || 0}
                      </span>
                      <span className="text-sm text-gray-400">
                        (
                        {provider.trust?.total_ratings || provider.reviews || 0}{" "}
                        reviews)
                      </span>
                    </div>
                    <span className="w-px h-4 bg-gray-200"></span>

                    {/* Location - Using userProfile.service_area */}
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-location-dot text-xs text-[#0057FF]"></i>
                      <span className="text-sm text-gray-600">
                        {userProfile?.service_area ||
                          provider.location?.home_address?.area ||
                          provider.location ||
                          "Location not specified"}
                      </span>
                    </div>

                    {/* Service Radius - Using userProfile.service_radius_km */}
                    {userProfile?.service_radius_km && (
                      <>
                        <span className="w-px h-4 bg-gray-200"></span>
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-globe text-xs text-[#0057FF]"></i>
                          <span className="text-sm text-gray-600">
                            {userProfile.service_radius_km}km radius
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Languages - Using provider.languages (if available) */}
                  {provider.languages && provider.languages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">Speaks:</span>
                      {provider.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-50 px-2 py-0.5 rounded-full text-gray-600"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right section - Actions */}
              <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-stretch">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Starting from</p>
                    {/* Base Price - Using userProfile.base_price */}
                    <p className="text-2xl font-bold text-[#0057FF]">
                      {userProfile?.base_price
                        ? `GH₵ ${userProfile.base_price}`
                        : provider.displayPrice || "GH₵ 0"}
                    </p>
                    {userProfile?.hourly_rate && (
                      <p className="text-xs text-gray-400">
                        GH₵ {userProfile.hourly_rate}/hr
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#0057FF] text-[#0057FF] font-medium text-sm rounded-xl hover:bg-[#F5F8FF] transition-all flex-1 justify-center">
                    <i className="fa-solid fa-comment"></i>
                    <span>Message</span>
                  </button>
                  {!isOwnProfile && (
                    <Link
                      to={`/booking/${provider._id || provider.id}`}
                      /* 🎯 3. Pass current page location data to the route state */
                      state={{ from: location.pathname + location.search }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#0057FF] text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-all flex-1 justify-center shadow-lg shadow-[#0057FF]/25"
                    >
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Book Now</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
              {["about", "services", "reviews", "availability"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap capitalize transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-[#0057FF] text-[#0057FF] bg-[#F5F8FF]"
                      : "border-transparent text-gray-500 hover:text-[#0057FF] hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 md:p-8 max-w-[900px]">
              {/* About tab */}
              {activeTab === "about" && (
                <div className="space-y-8">
                  {/* Bio - Using userProfile.bio */}
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">
                      About
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {showFullBio
                        ? userProfile?.bio ||
                          provider.about ||
                          provider.bio ||
                          "No bio available"
                        : (
                            userProfile?.bio ||
                            provider.about ||
                            provider.bio ||
                            "No bio available"
                          ).slice(0, 150) + "..."}
                    </p>
                    {(userProfile?.bio || provider.about || provider.bio || "")
                      .length > 150 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-[#0057FF] text-sm font-medium hover:underline mt-2"
                      >
                        {showFullBio ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  {/* Work Gallery Section - Using galleryList */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Work Gallery
                      </h2>
                      {galleryList && galleryList.length > 0 && (
                        <span className="text-sm text-gray-400">
                          {galleryList.length} photos
                        </span>
                      )}
                    </div>

                    {!galleryList || galleryList.length === 0 ? (
                      <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className="fa-regular fa-images text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                          No work gallery available
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          This provider hasn't uploaded any work samples yet
                        </p>
                      </div>
                    ) : (
                      <div>
                        {/* Gallery Filter */}
                        {getGalleryCategories().length > 1 && (
                          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
                            {getGalleryCategories().map((category) => (
                              <button
                                key={category}
                                onClick={() => setGalleryFilter(category)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                                  galleryFilter === category
                                    ? "bg-[#0057FF] text-white shadow-lg shadow-[#0057FF]/25"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {category === "all" ? "All Work" : category}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {getFilteredGallery().map((item, index) => (
                            <div
                              key={item._id || index}
                              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                              onClick={() => {
                                setSelectedImage(item);
                                setIsLightboxOpen(true);
                              }}
                            >
                              <img
                                src={item.imageUrl || item.url || item}
                                alt={item.title || `Work sample ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80";
                                }}
                              />

                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  {item.title && (
                                    <p className="text-white text-sm font-medium truncate">
                                      {item.title}
                                    </p>
                                  )}
                                  {item.category && (
                                    <p className="text-white/70 text-xs truncate">
                                      {item.category}
                                    </p>
                                  )}
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="text-white/70 text-xs">
                                      <i className="fa-regular fa-eye mr-1"></i>
                                      View
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Category badge */}
                              {item.category && (
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                  <span className="text-white text-[10px] font-medium">
                                    {item.category}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid - Using userProfile and galleryList */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-[#F5F8FF] to-white rounded-2xl p-5 text-center border border-[#E8F0FF]">
                      <p className="text-2xl font-bold text-[#0057FF]">
                        {userProfile?.experience_years || 0}+
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Years Experience
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F5F8FF] to-white rounded-2xl p-5 text-center border border-[#E8F0FF]">
                      <p className="text-2xl font-bold text-[#0057FF]">
                        {provider.trust?.total_ratings || provider.reviews || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Total Reviews
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F5F8FF] to-white rounded-2xl p-5 text-center border border-[#E8F0FF]">
                      <p className="text-2xl font-bold text-[#0057FF]">
                        {provider.trust?.average_rating || provider.rating || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Average Rating
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F5F8FF] to-white rounded-2xl p-5 text-center border border-[#E8F0FF]">
                      <p className="text-2xl font-bold text-[#0057FF]">
                        {galleryList?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Work Samples</p>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
                      Verification
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {/* Phone Verification */}
                      {provider.verification?.phone?.verified && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-phone text-green-600"></i>
                          <span className="text-sm text-green-700">
                            Phone Verified
                          </span>
                        </div>
                      )}
                      {/* Email Verification */}
                      {provider.verification?.email?.verified && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-envelope text-green-600"></i>
                          <span className="text-sm text-green-700">
                            Email Verified
                          </span>
                        </div>
                      )}
                      {/* ID Verification - Using userProfile.id_type */}
                      {userProfile?.id_type && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-id-card text-[#0057FF]"></i>
                          <span className="text-sm text-[#0057FF]">
                            {userProfile.id_type} Verified
                          </span>
                        </div>
                      )}
                      {/* Trust Status */}
                      {provider.trust?.status === "verified" && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                          <span className="text-sm text-emerald-700">
                            Trust Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Categories - Using userProfile.secondaryCategories */}
                  {userProfile?.secondaryCategories &&
                    userProfile.secondaryCategories.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.secondaryCategories.map((cat, index) => (
                            <span
                              key={index}
                              className="bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-200"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Services tab - Using servicesList */}
              {activeTab === "services" && (
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Services Offered
                  </h2>
                  {!servicesList || servicesList.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fa-solid fa-tools text-2xl text-gray-300"></i>
                      </div>
                      <p className="text-gray-400 text-sm">
                        No services listed yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {servicesList.map((service, index) => (
                        <div
                          key={service._id || index}
                          className="group bg-white border border-[#E8F0FF] rounded-2xl p-5 hover:shadow-lg hover:border-[#0057FF] transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-[#E8F0FF] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0057FF] group-hover:text-white transition-colors">
                                <i
                                  className={`fa-solid ${getServiceIcon(service)} text-[#0057FF] group-hover:text-white`}
                                ></i>
                              </div>
                              <div>
                                <h3 className="font-bold text-[#1A1A1A]">
                                  {service.name}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {service.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {/* Service Types */}
                                  {service.serviceTypes &&
                                    service.serviceTypes.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {service.serviceTypes.map(
                                          (type, idx) => (
                                            <span
                                              key={idx}
                                              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                                            >
                                              {type}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    )}
                                  <span className="text-xs text-gray-400">
                                    <i className="fa-solid fa-clock mr-1"></i>
                                    {service.duration || "Variable"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#0057FF] text-lg">
                                {service.basePrice || service.price
                                  ? `GH₵ ${service.basePrice || service.price}`
                                  : "GH₵ 0"}
                                {service.priceType === "hourly" && "/hr"}
                              </p>
                              {service.pricingModel === "individual" &&
                                service.individualPrices && (
                                  <p className="text-xs text-gray-400">
                                    {
                                      Object.keys(service.individualPrices)
                                        .length
                                    }{" "}
                                    pricing options
                                  </p>
                                )}
                              <Link
                                to={`/booking/${provider._id || provider.id}`}
                                className="text-xs text-gray-400 group-hover:text-[#0057FF] transition-colors"
                              >
                                Book Now →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews tab */}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      Reviews
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(
                          provider.trust?.average_rating ||
                            provider.rating ||
                            0,
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {provider.trust?.average_rating || provider.rating || 0}
                      </span>
                      <span className="text-sm text-gray-400">
                        (
                        {provider.trust?.total_ratings || provider.reviews || 0}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>

                  {!provider.reviewList || provider.reviewList.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fa-solid fa-star text-2xl text-gray-300"></i>
                      </div>
                      <p className="text-gray-400 text-sm">No reviews yet</p>
                      <p className="text-xs text-gray-300 mt-1">
                        Be the first to review this provider
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {provider.reviewList.map((review, index) => (
                        <div
                          key={review._id || index}
                          className="bg-white border border-[#E8F0FF] rounded-2xl p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={
                                review.avatar ||
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                              }
                              alt={review.name || "User"}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#E8F0FF]"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <p className="font-bold text-[#1A1A1A]">
                                    {review.name || "Anonymous"}
                                  </p>
                                  <div className="flex items-center gap-0.5 mt-0.5">
                                    {renderStars(review.rating || 0)}
                                  </div>
                                </div>
                                {review.date && (
                                  <span className="text-xs text-gray-400">
                                    {review.date}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Availability tab */}
              {activeTab === "availability" && (
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Working Hours
                  </h2>
                  {provider.availability?.schedule ? (
                    <div className="bg-white border border-[#E8F0FF] rounded-2xl p-6">
                      <div className="space-y-3">
                        {Object.entries(provider.availability.schedule).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                            >
                              <span className="capitalize text-gray-700 font-medium text-sm">
                                {day}
                              </span>
                              <span
                                className={`text-sm ${hours === "Closed" ? "text-red-500" : "text-gray-600"}`}
                              >
                                {hours}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fa-solid fa-clock text-2xl text-gray-300"></i>
                      </div>
                      <p className="text-gray-400 text-sm">
                        No availability schedule set
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Contact the provider for their availability
                      </p>
                    </div>
                  )}
                  <div
                    className={`mt-4 flex items-center gap-2 ${
                      userProfile?.open_for_work !== false
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    } border rounded-xl px-4 py-3`}
                  >
                    <i
                      className={`fa-solid fa-circle-check ${
                        userProfile?.open_for_work !== false
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    ></i>
                    <span
                      className={`text-sm ${
                        userProfile?.open_for_work !== false
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {userProfile?.open_for_work !== false
                        ? "Currently accepting new bookings"
                        : "Currently not accepting new bookings"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsLightboxOpen(false);
            setSelectedImage(null);
          }}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-2xl"
              onClick={() => {
                setIsLightboxOpen(false);
                setSelectedImage(null);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="bg-white rounded-2xl overflow-hidden">
              <img
                src={
                  selectedImage.imageUrl || selectedImage.url || selectedImage
                }
                alt={selectedImage.title || "Work sample"}
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80";
                }}
              />

              {(selectedImage.title ||
                selectedImage.category ||
                selectedImage.description) && (
                <div className="p-4 bg-white">
                  {selectedImage.title && (
                    <h3 className="font-bold text-[#1A1A1A] text-lg">
                      {selectedImage.title}
                    </h3>
                  )}
                  {selectedImage.category && (
                    <p className="text-sm text-[#0057FF] font-medium">
                      {selectedImage.category}
                    </p>
                  )}
                  {selectedImage.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProviderProfile;
