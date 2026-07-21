// components/PartTimeTicker.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function PartTimeTicker({ onViewDetails, onApply, job }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef(null);
  const animationRef = useRef(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock data with proper structure - all fields match what we use
  const mockOpportunities = [
    {
      _id: "1",
      title: "🔧 Plumber Needed - Bathroom Renovation",
      providerName: "Kwame Mensah",
      location: "East Legon",
      compensation: { amount: 150, type: "day" },
      urgency: true,
      category: "Plumbing",
      timeAgo: "2 min ago",
      description: "Looking for an experienced plumber",
    },
    {
      _id: "2",
      title: "🧹 Office Cleaning - 3 Days",
      providerName: "Ama Owusu",
      location: "Airport City",
      compensation: { amount: 80, type: "hour" },
      urgency: false,
      category: "Cleaning",
      timeAgo: "5 min ago",
      description: "Need 2 cleaners for office building",
    },
    {
      _id: "3",
      title: "⚡ Electrical Work - New Building",
      providerName: "Kofi Asante",
      location: "Tema",
      compensation: { amount: 200, type: "day" },
      urgency: true,
      category: "Electrical",
      timeAgo: "1 min ago",
      description: "Electrician needed for new building",
    },
    {
      _id: "4",
      title: "🍽️ Caterer Needed - Corporate Event",
      providerName: "Abena Darko",
      location: "Osu",
      compensation: { amount: 500, type: "fixed" },
      urgency: false,
      category: "Catering",
      timeAgo: "10 min ago",
      description: "Caterer for 200-person event",
    },
    {
      _id: "5",
      title: "🌿 Landscaping - Luxury Home",
      providerName: "Yaw Boateng",
      location: "Cantonments",
      compensation: { amount: 120, type: "day" },
      urgency: false,
      category: "Gardening",
      timeAgo: "3 min ago",
      description: "Garden maintenance needed",
    },
    {
      _id: "6",
      title: "🎨 Painting - 4 Bedroom House",
      providerName: "Esi Mensah",
      location: "Spintex",
      compensation: { amount: 300, type: "fixed" },
      urgency: true,
      category: "Painting",
      timeAgo: "8 min ago",
      description: "Painting for 4 bedroom house",
    },
  ];

  useEffect(() => {
    fetchOpportunities();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        // Validate data before setting
        const validData = mockOpportunities.filter(
          (opp) => opp && typeof opp === "object",
        );
        // Duplicate for seamless scrolling
        setOpportunities([...validData, ...validData]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to load opportunities");
      setLoading(false);
    }
  };

  const handleApply = (opportunityId, e) => {
    if (e) e.stopPropagation();
    if (!opportunityId) {
      toast.error("Invalid opportunity");
      return;
    }
    toast.success("Application submitted!");
  };

  // Safely get the ID from either _id or id
  const getOpportunityId = (opp) => {
    return opp?._id || opp?.id || `opp-${Math.random()}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-[#0057FF] via-[#0066FF] to-[#0057FF] rounded-2xl overflow-hidden shadow-xl">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-white text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl mb-2"></i>
            <p className="text-sm">Loading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#0057FF] via-[#0066FF] to-[#0057FF] rounded-2xl overflow-hidden shadow-xl">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-white text-center">
            <i className="fa-regular fa-clock text-3xl mb-2"></i>
            <p className="text-sm">No opportunities available right now</p>
            <p className="text-xs text-white/70 mt-1">Check back later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#0057FF] via-[#0066FF] to-[#0057FF] rounded-2xl overflow-hidden shadow-xl">
      {/* Live Indicator */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="text-white text-[10px] font-bold tracking-wider uppercase">
          Live Opportunities • Updated in Real-Time
        </span>
      </div>

      {/* Ticker Container */}
      <div
        className="relative overflow-hidden"
        style={{ height: "400px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={tickerRef}
          className="ticker-content"
          style={{
            animation: isPaused ? "none" : "scrollUp 25s linear infinite",
          }}
        >
          {opportunities.map((opportunity, index) => {
            // Skip if opportunity is undefined
            if (!opportunity) return null;

            // Safely get data with fallbacks
            const id = getOpportunityId(opportunity);
            const title = opportunity.title || "Opportunity Available";
            const providerName =
              opportunity.providerName || opportunity.provider || "Provider";
            const location = opportunity.location || "Location TBD";
            const amount =
              opportunity.compensation?.amount || opportunity.amount || 0;
            const type =
              opportunity.compensation?.type || opportunity.type || "hour";
            const urgency = opportunity.urgency || false;
            const category = opportunity.category || "General";
            const timeAgo = opportunity.timeAgo || "Just now";

            return (
              <div
                key={`${id}-${index}`}
                className="ticker-item group cursor-pointer hover:bg-white/10 transition-all duration-300"
                onClick={() => handleApply(id)}
              >
                <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10">
                  {/* Category Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl backdrop-blur-sm">
                    {category === "Plumbing" && "🔧"}
                    {category === "Cleaning" && "🧹"}
                    {category === "Electrical" && "⚡"}
                    {category === "Catering" && "🍽️"}
                    {category === "Gardening" && "🌿"}
                    {category === "Painting" && "🎨"}
                    {![
                      "Plumbing",
                      "Cleaning",
                      "Electrical",
                      "Catering",
                      "Gardening",
                      "Painting",
                    ].includes(category) && "💼"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {title}
                      </h3>
                      {urgency && (
                        <span className="flex-shrink-0 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-user"></i>
                        {providerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-location-dot"></i>
                        {location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <i className="fa-solid fa-money-bill-wave"></i>
                        GHS {amount}/{type}
                      </span>
                      <span className="flex items-center gap-1 text-white/50">
                        <i className="fa-regular fa-clock"></i>
                        {timeAgo}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(opportunity);
                      }}
                      className="px-3 py-2 rounded-lg border border-[#dee2e9] text-blue hover:bg-[#0057FF] hover:text-white"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onApply(job)}
                      className="px-3 py-2 rounded-lg bg-[#dee2e9] text-blue"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0057FF] to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0057FF] to-transparent pointer-events-none"></div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-3 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-xs flex items-center gap-2">
            <i className="fa-regular fa-circle-check text-[#00A86B]"></i>
            <span>New opportunities added every minute</span>
          </div>
          <Link
            to="/part-time/all"
            className="text-white text-sm font-semibold hover:underline flex items-center gap-1"
          >
            View All
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .ticker-content {
          display: flex;
          flex-direction: column;
          animation: scrollUp 25s linear infinite;
        }

        .ticker-content:hover {
          animation-play-state: paused;
        }

        .ticker-item {
          transition: all 0.3s ease;
          position: relative;
        }

        .ticker-item::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .ticker-item:hover::before {
          transform: translateX(100%);
        }

        @media (max-width: 640px) {
          .ticker-item .flex {
            gap: 8px;
          }

          .ticker-item .w-12 {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .ticker-item .px-6 {
            padding-left: 12px;
            padding-right: 12px;
          }

          .ticker-item .text-sm {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default PartTimeTicker;
