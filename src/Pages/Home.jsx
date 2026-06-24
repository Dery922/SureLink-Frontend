import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsentEnhanced from "../components/CookieConsent";
import TrustMatrix from "../components/TrustMatrix";
import ComingSoon from "./ComingSoon";
import PopularServicesToday from "../components/PopulaServices";

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

const providers = [
  {
    id: 1,
    name: "Kwame Mensah",
    service: "Plumbing",
    rating: 4.8,
    reviews: 24,
    location: "Accra, Ghana",
    cover:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: 2,
    name: "Ama Owusu",
    service: "Cleaning",
    rating: 4.9,
    reviews: 36,
    location: "Accra, Ghana",
    cover:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80",
  },
  {
    id: 3,
    name: "Kofi Asante",
    service: "Electrical",
    rating: 4.7,
    reviews: 18,
    location: "Accra, Ghana",
    cover:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&q=80",
  },
  {
    id: 4,
    name: "Abena Darko",
    service: "Catering",
    rating: 4.9,
    reviews: 42,
    location: "Accra, Ghana",
    cover:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
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
  const handleProviderClick = (providerId) => {
    window.location.href = `/provider/${providerId}`;
  };
  const handleViewProfile = (providerId) => {
    window.location.href = `/provider/${providerId}`;
  };
  const handleBookNow = () => {};
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#F5F8FF] pt-[72px]">
        <div className="max-w-[1280px] mx-auto px-5 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 max-w-full md:max-w-[560px] text-center md:text-left">
            <h1 className="text-4xl md:text-[56px] font-bold text-[#1A1A1A] leading-tight mb-4">
              Find trusted services near you
            </h1>
            <p className="text-base md:text-lg text-gray-500 mb-8">
              Connect with local providers in Accra, instantly.
            </p>
            <a
              href="#categories"
              className="inline-block bg-[#0057FF] text-white font-bold text-base px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Services
            </a>
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

      {/* Category Section - 2 columns on phone */}
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

      {/* <PopularServicesToday /> */}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8F0FF] shadow-sm hover:shadow-md transition-shadow group relative"
              >
                <div className="relative h-[160px]">
                  <img
                    src={provider.cover}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-20"></div>

                  {/* Quick view badge on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProviderClick(provider.id);
                      }}
                      className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-white transition shadow-sm"
                    >
                      <i className="fa-regular fa-eye mr-1"></i>
                      Quick View
                    </button>
                  </div>

                  {/* Verified Badge - Top Left */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-[#00A86B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <i className="fa-solid fa-circle-check text-[10px]"></i>
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Response Time Badge - Bottom Right */}
                  <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <i className="fa-regular fa-clock text-[#0057FF] text-[10px]"></i>
                    <span className="text-[#1A1A1A]">Responds in 5 mins</span>
                  </div>
                </div>

                <div className="p-4 pt-6 relative">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white absolute -top-6 left-4"
                  />

                  <div className="flex items-start justify-between mt-2">
                    <div>
                      <h3 className="font-bold text-[15px] text-[#1A1A1A]">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {provider.service}
                      </p>
                    </div>
                    {/* Jobs Completed Badge */}
                    <div className="bg-[#F5F8FF] px-2.5 py-1 rounded-lg text-center flex-shrink-0">
                      <p className="text-[10px] font-bold text-[#0057FF]">
                        {provider.jobsCompleted || 147}
                      </p>
                      <p className="text-[8px] text-gray-400 leading-none">
                        Jobs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star text-xs ${i < Math.floor(provider.rating) ? "text-[#FF6B00]" : "text-gray-200"}`}
                      ></i>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      ({provider.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                    <span className="text-xs text-gray-400">
                      {provider.location}
                    </span>
                  </div>

                  {/* Trust Metrics Row */}
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
                        {provider.jobsCompleted || 147} jobs
                      </span>
                    </div>
                    <div className="w-px h-4 bg-[#E8F0FF]"></div>
                    <div className="flex items-center gap-1.5">
                      <i className="fa-regular fa-clock text-[#FF6B00] text-[10px]"></i>
                      <span className="text-[10px] text-gray-600">~5 min</span>
                    </div>
                  </div>

                  {/* Split action buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(provider.id);
                      }}
                      className="col-span-2 bg-[#0057FF] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(provider.id);
                      }}
                      className="col-span-1 bg-gray-50 text-[#0057FF] font-medium text-sm py-2.5 rounded-lg hover:bg-gray-100 transition-colors border border-[#E8F0FF] flex items-center justify-center gap-1"
                    >
                      <i className="fa-regular fa-user text-xs"></i>
                      <span className="hidden sm:inline">Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ComingSoon />
      <TrustMatrix />
      {/* How it Works Section */}
      {/* How It Works Section - Redesigned */}
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
            {/* Connecting line - hidden on mobile */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-[#E8F0FF] -translate-y-1/2"></div>

            {[
              {
                step: 1,
                icon: "fa-shield-check",
                title: "Find a verified provider",
                description:
                  "Browse trusted professionals in Ghana who are ID-verified, reviewed, and ready to help.",
                highlights: [
                  "ID & background verified",
                  "Real customer reviews",
                  "Quick response times",
                ],
                color: "#0057FF",
                bgColor: "#F5F8FF",
              },
              {
                step: 2,
                icon: "fa-comment-dots",
                title: "Chat or request service",
                description:
                  "Send a message, describe your needs, and get a free quote. No commitment required.",
                highlights: [
                  "Free quotes instantly",
                  "No hidden fees",
                  "Cancel anytime",
                ],
                color: "#FF6B00",
                bgColor: "#FFF5F0",
              },
              {
                step: 3,
                icon: "fa-lock",
                title: "Pay securely & review",
                description:
                  "Pay safely through our platform and share your experience to help the community.",
                highlights: [
                  "Secure payment",
                  "Your money is protected",
                  "Build community trust",
                ],
                color: "#00A86B",
                bgColor: "#F0FFF5",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative bg-white border border-[#E8F0FF] rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#1A1A1A] text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </div>

                {/* Icon with animated background */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: step.bgColor }}
                  >
                    <i
                      className={`fa-solid ${step.icon}`}
                      style={{ color: step.color }}
                    ></i>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: step.bgColor, color: step.color }}
                  >
                    Step {step.step}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5">
                  {step.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <i
                        className="fa-solid fa-circle-check text-[10px]"
                        style={{ color: step.color }}
                      ></i>
                      <span className="text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative gradient line at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: step.color }}
                ></div>
              </div>
            ))}
          </div>

          {/* Trust Badge - Additional social proof */}
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

          {/* CTA */}
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
    </div>
  );
}

export default Home;
