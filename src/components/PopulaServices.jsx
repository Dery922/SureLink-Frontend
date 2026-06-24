import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PopularServicesToday = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isHovered, setIsHovered] = useState(null);

  // Mock data - in production this would come from an API
  useEffect(() => {
    const mockPopularServices = [
      {
        id: "plumbing",
        label: "Plumbing",
        icon: "fa-wrench",
        requests: 43,
        trend: "up",
        change: "+12%",
        color: "#0057FF",
        bgColor: "#E8F0FF",
        topProviders: ["Kwame Mensah", "John Doe", "Sarah Smith"],
      },
      {
        id: "electrical",
        label: "Electrical",
        icon: "fa-bolt",
        requests: 28,
        trend: "up",
        change: "+8%",
        color: "#FF6B00",
        bgColor: "#FFF0E8",
        topProviders: ["Kofi Asante", "Mike Johnson", "David Brown"],
      },
      {
        id: "cleaning",
        label: "Cleaning",
        icon: "fa-broom",
        requests: 21,
        trend: "up",
        change: "+5%",
        color: "#00A86B",
        bgColor: "#E8FFF0",
        topProviders: ["Ama Owusu", "Mary Williams", "Grace Amponsah"],
      },
      {
        id: "carpentry",
        label: "Carpentry",
        icon: "fa-hammer",
        requests: 15,
        trend: "down",
        change: "-3%",
        color: "#6B46C1",
        bgColor: "#F0E8FF",
        topProviders: ["Kofi Mensah", "James Wilson", "Robert Taylor"],
      },
      {
        id: "tutoring",
        label: "Tutoring",
        icon: "fa-book-open",
        requests: 12,
        trend: "up",
        change: "+15%",
        color: "#E53E3E",
        bgColor: "#FFE8E8",
        topProviders: ["Abena Darko", "Dr. Kwame", "Sarah Johnson"],
      },
      {
        id: "catering",
        label: "Catering",
        icon: "fa-utensils",
        requests: 9,
        trend: "down",
        change: "-2%",
        color: "#D69E2E",
        bgColor: "#FFF8E8",
        topProviders: ["Abena Darko", "Chef Akua", "Food Masters"],
      },
    ];

    setPopularServices(mockPopularServices);

    // Update time remaining every minute
    const updateTimeRemaining = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setPopularServices((prev) =>
        prev.map((service) => ({
          ...service,
          requests: service.requests + (Math.random() > 0.7 ? 1 : 0),
        })),
      );
    }, 10000); // Update every 10 seconds

    return () => {
      clearInterval(interval);
      clearInterval(updateInterval);
    };
  }, []);

  // Sort by requests (highest first)
  const sortedServices = [...popularServices].sort(
    (a, b) => b.requests - a.requests,
  );
  const totalRequests = popularServices.reduce(
    (sum, service) => sum + service.requests,
    0,
  );

  return (
    <section className="bg-white py-6 md:py-8 border-b border-[#E8F0FF]">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5F8FF] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-fire text-[#FF6B00] text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                Popular Services Today
                <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                {totalRequests} requests today • Updated in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <i className="fa-regular fa-clock"></i>
              <span>{timeRemaining}</span>
            </div>
            <Link
              to="/category/all"
              className="text-[#0057FF] font-medium hover:underline text-sm flex items-center gap-1"
            >
              View all
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Popular Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sortedServices.map((service, index) => (
            <Link
              key={service.id}
              to={`/category/${service.id}`}
              className="group relative bg-white border border-[#E8F0FF] rounded-2xl p-4 hover:shadow-md transition-all hover:border-[#0057FF] hover:scale-[1.02]"
              onMouseEnter={() => setIsHovered(service.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              {/* Rank Number */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#1A1A1A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>

              {/* Service Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110"
                style={{ backgroundColor: service.bgColor }}
              >
                <i
                  className={`fa-solid ${service.icon} text-lg`}
                  style={{ color: service.color }}
                ></i>
              </div>

              {/* Service Name */}
              <h3 className="text-sm font-bold text-[#1A1A1A] text-center">
                {service.label}
              </h3>

              {/* Request Count */}
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="text-sm font-bold text-[#0057FF]">
                  {service.requests}
                </span>
                <span className="text-[10px] text-gray-400">requests</span>
                {service.trend === "up" ? (
                  <i className="fa-solid fa-arrow-up text-[10px] text-[#00A86B]"></i>
                ) : (
                  <i className="fa-solid fa-arrow-down text-[10px] text-[#E53E3E]"></i>
                )}
              </div>

              {/* Change Percentage */}
              <div
                className={`text-[10px] text-center mt-0.5 ${
                  service.trend === "up" ? "text-[#00A86B]" : "text-[#E53E3E]"
                }`}
              >
                {service.change}
              </div>

              {/* Hover Tooltip - Shows top providers */}
              {isHovered === service.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1A1A1A] text-white rounded-xl p-3 shadow-xl z-20">
                  <p className="text-[10px] font-bold text-gray-400 mb-2">
                    Top Providers
                  </p>
                  {service.topProviders.slice(0, 3).map((provider, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs py-1"
                    >
                      <span className="text-gray-400">#{idx + 1}</span>
                      <span className="text-white">{provider}</span>
                    </div>
                  ))}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 
                    w-2 h-2 bg-[#1A1A1A] rotate-45"
                  ></div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Activity Bar - Shows recent activity */}
        <div className="mt-4 flex flex-wrap items-center gap-3 p-3 bg-[#F5F8FF] rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00A86B] rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-[#1A1A1A]">
              Live Activity
            </span>
          </div>
          <div className="flex-1 h-px bg-[#E8F0FF] hidden sm:block"></div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <i className="fa-regular fa-clock text-[10px]"></i>
              Just now:{" "}
              <span className="text-[#1A1A1A] font-medium">Plumbing</span>{" "}
              request
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <i className="fa-regular fa-clock text-[10px]"></i>
              2m ago:{" "}
              <span className="text-[#1A1A1A] font-medium">Cleaning</span>{" "}
              request
            </span>
            <span className="text-gray-300 hidden md:inline">•</span>
            <span className="flex items-center gap-1 hidden md:flex">
              <i className="fa-regular fa-clock text-[10px]"></i>
              5m ago:{" "}
              <span className="text-[#1A1A1A] font-medium">
                Electrical
              </span>{" "}
              request
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularServicesToday;
