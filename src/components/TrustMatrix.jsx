import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TrustMatrix = () => {
  const [activeTab, setActiveTab] = useState("verified");
  const [hoveredItem, setHoveredItem] = useState(null);

  // Trust metrics data
  const trustMetrics = {
    verified: {
      title: "Verified Professionals",
      icon: "fa-shield-check",
      description:
        "Every provider is thoroughly vetted before joining our platform",
      stats: [
        {
          label: "Background Checks",
          value: "100%",
          icon: "fa-clipboard-check",
        },
        { label: "ID Verified", value: "98%", icon: "fa-id-card" },
        { label: "Experience Verified", value: "95%", icon: "fa-certificate" },
        { label: "Skill Tests Passed", value: "92%", icon: "fa-check-double" },
      ],
      color: "#0057FF",
    },
    ratings: {
      title: "Real Reviews",
      icon: "fa-star",
      description: "Authentic ratings from verified customers you can trust",
      stats: [
        {
          label: "Verified Reviews",
          value: "2,847+",
          icon: "fa-comment-check",
        },
        {
          label: "Average Rating",
          value: "4.8 ★",
          icon: "fa-star-half-stroke",
        },
        { label: "Response Rate", value: "97%", icon: "fa-clock" },
        { label: "Completion Rate", value: "99%", icon: "fa-circle-check" },
      ],
      color: "#FF6B00",
    },
    guarantees: {
      title: "Our Guarantees",
      icon: "fa-handshake",
      description:
        "We stand behind every booking with our satisfaction guarantees",
      stats: [
        {
          label: "Satisfaction Guarantee",
          value: "100%",
          icon: "fa-thumbs-up",
        },
        { label: "On-Time Arrival", value: "96%", icon: "fa-clock" },
        {
          label: "Workmanship Warranty",
          value: "30 Days",
          icon: "fa-calendar-days",
        },
        { label: "Insurance Coverage", value: "Up to $1M", icon: "fa-shield" },
      ],
      color: "#00A86B",
    },
    community: {
      title: "Community Trust",
      icon: "fa-users",
      description: "Join thousands of satisfied customers in your community",
      stats: [
        { label: "Active Users", value: "12,450+", icon: "fa-user-group" },
        { label: "Happy Customers", value: "98%", icon: "fa-face-smile" },
        { label: "Repeat Bookings", value: "76%", icon: "fa-arrows-rotate" },
        { label: "Referrals", value: "3.2K+", icon: "fa-share-nodes" },
      ],
      color: "#6B46C1",
    },
  };

  // Animation for counter - optional
  const [displayValues, setDisplayValues] = useState({});

  useEffect(() => {
    // You could add a counting animation here
    const initialValues = {};
    Object.keys(trustMetrics).forEach((key) => {
      trustMetrics[key].stats.forEach((stat) => {
        initialValues[stat.label] = stat.value;
      });
    });
    setDisplayValues(initialValues);
  }, []);

  return (
    <section className="bg-white py-12 md:py-16 border-t border-[#E8F0FF]">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header with trust badge */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#E8F0FF] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-shield-halved text-[#0057FF] text-lg"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
                Trusted by <span className="text-[#0057FF]">Ghanaians</span>
              </h2>
            </div>
            <p className="text-sm text-gray-500 pl-14">
              Your safety and satisfaction are our top priorities
            </p>
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-6 mt-4 md:mt-0 bg-[#F5F8FF] px-6 py-3 rounded-full">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shield text-[#0057FF] text-sm"></i>
              <span className="text-sm font-semibold text-[#1A1A1A]">
                4.9/5
              </span>
            </div>
            <div className="w-px h-6 bg-[#E8F0FF]"></div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-star text-[#FF6B00] text-sm"></i>
              <span className="text-sm font-semibold text-[#1A1A1A]">
                2,847+ reviews
              </span>
            </div>
            <div className="w-px h-6 bg-[#E8F0FF]"></div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-clock text-[#00A86B] text-sm"></i>
              <span className="text-sm font-semibold text-[#1A1A1A]">
                97% response
              </span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 border-b border-[#E8F0FF] pb-0">
          {Object.entries(trustMetrics).map(([key, metric]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 rounded-t-lg font-medium text-sm transition-all relative ${
                activeTab === key
                  ? "text-[#0057FF] bg-[#F5F8FF]"
                  : "text-gray-500 hover:text-[#1A1A1A] hover:bg-[#F5F8FF]/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${metric.icon} text-sm`}></i>
                <span>{metric.title}</span>
              </div>
              {activeTab === key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0057FF]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="bg-[#F5F8FF] rounded-2xl p-6 md:p-8">
          {Object.entries(trustMetrics).map(([key, metric]) => (
            <div
              key={key}
              className={`transition-all duration-300 ${
                activeTab === key ? "block" : "hidden"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {/* Main metric card */}
                <div className="md:col-span-1 bg-white rounded-xl p-6 flex flex-col items-start justify-between">
                  <div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${metric.color}15` }}
                    >
                      <i
                        className={`fa-solid ${metric.icon} text-xl`}
                        style={{ color: metric.color }}
                      ></i>
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                      {metric.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {metric.description}
                    </p>
                  </div>

                  <Link
                    to="/trust"
                    className="text-sm text-[#0057FF] hover:underline font-medium mt-4 inline-flex items-center gap-1"
                  >
                    Learn more
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>

                {/* Stats grid */}
                {metric.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-default"
                    onMouseEnter={() => setHoveredItem(`${key}-${index}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      borderLeft:
                        hoveredItem === `${key}-${index}`
                          ? `4px solid ${metric.color}`
                          : "4px solid transparent",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${metric.color}10` }}
                      >
                        <i
                          className={`fa-solid ${stat.icon} text-sm`}
                          style={{ color: metric.color }}
                        ></i>
                      </div>
                    </div>

                    {/* Progress bar for visual appeal */}
                    {typeof stat.value === "string" &&
                      stat.value.includes("%") && (
                        <div className="mt-3 w-full bg-[#F5F8FF] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-1000"
                            style={{
                              width: stat.value,
                              backgroundColor: metric.color,
                            }}
                          ></div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust indicators */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8F0FF]">
            <i className="fa-solid fa-lock text-[#00A86B] text-lg"></i>
            <div>
              <p className="text-xs text-gray-500">Secure Payments</p>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                Escrow Protection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8F0FF]">
            <i className="fa-solid fa-phone text-[#0057FF] text-lg"></i>
            <div>
              <p className="text-xs text-gray-500">24/7 Support</p>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                We're here to help
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8F0FF]">
            <i className="fa-regular fa-credit-card text-[#6B46C1] text-lg"></i>
            <div>
              <p className="text-xs text-gray-500">Payment Options</p>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                Mobile Money & Card
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8F0FF]">
            <i className="fa-regular fa-face-smile text-[#FF6B00] text-lg"></i>
            <div>
              <p className="text-xs text-gray-500">Satisfaction</p>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                98% Happy Customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustMatrix;
