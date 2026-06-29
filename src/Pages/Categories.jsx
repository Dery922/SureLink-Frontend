import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const allProviders = [
    {
        id: 1,
        name: 'Kwame Mensah',
        service: 'Plumbing',
        category: 'plumbing',
        rating: 4.8,
        reviews: 24,
        location: 'Accra, Ghana',
        price: 150,
        displayPrice: 'From GH₵ 150',
        cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    {
        id: 2,
        name: 'Ama Owusu',
        service: 'Cleaning',
        category: 'cleaning',
        rating: 4.9,
        reviews: 36,
        location: 'Accra, Ghana',
        price: 100,
        displayPrice: 'From GH₵ 100',
        cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    },
    {
        id: 3,
        name: 'Kofi Asante',
        service: 'Electrical',
        category: 'electrical',
        rating: 4.7,
        reviews: 18,
        location: 'Accra, Ghana',
        price: 200,
        displayPrice: 'From GH₵ 200',
        cover: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
    {
        id: 4,
        name: 'Abena Darko',
        service: 'Catering',
        category: 'catering',
        rating: 4.9,
        reviews: 42,
        location: 'Accra, Ghana',
        price: 300,
        displayPrice: 'From GH₵ 300',
        cover: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    },
    {
        id: 5,
        name: 'Yaw Boateng',
        service: 'Carpentry',
        category: 'carpentry',
        rating: 4.6,
        reviews: 15,
        location: 'Accra, Ghana',
        price: 250,
        displayPrice: 'From GH₵ 250',
        cover: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    },
    {
        id: 6,
        name: 'Akosua Asante',
        service: 'Beauty',
        category: 'beauty',
        rating: 4.9,
        reviews: 58,
        location: 'Accra, Ghana',
        price: 80,
        displayPrice: 'From GH₵ 80',
        cover: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    },
    {
        id: 7,
        name: 'Kwesi Agyeman',
        service: 'Tutoring',
        category: 'tutoring',
        rating: 4.8,
        reviews: 30,
        location: 'Accra, Ghana',
        price: 120,
        displayPrice: 'From GH₵ 120',
        cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    },
    {
        id: 8,
        name: 'Efua Mensah',
        service: 'Plumbing',
        category: 'plumbing',
        rating: 4.7,
        reviews: 20,
        location: 'Accra, Ghana',
        price: 180,
        displayPrice: 'From GH₵ 180',
        cover: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
]

// Get unique categories for the dropdown
const getUniqueCategories = () => {
    const categories = allProviders.map(p => p.category)
    return ['all', ...new Set(categories)]
}

const categoryOptions = getUniqueCategories()

// Category display names
const categoryDisplayNames = {
    'all': 'All Categories',
    'plumbing': 'Plumbing',
    'cleaning': 'Cleaning',
    'electrical': 'Electrical',
    'catering': 'Catering',
    'carpentry': 'Carpentry',
    'beauty': 'Beauty',
    'tutoring': 'Tutoring',
}

// Sort options
const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Most Reviews', value: 'most-reviews' },
]

function CategoryResults() {
    const { id } = useParams()
    const [activeFilter, setActiveFilter] = useState('recommended')
    const [selectedCategory, setSelectedCategory] = useState(id || 'all')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const sortDropdownRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Filter providers by category
    const byCategory = selectedCategory === 'all'
        ? allProviders
        : allProviders.filter(p => p.category === selectedCategory)

    // Sort providers
    const sortedProviders = [...byCategory].sort((a, b) => {
        if (activeFilter === 'top-rated') return b.rating - a.rating
        if (activeFilter === 'price-low') return a.price - b.price
        if (activeFilter === 'price-high') return b.price - a.price
        if (activeFilter === 'most-reviews') return b.reviews - a.reviews
        return 0 // recommended (default)
    })

    const categoryName = categoryDisplayNames[selectedCategory] || 'All Categories'
    const currentSortLabel = sortOptions.find(opt => opt.value === activeFilter)?.label || 'Recommended'

    // Handle category change
    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        setIsDropdownOpen(false)
        // You can add navigation here if needed
        // navigate(`/category/${category}`)
    }

    return (
        <div className="bg-[#F8FAFB] min-h-screen">
            <Navbar />

            <div className="pt-[72px]">

                {/* Page header with enhanced design */}
                <div className="bg-gradient-to-r from-[#0057FF]/5 to-[#0057FF]/10 py-8 md:py-12 border-b border-[#E8F0FF]">
                    <div className="max-w-[1280px] mx-auto px-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                                    {categoryName}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {sortedProviders.length} {sortedProviders.length === 1 ? 'provider' : 'providers'} found
                                </p>
                            </div>
                            
                            {/* Category Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen)
                                        setIsSortDropdownOpen(false)
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E8F0FF] rounded-xl hover:border-[#0057FF] transition-all shadow-sm min-w-[200px] justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-filter text-[#0057FF] text-sm"></i>
                                        <span className="text-sm font-medium text-gray-700">
                                            {categoryDisplayNames[selectedCategory] || 'All Categories'}
                                        </span>
                                    </div>
                                    <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-full min-w-[220px] bg-white border border-[#E8F0FF] rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                                        {categoryOptions.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategorySelect(category)}
                                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F5F8FF] transition-colors flex items-center gap-2 ${
                                                    selectedCategory === category ? 'bg-[#F5F8FF] text-[#0057FF] font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                {selectedCategory === category && (
                                                    <i className="fa-solid fa-check text-[#0057FF] text-xs"></i>
                                                )}
                                                <span className={selectedCategory === category ? 'ml-0' : 'ml-5'}>
                                                    {categoryDisplayNames[category] || category}
                                                </span>
                                                <span className="ml-auto text-xs text-gray-400">
                                                    {category === 'all' 
                                                        ? allProviders.length 
                                                        : allProviders.filter(p => p.category === category).length}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced filter bar with sort dropdown */}
                <div className="border-b border-gray-100 bg-white sticky top-[72px] z-40 shadow-sm">
                    <div className="max-w-[1280px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">SORT BY:</span>
                            
                            {/* Sort Dropdown */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => {
                                        setIsSortDropdownOpen(!isSortDropdownOpen)
                                        setIsDropdownOpen(false)
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F5F8FF] rounded-lg hover:bg-[#E8F0FF] transition-colors whitespace-nowrap"
                                >
                                    <i className="fa-solid fa-arrow-up-wide-short text-[#0057FF] text-xs"></i>
                                    <span className="text-sm font-medium text-gray-700">
                                        {currentSortLabel}
                                    </span>
                                    <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                {/* Sort dropdown menu */}
                                {isSortDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-[#E8F0FF] rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setActiveFilter(option.value)
                                                    setIsSortDropdownOpen(false)
                                                }}
                                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F5F8FF] transition-colors flex items-center gap-2 ${
                                                    activeFilter === option.value ? 'bg-[#F5F8FF] text-[#0057FF] font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                {activeFilter === option.value && (
                                                    <i className="fa-solid fa-check text-[#0057FF] text-xs"></i>
                                                )}
                                                <span className={activeFilter === option.value ? 'ml-0' : 'ml-5'}>
                                                    {option.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                            Showing {sortedProviders.length} results
                        </div>
                    </div>
                </div>

                {/* Results grid with enhanced cards */}
                <div className="max-w-[1280px] mx-auto px-5 py-8 md:py-10">
                    {sortedProviders.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-[#F5F8FF] rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-search text-3xl text-[#0057FF]/30"></i>
                            </div>
                            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No Providers Found</h3>
                            <p className="text-sm text-gray-400">Try selecting a different category or clear your filters</p>
                            <button 
                                onClick={() => setSelectedCategory('all')}
                                className="mt-4 text-[#0057FF] text-sm font-medium hover:underline"
                            >
                                View all providers →
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedProviders.map((provider) => (
                                <Link
                                    key={provider.id}
                                    to={`/provider/${provider.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-[#E8F0FF] shadow-sm hover:shadow-xl hover:border-[#0057FF] transition-all duration-300 cursor-pointer hover:-translate-y-1"
                                >
                                    {/* Cover photo with overlay */}
                                    <div className="relative h-[200px] overflow-hidden">
                                        <img
                                            src={provider.cover}
                                            alt={provider.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                        
                                        {/* Category badge */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#0057FF] shadow-lg">
                                            {provider.service}
                                        </div>
                                        
                                        {/* Rating badge */}
                                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1.5">
                                            <i className="fa-solid fa-star text-[#FF6B00] text-xs"></i>
                                            <span>{provider.rating}</span>
                                            <span className="text-white/60">({provider.reviews})</span>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-4 pt-5 relative">
                                        {/* Avatar */}
                                        <div className="absolute -top-8 left-4">
                                            <img
                                                src={provider.avatar}
                                                alt={provider.name}
                                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        </div>

                                        {/* Name and service */}
                                        <div className="mt-2">
                                            <h3 className="font-bold text-base text-[#1A1A1A] group-hover:text-[#0057FF] transition-colors line-clamp-1">
                                                {provider.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 mb-2">{provider.service}</p>
                                        </div>

                                        {/* Price */}
                                        <p className="text-sm font-bold text-[#0057FF] mb-2">
                                            {provider.displayPrice}
                                        </p>

                                        {/* Location */}
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                                            <span className="text-xs text-gray-400 line-clamp-1">{provider.location}</span>
                                        </div>

                                        {/* Book Now button */}
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault()
                                                // Handle booking navigation
                                                window.location.href = `/booking/${provider.id}`
                                            }}
                                            className="w-full bg-[#0057FF] text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg shadow-[#0057FF]/20"
                                        >
                                            Book Now
                                            <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    {sortedProviders.length > 0 && (
                        <div className="flex items-center justify-center gap-2 mt-10 md:mt-12">
                            <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-[#F5F8FF] transition-all flex items-center justify-center">
                                <i className="fa-solid fa-chevron-left text-xs"></i>
                            </button>
                            {[1, 2, 3, 4, 5].map((page) => (
                                <button
                                    key={page}
                                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                                        page === 1
                                            ? 'bg-[#0057FF] text-white shadow-lg shadow-[#0057FF]/25'
                                            : 'border border-gray-200 text-gray-500 hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-[#F5F8FF]'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-[#F5F8FF] transition-all flex items-center justify-center">
                                <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    )
}

export default CategoryResults