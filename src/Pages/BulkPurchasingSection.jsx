// components/BulkPurchasingSection.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const BulkPurchasingSection = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sample bulk purchase categories
  const categories = [
    { id: "electronics", name: "Electronics", icon: "📱", count: 45 },
    { id: "office", name: "Office Supplies", icon: "📋", count: 32 },
    { id: "construction", name: "Construction", icon: "🏗️", count: 28 },
    { id: "food", name: "Food & Beverage", icon: "🍕", count: 56 },
    { id: "cleaning", name: "Cleaning", icon: "🧹", count: 19 },
    { id: "furniture", name: "Furniture", icon: "🪑", count: 37 },
  ];

  // Sample bulk deals
  const bulkDeals = [
    {
      id: 1,
      title: "Office Printer Paper - 10 Boxes",
      price: "₵450",
      originalPrice: "₵600",
      unitPrice: "₵45/box",
      discount: "25%",
      supplier: "OfficePro Ghana",
      minOrder: 5,
      image:
        "https://via.placeholder.com/300x200/0057FF/ffffff?text=Bulk+Paper",
    },
    {
      id: 2,
      title: "Construction Cement - 50 Bags",
      price: "₵1,750",
      originalPrice: "₵2,250",
      unitPrice: "₵35/bag",
      discount: "22%",
      supplier: "BuildMaster Ltd",
      minOrder: 20,
      image: "https://via.placeholder.com/300x200/3A9AFF/ffffff?text=Cement",
    },
    {
      id: 3,
      title: "Cleaning Supplies Bundle",
      price: "₵320",
      originalPrice: "₵450",
      unitPrice: "₵32/item",
      discount: "29%",
      supplier: "CleanCo Ghana",
      minOrder: 3,
      image: "https://via.placeholder.com/300x200/7CC4FF/ffffff?text=Cleaning",
    },
    {
      id: 4,
      title: "Bulk Food Staples Package",
      price: "₵2,100",
      originalPrice: "₵2,800",
      unitPrice: "₵42/item",
      discount: "25%",
      supplier: "AgriFood Supply",
      minOrder: 10,
      image: "https://via.placeholder.com/300x200/0057FF/ffffff?text=Food",
    },
  ];

  // Features for bulk purchasing
  const features = [
    {
      icon: "💰",
      title: "Volume Discounts",
      description: "Save up to 40% when you buy in bulk",
    },
    {
      icon: "🚚",
      title: "Free Delivery",
      description: "Free delivery on orders over ₵500",
    },
    {
      icon: "📦",
      title: "Flexible Quantities",
      description: "Mix and match products for better deals",
    },
    {
      icon: "🛡️",
      title: "Verified Suppliers",
      description: "All suppliers are vetted and trusted",
    },
  ];

  return (
    <div className="py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              Bulk Purchasing
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Save More When You{" "}
              <span className="text-brand-500">Buy in Bulk</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Get wholesale prices on high-quality products from verified
              suppliers
            </p>
          </div>
          <Link
            to="/bulk-purchases"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Browse All Deals
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
              activeTab === "featured"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            🔥 Featured
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
                activeTab === cat.id
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.icon} {cat.name}
              <span className="ml-1 text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Bulk Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bulkDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition group"
              onMouseEnter={() => setHoveredCard(deal.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                {/* Discount Badge */}
                <span className="absolute top-2 right-2 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                  -{deal.discount}
                </span>
                {hoveredCard === deal.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition">
                      Quick View
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 min-h-[40px]">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {deal.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {deal.originalPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{deal.unitPrice}</span>
                  <span>Min: {deal.minOrder} units</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {deal.supplier}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Verified
                  </span>
                </div>
                <button className="w-full mt-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition group-hover:bg-brand-50 group-hover:text-brand-600">
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-brand-500 to-blue-600 rounded-2xl text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold">
                Need a Custom Bulk Order?
              </h3>
              <p className="text-blue-100 text-sm">
                Get personalized quotes from top suppliers in your area
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white text-brand-600 font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg">
                Request Custom Quote
              </button>
              <button className="px-6 py-2.5 bg-brand-600/30 text-white font-semibold rounded-xl hover:bg-brand-600/40 transition border border-white/20">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-gray-400">
          <span>✓ 500+ Verified Suppliers</span>
          <span>•</span>
          <span>✓ 2,000+ Bulk Deals</span>
          <span>•</span>
          <span>✓ 4.9★ Average Rating</span>
          <span>•</span>
          <span>✓ 24/7 Support</span>
        </div>
      </div>
    </div>
  );
};

export default BulkPurchasingSection;
