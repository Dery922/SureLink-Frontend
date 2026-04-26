import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const categories = [
    { icon: 'fa-wrench', label: 'Plumbing', id: 'plumbing' },
    { icon: 'fa-broom', label: 'Cleaning', id: 'cleaning' },
    { icon: 'fa-book-open', label: 'Tutoring', id: 'tutoring' },
    { icon: 'fa-bolt', label: 'Electrical', id: 'electrical' },
    { icon: 'fa-hammer', label: 'Carpentry', id: 'carpentry' },
    { icon: 'fa-utensils', label: 'Catering', id: 'catering' },
    { icon: 'fa-scissors', label: 'Beauty', id: 'beauty' },
    { icon: 'fa-ellipsis', label: 'More', id: 'all' },
]

const providers = [
    {
        id: 1,
        name: 'Kwame Mensah',
        service: 'Plumbing',
        rating: 4.8,
        reviews: 24,
        location: 'Accra, Ghana',
        cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    {
        id: 2,
        name: 'Ama Owusu',
        service: 'Cleaning',
        rating: 4.9,
        reviews: 36,
        location: 'Accra, Ghana',
        cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80',
    },
    {
        id: 3,
        name: 'Kofi Asante',
        service: 'Electrical',
        rating: 4.7,
        reviews: 18,
        location: 'Accra, Ghana',
        cover: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&q=80',
    },
    {
        id: 4,
        name: 'Abena Darko',
        service: 'Catering',
        rating: 4.9,
        reviews: 42,
        location: 'Accra, Ghana',
        cover: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    },
]

const steps = [
    {
        icon: 'fa-magnifying-glass',
        title: 'Search',
        description: 'Find the right service provider in your area quickly and easily.',
    },
    {
        icon: 'fa-calendar-check',
        title: 'Book',
        description: 'Schedule a time that works for you and confirm your booking instantly.',
    },
    {
        icon: 'fa-circle-check',
        title: 'Get it done',
        description: 'Your provider shows up and gets the job done. Rate and review after.',
    },
]

function Home() {
        const handleProviderClick = (providerId) => {
        window.location.href = `/provider/${providerId}`
    }
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
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-8">Browse by category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                        {categories.map((cat, index) => (
                            <Link
                                to={`/category/${cat.id}`}
                                key={index}
                                className="flex flex-col items-center justify-center bg-white border border-[#E8F0FF] rounded-2xl p-4 h-[110px] hover:border-[#0057FF] hover:bg-[#F5F8FF] transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E8F0FF] rounded-xl flex items-center justify-center mb-2">
                                    <i className={`fa-solid ${cat.icon} text-[#0057FF] text-base md:text-lg`}></i>
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-[#1A1A1A] text-center">{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Providers Section - 1 column on phone */}
            <section className="bg-[#F5F8FF] py-12 md:py-16">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">Top providers near you</h2>
                        <Link to="/category/all" className="text-sm text-[#0057FF] hover:underline">See all</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {providers.map((provider) => (
                            <div
                              onClick={() => handleProviderClick(provider.id)}
                                key={provider.id}
                                className="bg-white rounded-2xl overflow-hidden border border-[#E8F0FF] shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-[160px]">
                                    <img
                                        src={provider.cover}
                                        alt={provider.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-20"></div>
                                </div>
                                <div className="p-4 pt-6 relative">
                                    <img
                                        src={provider.avatar}
                                        alt={provider.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white absolute -top-6 left-4"
                                    />
                                    <h3 className="font-bold text-[15px] text-[#1A1A1A] mt-2">{provider.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{provider.service}</p>
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-solid fa-star text-xs ${i < Math.floor(provider.rating) ? 'text-[#FF6B00]' : 'text-gray-200'}`}
                                            ></i>
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">({provider.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-4">
                                        <i className="fa-solid fa-location-dot text-xs text-gray-400"></i>
                                        <span className="text-xs text-gray-400">{provider.location}</span>
                                    </div>
                                    <button className="w-full bg-[#0057FF] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="bg-white py-12 md:py-16">
                <div className="max-w-[1280px] mx-auto px-5">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] text-center mb-10 md:mb-12">How SureLink works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#E8F0FF] rounded-full flex items-center justify-center mb-5">
                                    <i className={`fa-solid ${step.icon} text-[#0057FF] text-xl`}></i>
                                </div>
                                <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Home