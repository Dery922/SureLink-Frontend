import React, { useState } from 'react';

function SubNavbar() {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { icon: 'fa-magnifying-glass', label: 'Services' },
        { icon: 'fa-bolt', label: 'Booking' },
        { icon: 'fa-circle-check', label: 'Verified' },
        { icon: 'fa-location-dot', label: 'Tracking' },
        { icon: 'fa-shield-halved', label: 'Payments' },
        { icon: 'fa-star', label: 'Top Rated' },
        { icon: 'fa-headset', label: 'Support' },
    ];

    return (
       <div className="w-full bg-white border-t border-gray-200 sticky top-[72px] z-40">
            {/* max-w constraint ensures it doesn't stretch awkwardly on ultrawide screens */}
            <div className="max-w-[1100px] mx-auto px-4 h-12 flex items-center justify-between">
                {items.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`group flex items-center gap-2 text-sm font-medium h-full px-2 border-b-2 transition-all duration-200 ${isActive
                                    ? 'text-[#0057FF] border-[#0057FF]'
                                    : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200'
                                }`}
                        >
                            {/* Icon scales slightly on hover to feel more interactive */}
                            <i className={`fa-solid ${item.icon} text-[13px] group-hover:scale-105 transition-transform`}></i>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default SubNavbar;