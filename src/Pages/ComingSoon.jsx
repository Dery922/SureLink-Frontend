import { useState } from "react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeService, setActiveService] = useState("delivery");

  // Service data
  const services = {
    delivery: {
      id: "delivery",
      icon: "fa-truck-fast",
      title: "Delivery & Errands",
      subtitle: "Send packages across Accra",
      color: "#0057FF",
      bgColor: "#F0F5FF",
      features: [
        "Same-day delivery within Accra",
        "Real-time package tracking",
        "Professional delivery personnel",
        "Insurance up to GHS 5,000",
        "Business & personal deliveries",
        "Scheduled pickups available",
      ],
      emoji: "🚚",
      waitlistCount: "247",
      estimatedLaunch: "August 2026",
    },
    groupBuying: {
      id: "groupBuying",
      icon: "fa-people-arrows",
      title: "Group Buying",
      subtitle: "Save money through bulk purchases",
      color: "#FF6B00",
      bgColor: "#FFF5F0",
      features: [
        "Bulk discounts up to 40%",
        "Connect with neighbors & friends",
        "Verified quality products",
        "Flexible payment options",
        "Community-driven savings",
        "Minimum order GHS 100",
      ],
      emoji: "🛒",
      waitlistCount: "183",
      estimatedLaunch: "September 2026",
    },
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-4 py-1.5 rounded-full">
              🚀 Coming Soon
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-[#1A1A1A] mb-3">
            New Services on the Horizon
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We're expanding to make your life even easier. Be the first to know
            when we launch!
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
          {Object.entries(services).map(([key, service]) => (
            <div
              key={key}
              className="relative group bg-white rounded-3xl border-2 border-[#E8F0FF] p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:border-transparent overflow-hidden"
              style={{
                boxShadow:
                  activeService === key
                    ? `0 8px 30px ${service.color}20`
                    : "none",
              }}
              onMouseEnter={() => setActiveService(key)}
            >
              {/* Background gradient effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at top right, ${service.color}08, transparent 70%)`,
                }}
              ></div>

              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 bg-[#FF6B00] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                Coming Soon
              </div>

              <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: service.bgColor }}
                  >
                    <i
                      className={`fa-solid ${service.icon}`}
                      style={{ color: service.color }}
                    ></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      {service.emoji} {service.title}
                    </h3>
                    <p className="text-sm text-gray-500">{service.subtitle}</p>
                  </div>
                </div>

                {/* Feature List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {service.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <i
                        className="fa-solid fa-check text-xs"
                        style={{ color: service.color }}
                      ></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8F0FF]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <i className="fa-regular fa-users text-gray-400 text-sm"></i>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {service.waitlistCount}
                      </span>
                      <span className="text-xs text-gray-400">waiting</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className="fa-regular fa-calendar text-gray-400 text-sm"></i>
                      <span className="text-xs text-gray-500">
                        {service.estimatedLaunch}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(key)}
                    className="text-sm font-medium hover:underline transition-all"
                    style={{ color: service.color }}
                  >
                    Get notified →
                  </button>
                </div>

                {/* Interactive hover effect - progress bar */}
                <div className="mt-4 w-full bg-[#F5F8FF] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-1000"
                    style={{
                      width: activeService === key ? "75%" : "30%",
                      backgroundColor: service.color,
                      opacity: activeService === key ? 1 : 0.3,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action - Email Signup */}
        <div className="bg-gradient-to-r from-[#0057FF] to-[#6B46C1] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🎯</span>
              <span className="text-sm font-bold uppercase tracking-wider bg-white/20 px-4 py-1 rounded-full">
                Be the First to Know
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Get Early Access When We Launch
            </h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Join our waitlist and get exclusive launch discounts and early
              access benefits.
            </p>

            {isSubscribed ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto animate-bounce-in">
                <i className="fa-regular fa-circle-check text-2xl mr-2"></i>
                <span className="font-medium">You're on the list! 🎉</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="bg-white text-[#0057FF] font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Notify Me
                </button>
              </form>
            )}

            <p className="text-white/60 text-xs mt-4">
              No spam, unsubscribe anytime. Join{" "}
              {selectedService
                ? services[selectedService].waitlistCount
                : "430+"}{" "}
              others.
            </p>
          </div>
        </div>

        {/* Why these services? */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F5F8FF] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[#0057FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-bolt text-[#0057FF]"></i>
            </div>
            <h4 className="font-bold text-[#1A1A1A] mb-1">Fast & Reliable</h4>
            <p className="text-sm text-gray-500">
              Professional delivery services you can trust
            </p>
          </div>
          <div className="bg-[#FFF5F0] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-coins text-[#FF6B00]"></i>
            </div>
            <h4 className="font-bold text-[#1A1A1A] mb-1">Save Money</h4>
            <p className="text-sm text-gray-500">
              Group buying discounts up to 40%
            </p>
          </div>
          <div className="bg-[#F0FFF5] rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[#00A86B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-handshake text-[#00A86B]"></i>
            </div>
            <h4 className="font-bold text-[#1A1A1A] mb-1">Community First</h4>
            <p className="text-sm text-gray-500">
              Powered by trusted local networks
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: services[selectedService].bgColor }}
              >
                <span className="text-4xl">
                  {services[selectedService].emoji}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                {services[selectedService].title}
              </h3>
              <p className="text-gray-500 mb-6">
                Get notified when{" "}
                {services[selectedService].title.toLowerCase()} launches in your
                area.
              </p>

              {isSubscribed ? (
                <div className="bg-[#00A86B]/10 text-[#00A86B] rounded-xl p-4">
                  <i className="fa-regular fa-circle-check mr-2"></i>
                  You're subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-3 border border-[#E8F0FF] rounded-lg focus:outline-none focus:border-[#0057FF]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#0057FF] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fa-regular fa-bell mr-2"></i>
                    Notify Me When Live
                  </button>
                </form>
              )}

              <button
                onClick={() => setSelectedService(null)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ComingSoon;
