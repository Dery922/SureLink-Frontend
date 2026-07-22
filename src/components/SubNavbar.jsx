import React, { useState, useRef, useEffect } from "react";

function SubNavbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const items = [
    { icon: "fa-magnifying-glass", label: "Services" },
    { icon: "fa-bolt", label: "Booking" },
    { icon: "fa-circle-check", label: "Verified" },
    { icon: "fa-location-dot", label: "Tracking" },
    { icon: "fa-shield-halved", label: "Payments" },
    { icon: "fa-star", label: "Top Rated" },
    { icon: "fa-headset", label: "Support" },
  ];

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Auto-scroll to center active item on mobile
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 768) {
      const container = scrollContainerRef.current;
      const activeButton = container.children[activeIndex];
      if (activeButton) {
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollTo = buttonLeft - containerWidth / 2 + buttonWidth / 2;
        container.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full bg-white border-t border-gray-200 sticky top-[72px] overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="max-w-[1100px] mx-auto px-4 h-12 flex items-center justify-between overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: isMobile ? "x mandatory" : "none",
          cursor: isMobile ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`group flex items-center gap-2 text-sm font-medium h-full px-2 border-b-2 transition-all duration-200 ${
                isMobile ? "snap-center" : ""
              } ${
                isActive
                  ? "text-[#0057FF] border-[#0057FF]"
                  : "text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200"
              }`}
              style={{ scrollSnapAlign: isMobile ? "center" : "none" }}
            >
              <i
                className={`fa-solid ${item.icon} text-[13px] group-hover:scale-105 transition-transform`}
              ></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default SubNavbar;
