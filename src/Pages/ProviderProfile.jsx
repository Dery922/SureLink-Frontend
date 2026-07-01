// src/pages/ProviderProfile.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProviderById } from "../services/services";

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

  // Mock gallery data for testing
  const mockGallery = [
    {
      _id: "1",
      title: "Modern Kitchen Renovation",
      category: "Kitchen",
      description:
        "Complete kitchen remodel with custom cabinets and quartz countertops",
      url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      },
    },
    {
      _id: "2",
      title: "Bathroom Remodel",
      category: "Bathroom",
      description:
        "Luxury bathroom renovation with walk-in shower and modern fixtures",
      url: "https://images.unsplash.com/photo-1552321554-5fef8c9d4bf6?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1552321554-5fef8c9d4bf6?w=800&q=80",
      },
    },
    {
      _id: "3",
      title: "Living Room Design",
      category: "Interior",
      description:
        "Contemporary living room with custom furniture and accent wall",
      url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
      },
    },
    {
      _id: "4",
      title: "Exterior Painting",
      category: "Exterior",
      description: "Complete exterior painting with modern color scheme",
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      },
    },
    {
      _id: "5",
      title: "Deck Installation",
      category: "Outdoor",
      description: "Custom wooden deck with integrated lighting and seating",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      },
    },
    {
      _id: "6",
      title: "Office Renovation",
      category: "Interior",
      description: "Modern office space with open concept and natural lighting",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      },
    },
    {
      _id: "7",
      title: "Kitchen Backsplash",
      category: "Kitchen",
      description:
        "Custom tile backsplash installation with herringbone pattern",
      url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
      },
    },
    {
      _id: "8",
      title: "Landscaping Project",
      category: "Outdoor",
      description:
        "Complete landscape design with native plants and water feature",
      url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
      },
    },
    {
      _id: "9",
      title: "Master Bedroom Suite",
      category: "Interior",
      description: "Luxurious master bedroom with custom closet and ensuite",
      url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
      image: {
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
      },
    },
  ];

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

        // Add mock gallery data for testing
        const providerData = response.data;
        providerData.gallery = mockGallery;

        setProvider(providerData);
        console.log("this is mobdata", response);
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

  return (
    <div className="bg-[#F8FAFB] min-h-screen">
      <Navbar />

      <div className="pt-[72px]">
        {/* Cover photo */}
        <div className="relative w-full h-[200px] md:h-[300px] lg:h-[350px]">
          <img
            src={
              provider.coverPicture?.url ||
              provider.cover ||
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

          {/* Status badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span
                className={`w-2 h-2 rounded-full ${provider.provider_profile?.open_for_work !== false ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></span>
              <span className="text-xs font-medium text-gray-800">
                {provider.provider_profile?.open_for_work !== false
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
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                    }
                    alt={provider.name?.full || provider.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80";
                    }}
                  />
                  {provider.verification?.phone?.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-[#0057FF] text-white rounded-full p-1.5 border-2 border-white">
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                      {provider.name?.full ||
                        provider.name ||
                        "Service Provider"}
                    </h1>
                    {provider.badges &&
                      provider.badges.map((badge, index) => (
                        <span
                          key={index}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                            badge === "Verified"
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : badge === "Top Rated"
                                ? "bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20"
                                : "bg-[#0057FF]/10 text-[#0057FF] border border-[#0057FF]/20"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {provider.provider_profile?.category ||
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
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-location-dot text-xs text-[#0057FF]"></i>
                      <span className="text-sm text-gray-600">
                        {provider.location?.home_address?.area ||
                          provider.provider_profile?.service_area ||
                          provider.location ||
                          "Location not specified"}
                      </span>
                    </div>
                    {provider.provider_profile?.service_radius_km && (
                      <>
                        <span className="w-px h-4 bg-gray-200"></span>
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-globe text-xs text-[#0057FF]"></i>
                          <span className="text-sm text-gray-600">
                            {provider.provider_profile.service_radius_km}km
                            radius
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Languages */}
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
                    <p className="text-2xl font-bold text-[#0057FF]">
                      {provider.provider_profile?.base_price
                        ? `GH₵ ${provider.provider_profile.base_price}`
                        : provider.displayPrice || "GH₵ 0"}
                    </p>
                    {provider.provider_profile?.hourly_rate && (
                      <p className="text-xs text-gray-400">
                        GH₵ {provider.provider_profile.hourly_rate}/hr
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#0057FF] text-[#0057FF] font-medium text-sm rounded-xl hover:bg-[#F5F8FF] transition-all flex-1 justify-center">
                    <i className="fa-solid fa-comment"></i>
                    <span>Message</span>
                  </button>
                  <Link
                    to={`/booking/${provider._id || provider.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0057FF] text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-all flex-1 justify-center shadow-lg shadow-[#0057FF]/25"
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Book Now</span>
                  </Link>
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
                  {/* Bio */}
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">
                      About
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {showFullBio
                        ? provider.provider_profile?.bio ||
                          provider.about ||
                          provider.bio ||
                          "No bio available"
                        : (
                            provider.provider_profile?.bio ||
                            provider.about ||
                            provider.bio ||
                            "No bio available"
                          ).slice(0, 150) + "..."}
                    </p>
                    {(
                      provider.provider_profile?.bio ||
                      provider.about ||
                      provider.bio ||
                      ""
                    ).length > 150 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-[#0057FF] text-sm font-medium hover:underline mt-2"
                      >
                        {showFullBio ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  {/* Work Gallery Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Work Gallery
                      </h2>
                      {provider.gallery && provider.gallery.length > 0 && (
                        <span className="text-sm text-gray-400">
                          {provider.gallery.length} photos
                        </span>
                      )}
                    </div>

                    {!provider.gallery || provider.gallery.length === 0 ? (
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
                                src={item.image?.url || item.url || item}
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

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-[#F5F8FF] to-white rounded-2xl p-5 text-center border border-[#E8F0FF]">
                      <p className="text-2xl font-bold text-[#0057FF]">
                        {provider.provider_profile?.experience_years || 0}+
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
                        {provider.gallery?.length || 0}
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
                      {provider.verification?.phone?.verified && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-phone text-green-600"></i>
                          <span className="text-sm text-green-700">
                            Phone Verified
                          </span>
                        </div>
                      )}
                      {provider.verification?.email?.verified && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-envelope text-green-600"></i>
                          <span className="text-sm text-green-700">
                            Email Verified
                          </span>
                        </div>
                      )}
                      {provider.trust?.score && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                          <i className="fa-solid fa-shield-halved text-[#0057FF]"></i>
                          <span className="text-sm text-[#0057FF]">
                            Trust Score: {provider.trust.score}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Categories */}
                  {provider.provider_profile?.secondaryCategories &&
                    provider.provider_profile.secondaryCategories.length >
                      0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {provider.provider_profile.secondaryCategories.map(
                            (cat, index) => (
                              <span
                                key={index}
                                className="bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-200"
                              >
                                {cat}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Services tab */}
              {activeTab === "services" && (
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Services Offered
                  </h2>
                  {!provider.services || provider.services.length === 0 ? (
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
                      {provider.services.map((service, index) => (
                        <div
                          key={service._id || index}
                          className="group bg-white border border-[#E8F0FF] rounded-2xl p-5 hover:shadow-lg hover:border-[#0057FF] transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-[#E8F0FF] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0057FF] group-hover:text-white transition-colors">
                                <i
                                  className={`fa-solid ${service.icon || "fa-wrench"} text-[#0057FF] group-hover:text-white`}
                                ></i>
                              </div>
                              <div>
                                <h3 className="font-bold text-[#1A1A1A]">
                                  {service.name}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-gray-400">
                                    <i className="fa-solid fa-clock mr-1"></i>
                                    {service.duration || "Variable"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#0057FF] text-lg">
                                {service.price
                                  ? `GH₵ ${service.price}`
                                  : "GH₵ 0"}
                              </p>
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
                    className={`mt-4 flex items-center gap-2 ${provider.provider_profile?.open_for_work !== false ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-xl px-4 py-3`}
                  >
                    <i
                      className={`fa-solid fa-circle-check ${provider.provider_profile?.open_for_work !== false ? "text-green-600" : "text-red-600"}`}
                    ></i>
                    <span
                      className={`text-sm ${provider.provider_profile?.open_for_work !== false ? "text-green-700" : "text-red-700"}`}
                    >
                      {provider.provider_profile?.open_for_work !== false
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
                  selectedImage.image?.url || selectedImage.url || selectedImage
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
