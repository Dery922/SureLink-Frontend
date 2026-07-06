// components/SearchSection.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Sample search tags - you can replace with your actual data
const POPULAR_SERVICES = [
  { id: "plumbing", label: "Plumbing", icon: "fa-wrench" },
  { id: "electrical", label: "Electrical", icon: "fa-bolt" },
  { id: "carpentry", label: "Carpentry", icon: "fa-hammer" },
  { id: "painting", label: "Painting", icon: "fa-paint-roller" },
  { id: "cleaning", label: "Cleaning", icon: "fa-broom" },
  { id: "hvac", label: "HVAC", icon: "fa-snowflake" },
  { id: "landscaping", label: "Landscaping", icon: "fa-tree" },
  { id: "roofing", label: "Roofing", icon: "fa-house" },
  { id: "tiling", label: "Tiling", icon: "fa-square" },
  { id: "welding", label: "Welding", icon: "fa-fire" },
];

const RECENT_SEARCHES = [
  "Plumber in Accra",
  "Electrician near me",
  "House cleaning service",
  "Painting services",
  "AC repair",
];

const SearchSection = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("services"); // services | recent
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = POPULAR_SERVICES.filter((service) =>
        service.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setActiveTab("services");
    } else {
      setFilteredSuggestions([]);
      setActiveTab(selectedTags.length > 0 ? "services" : "recent");
    }
  }, [searchQuery]);

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag.id)) {
      setSelectedTags(selectedTags.filter((id) => id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag.id]);
      // Add to recent searches
      const newRecent = [
        `${tag.label} services`,
        ...RECENT_SEARCHES.slice(0, 4),
      ];
      setRecentSearches(newRecent);
    }
  };

  const handleSearch = useCallback(() => {
    const searchTerms = selectedTags
      .map((id) => POPULAR_SERVICES.find((s) => s.id === id)?.label)
      .filter(Boolean);

    const query = searchQuery.trim() || searchTerms.join(", ");

    if (query) {
      // Add to recent searches
      if (!RECENT_SEARCHES.includes(query)) {
        setRecentSearches([query, ...RECENT_SEARCHES.slice(0, 4)]);
      }

      onSearch?.(query, selectedTags);
      onClose();
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [searchQuery, selectedTags, onSearch, onClose, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedTags([]);
    inputRef.current?.focus();
  };

  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (!e.target.closest(".search-trigger")) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div
        ref={searchRef}
        className="fixed top-[72px] left-0 right-0 z-50 mx-auto max-w-[800px] px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
          {/* Search Input Area */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {/* Search Icon */}
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-lg"></i>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What service do you need?"
                className="flex-1 bg-transparent outline-none text-base text-gray-800 placeholder-gray-400"
              />

              {/* Clear Button */}
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              )}
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTags.map((tagId) => {
                  const tag = POPULAR_SERVICES.find((s) => s.id === tagId);
                  return (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0057FF] text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      <i className={`fa-solid ${tag?.icon} text-[10px]`}></i>
                      {tag?.label}
                      <button
                        onClick={() => removeTag(tagId)}
                        className="ml-0.5 hover:text-blue-700 transition-colors"
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dropdown Content */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-100 mb-4">
              <button
                onClick={() => setActiveTab("services")}
                className={`pb-2 text-sm font-medium transition-colors relative ${
                  activeTab === "services"
                    ? "text-[#0057FF] border-b-2 border-[#0057FF]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`pb-2 text-sm font-medium transition-colors relative ${
                  activeTab === "recent"
                    ? "text-[#0057FF] border-b-2 border-[#0057FF]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent
              </button>
            </div>

            {/* Services Tab */}
            {activeTab === "services" && (
              <div>
                {/* Popular Services */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Popular Services
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(filteredSuggestions.length > 0
                      ? filteredSuggestions
                      : POPULAR_SERVICES
                    ).map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleTagClick(service)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          selectedTags.includes(service.id)
                            ? "bg-blue-50 text-[#0057FF] border-2 border-[#0057FF]"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <i className={`fa-solid ${service.icon} text-sm`}></i>
                        {service.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSearch}
                    className="w-full bg-[#0057FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-search"></i>
                    Search Services
                  </button>
                </div>
              </div>
            )}

            {/* Recent Tab */}
            {activeTab === "recent" && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <i className="fa-solid fa-clock-rotate-left text-gray-400 text-xs"></i>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>
              <i className="fa-regular fa-keyboard mr-1"></i>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">
                Enter
              </kbd>{" "}
              to search
            </span>
            <span>
              <i className="fa-regular fa-circle-xmark mr-1"></i>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">
                Esc
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>

      {/* Styles for animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default SearchSection;
