// src/components/HighDemandAreas.jsx
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaFire,
  FaCrown,
  FaLock,
  FaChartLine,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HighDemandAreas = ({ userServices, isSubscribed }) => {
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Simulated demand data based on services
  useEffect(() => {
    // Simulate API call
    const fetchDemandData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock demand data based on services
      const mockDemandData = generateDemandData(
        userServices || ["General Services"],
      );
      setDemandData(mockDemandData);
      setLoading(false);
    };

    fetchDemandData();
  }, [userServices]);

  const generateDemandData = (services) => {
    const locations = [
      {
        name: "East Legon, Accra",
        lat: 5.6037,
        lng: -0.187,
        demand: 92,
        growth: 15,
      },
      { name: "Osu, Accra", lat: 5.5481, lng: -0.188, demand: 88, growth: 12 },
      {
        name: "Tema, Accra",
        lat: 5.6699,
        lng: -0.0175,
        demand: 85,
        growth: 20,
      },
      {
        name: "Spintex, Accra",
        lat: 5.6269,
        lng: -0.1313,
        demand: 78,
        growth: 8,
      },
      {
        name: "Dzorwulu, Accra",
        lat: 5.623,
        lng: -0.185,
        demand: 72,
        growth: 5,
      },
      {
        name: "Cantonments, Accra",
        lat: 5.5912,
        lng: -0.178,
        demand: 70,
        growth: 10,
      },
      {
        name: "Airport Residential, Accra",
        lat: 5.605,
        lng: -0.175,
        demand: 68,
        growth: 7,
      },
      {
        name: "Ablekuma, Accra",
        lat: 5.592,
        lng: -0.245,
        demand: 65,
        growth: 3,
      },
    ];

    // Map services to demand data with relevance
    return locations
      .map((location, index) => {
        // Different services have different demand in different areas
        const serviceBoost = services.some(
          (s) =>
            s.toLowerCase().includes("electrical") ||
            s.toLowerCase().includes("wiring"),
        )
          ? 1.2
          : 1;

        const locationDemand = Math.min(
          95,
          Math.round(
            location.demand * (0.85 + Math.random() * 0.3) * serviceBoost,
          ),
        );

        return {
          ...location,
          demand: locationDemand,
          demandLevel:
            locationDemand >= 85
              ? "high"
              : locationDemand >= 70
                ? "medium"
                : "low",
          potentialEarnings: Math.round((locationDemand / 100) * 2500),
          competitors: Math.floor(Math.random() * 15) + 1,
          lastUpdated: new Date(
            Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
          ).toLocaleDateString(),
          servicesInDemand: services.slice(
            0,
            Math.floor(Math.random() * 3) + 1,
          ),
          rank: index + 1,
        };
      })
      .sort((a, b) => b.demand - a.demand);
  };

  const getDemandColor = (level) => {
    switch (level) {
      case "high":
        return "from-red-500 to-orange-500";
      case "medium":
        return "from-amber-500 to-yellow-500";
      case "low":
        return "from-blue-400 to-blue-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getDemandEmoji = (level) => {
    switch (level) {
      case "high":
        return "🔥";
      case "medium":
        return "⚡";
      case "low":
        return "📊";
      default:
        return "📈";
    }
  };

  const getDemandIcon = (level) => {
    switch (level) {
      case "high":
        return FaFire;
      case "medium":
        return FaChartLine;
      case "low":
        return FaUsers;
      default:
        return FaMapMarkerAlt;
    }
  };

  const displayedData = showAll ? demandData : demandData.slice(0, 4);

  if (loading) {
    return (
      <div className="bg-white border border-[#E8F0FF] rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#E8F0FF] border-t-[#0057FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">
              Analyzing demand patterns...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8F0FF] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#E8F0FF] bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                High Demand Areas
              </h2>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full animate-pulse">
                Live
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Discover where your services are most needed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#E8F0FF]">
              <FaMapMarkerAlt className="inline mr-1 text-[#0057FF]" />
              {demandData.length} locations
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Status Banner */}
      <div
        className={`p-4 mx-6 mt-4 rounded-xl ${isSubscribed ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200" : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaCrown className="text-emerald-600 text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700 text-sm">
                    Premium Access
                  </p>
                  <p className="text-xs text-emerald-600">
                    You're seeing all demand insights
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaLock className="text-amber-600 text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-amber-700 text-sm">
                    Subscribe for Full Access
                  </p>
                  <p className="text-xs text-amber-600">
                    Unlock all demand insights and analytics
                  </p>
                </div>
              </>
            )}
          </div>
          {!isSubscribed && (
            <Link
              to="/subscription"
              className="px-4 py-2 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Upgrade Now
              <FaArrowRight className="text-xs" />
            </Link>
          )}
        </div>
      </div>

      {/* Demand Cards */}
      <div className="p-6">
        {demandData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-3xl text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No demand data available</p>
            <p className="text-xs text-gray-300 mt-1">
              Add more services to see insights
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedData.map((location, index) => {
                const DemandIcon = getDemandIcon(location.demandLevel);
                return (
                  <div
                    key={index}
                    className={`group relative bg-gradient-to-br ${getDemandColor(location.demandLevel)} rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${!isSubscribed && index >= 4 ? "opacity-75 blur-[1px]" : ""}`}
                  >
                    {/* Blur overlay for non-subscribers */}
                    {!isSubscribed && index >= 4 && (
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center gap-2">
                          <FaLock className="text-xs" />
                          <span className="text-xs font-medium">
                            Subscribe to unlock
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="relative z-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                              #{location.rank}
                            </span>
                            <span className="text-white/60 text-xs">
                              {location.lastUpdated}
                            </span>
                          </div>
                          <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <FaMapMarkerAlt className="text-white/70 text-sm" />
                            {location.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-white/80 text-sm">
                              <span className="font-bold">
                                {location.demand}%
                              </span>
                              Demand
                            </span>
                            <span className="w-px h-4 bg-white/30"></span>
                            <span className="flex items-center gap-1 text-white/80 text-sm">
                              <span className="font-bold">
                                GH₵{location.potentialEarnings}
                              </span>
                              Potential
                            </span>
                            <span className="w-px h-4 bg-white/30"></span>
                            <span className="flex items-center gap-1 text-white/80 text-sm">
                              <span className="font-bold">
                                {location.competitors}
                              </span>
                              Competitors
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-white">
                            <DemandIcon className="text-lg" />
                            <span className="text-2xl font-bold">
                              {location.demand}%
                            </span>
                          </div>
                          <span className="text-white/60 text-xs block">
                            {location.demandLevel} demand
                          </span>
                        </div>
                      </div>

                      {/* Services in demand badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {location.servicesInDemand.map((service, idx) => (
                          <span
                            key={idx}
                            className="text-white/80 text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* Growth indicator */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/60 text-xs bg-white/10 px-2 py-1 rounded-full">
                        <span
                          className={
                            location.growth > 10
                              ? "text-green-300"
                              : "text-yellow-300"
                          }
                        >
                          ↑ {location.growth}%
                        </span>
                        <span>growth</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show more button */}
            {demandData.length > 4 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-4 py-3 text-sm font-semibold text-[#0057FF] bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {showAll
                  ? "Show Less"
                  : `Show All ${demandData.length} Locations`}
                <FaArrowRight
                  className={`text-xs transition-transform duration-300 ${showAll ? "rotate-90" : ""}`}
                />
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA for non-subscribers */}
      {!isSubscribed && (
        <div className="p-6 border-t border-[#E8F0FF] bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                🚀 Unlock Your Growth Potential
              </p>
              <p className="text-xs text-gray-500">
                Get full access to demand insights, competitor analysis, and
                growth opportunities
              </p>
            </div>
            <Link
              to="/subscription"
              className="px-6 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <FaCrown className="text-sm" />
              Subscribe Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighDemandAreas;
