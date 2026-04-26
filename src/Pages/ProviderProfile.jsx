import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const providers = [
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
        cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        about: 'Experienced plumber with over 10 years of service in Accra. Specialises in pipe repairs, installations and drainage systems. Available 7 days a week.',
        services: [
            { name: 'Pipe Repair', price: 'GH₵ 150', duration: '1 - 2 hours' },
            { name: 'Installation', price: 'GH₵ 200', duration: '2 - 3 hours' },
            { name: 'Drainage', price: 'GH₵ 120', duration: '1 - 3 hours' },
        ],
        reviewList: [
            { name: 'Abena Darko', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', rating: 5, comment: 'Very professional and punctual. Fixed our pipes quickly. Highly recommend.' },
            { name: 'Kofi Asante', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', rating: 4, comment: 'Great work done at a fair price. Would use again.' },
            { name: 'Ama Owusu', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80', rating: 5, comment: 'Showed up on time and did an excellent job. Very satisfied.' },
        ],
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
        cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80',
        about: 'Professional cleaner with 5 years of experience. Offers deep cleaning, regular cleaning and post-construction cleaning services across Accra.',
        services: [
            { name: 'Regular Cleaning', price: 'GH₵ 100', duration: '2 - 3 hours' },
            { name: 'Deep Cleaning', price: 'GH₵ 200', duration: '4 - 6 hours' },
            { name: 'Post-Construction', price: 'GH₵ 350', duration: '6 - 8 hours' },
        ],
        reviewList: [
            { name: 'Kwame Mensah', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', rating: 5, comment: 'Absolutely spotless. Ama does an incredible job every time.' },
            { name: 'Abena Darko', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', rating: 5, comment: 'Very thorough and professional. My house has never looked better.' },
        ],
    },
]

function ProviderProfile() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('about')

    const provider = providers.find(p => p.id === parseInt(id)) || providers[0]

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="pt-[72px]">

                {/* Cover photo */}
                <div className="relative w-full h-[200px] md:h-[280px]">
                    <img
                        src={provider.cover}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                </div>

                {/* Profile header */}
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-gray-100">

                        {/* Avatar */}
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                            <img
                                src={provider.avatar}
                                alt={provider.name}
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-md -mt-10 md:-mt-12"
                            />
                            <div className="pb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">{provider.name}</h1>
                                <p className="text-gray-500 text-base">{provider.service}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-solid fa-star text-xs ${i < Math.floor(provider.rating) ? 'text-[#FF6B00]' : 'text-gray-200'}`}
                                            ></i>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{provider.rating} ({provider.reviews} reviews)</span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-1 mt-1">
                                    <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                                    <span className="text-sm text-gray-400">{provider.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 pb-2">
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-[#0057FF] text-[#0057FF] font-bold text-sm rounded-lg hover:bg-[#F5F8FF] transition-colors">
                                <i className="fa-solid fa-comment"></i>
                                <span>Message</span>
                            </button>
                            <Link
                                to={`/booking/${provider.id}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#0057FF] text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <i className="fa-solid fa-calendar-check"></i>
                                <span>Book Now</span>
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-0 border-b border-gray-100 mt-2">
                        {['about', 'services', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 ${activeTab === tab
                                        ? 'border-[#0057FF] text-[#0057FF]'
                                        : 'border-transparent text-gray-500 hover:text-[#0057FF]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="py-8 max-w-[800px]">

                        {/* About tab */}
                        {activeTab === 'about' && (
                            <div>
                                <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">About</h2>
                                <p className="text-gray-500 text-sm leading-relaxed">{provider.about}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    <div className="bg-[#F5F8FF] rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-bold text-[#0057FF]">{provider.reviews}</p>
                                        <p className="text-xs text-gray-500 mt-1">Total Reviews</p>
                                    </div>
                                    <div className="bg-[#F5F8FF] rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-bold text-[#0057FF]">{provider.rating}</p>
                                        <p className="text-xs text-gray-500 mt-1">Average Rating</p>
                                    </div>
                                    <div className="bg-[#F5F8FF] rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-bold text-[#0057FF]">3+</p>
                                        <p className="text-xs text-gray-500 mt-1">Years Experience</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services tab */}
                        {activeTab === 'services' && (
                            <div>
                                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Services Offered</h2>
                                <div className="flex flex-col gap-4">
                                    {provider.services.map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-[#E8F0FF] rounded-2xl hover:border-[#0057FF] transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#E8F0FF] rounded-xl flex items-center justify-center shrink-0">
                                                    <i className="fa-solid fa-wrench text-[#0057FF]"></i>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#1A1A1A] text-sm">{service.name}</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        <i className="fa-solid fa-clock mr-1"></i>
                                                        {service.duration}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#0057FF] text-sm">{service.price}</p>
                                                <Link
                                                    to={`/booking/${provider.id}`}
                                                    className="text-xs text-gray-400 hover:text-[#0057FF] transition-colors"
                                                >
                                                    Book →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Reviews</h2>
                                <div className="flex flex-col gap-4">
                                    {provider.reviewList.map((review, index) => (
                                        <div key={index} className="p-4 border border-[#E8F0FF] rounded-2xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <img
                                                    src={review.avatar}
                                                    alt={review.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-bold text-sm text-[#1A1A1A]">{review.name}</p>
                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i
                                                                key={i}
                                                                className={`fa-solid fa-star text-xs ${i < review.rating ? 'text-[#FF6B00]' : 'text-gray-200'}`}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default ProviderProfile