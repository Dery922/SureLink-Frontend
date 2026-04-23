import { useState } from 'react'
import { useParams } from 'react-router-dom'
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

const filters = [
    { label: 'All', value: 'all' },
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Most Reviews', value: 'most-reviews' },
]

function CategoryResults() {
    const { id } = useParams()
    const [activeFilter, setActiveFilter] = useState('all')

    const byCategory = id === 'all'
        ? allProviders
        : allProviders.filter(p => p.category === id)

    const displayProviders = byCategory.length > 0 ? byCategory : allProviders

    const sortedProviders = [...displayProviders].sort((a, b) => {
        if (activeFilter === 'top-rated') return b.rating - a.rating
        if (activeFilter === 'price-low') return a.price - b.price
        if (activeFilter === 'price-high') return b.price - a.price
        if (activeFilter === 'most-reviews') return b.reviews - a.reviews
        return 0
    })

    const categoryName = id
        ? id.charAt(0).toUpperCase() + id.slice(1)
        : 'All'

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="pt-[72px]">

                {/* Page header */}
                <div className="bg-[#F5F8FF] py-8 md:py-10">
                    <div className="max-w-[1280px] mx-auto px-5">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-1">{categoryName} Services</h1>
                        <p className="text-sm text-gray-500">{sortedProviders.length} providers found</p>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="border-b border-gray-100 bg-white sticky top-[72px] z-40">
                    <div className="max-w-[1280px] mx-auto px-5 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeFilter === filter.value
                                        ? 'bg-[#0057FF] text-white border-[#0057FF]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#0057FF] hover:text-[#0057FF]'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results grid */}
                <div className="max-w-[1280px] mx-auto px-5 py-8 md:py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProviders.map((provider) => (
                            <div
                                key={provider.id}
                                className="bg-white rounded-2xl overflow-hidden border border-[#E8F0FF] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                {/* Cover photo */}
                                <div className="relative h-[180px]">
                                    <img
                                        src={provider.cover}
                                        alt={provider.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-20"></div>
                                </div>

                                {/* Card body */}
                                <div className="p-4 pt-6 relative">
                                    {/* Avatar */}
                                    <img
                                        src={provider.avatar}
                                        alt={provider.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white absolute -top-6 left-4"
                                    />

                                    {/* Name and service */}
                                    <h3 className="font-bold text-[15px] text-[#1A1A1A] mt-2">{provider.name}</h3>
                                    <p className="text-sm text-gray-500 mb-1">{provider.service}</p>

                                    {/* Price */}
                                    <p className="text-sm font-bold text-[#0057FF] mb-2">{provider.displayPrice}</p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-solid fa-star text-xs ${i < Math.floor(provider.rating) ? 'text-[#FF6B00]' : 'text-gray-200'}`}
                                            ></i>
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">({provider.reviews} reviews)</span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-1 mb-4">
                                        <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                                        <span className="text-xs text-gray-400">{provider.location}</span>
                                    </div>

                                    {/* Book Now button */}
                                    <button className="w-full bg-[#0057FF] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-10 md:mt-12">
                        <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors flex items-center justify-center">
                            <i className="fa-solid fa-chevron-left text-xs"></i>
                        </button>
                        {[1, 2, 3, 4, 5].map((page) => (
                            <button
                                key={page}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === 1
                                        ? 'bg-[#0057FF] text-white'
                                        : 'border border-gray-200 text-gray-500 hover:border-[#0057FF] hover:text-[#0057FF]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors flex items-center justify-center">
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default CategoryResults