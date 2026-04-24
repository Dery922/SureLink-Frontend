import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ===================== ICONS =====================
const Icon = ({ name, className = "", size = 18 }) => {
  const icons = {
    star: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    location: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    chevronLeft: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>,
    chevronRight: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>,
  };
  return icons[name] || null;
};

// ===================== DATA =====================
const allProviders = [
    {
        id: 1,
        name: 'Kwame Mensah',
        service: 'Plumbing',
        category: 'plumbing',
        rating: 4.8,
        reviews: 24,
        location: 'Accra, Ghana',
        price: 'From GH₵ 150',
        cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        badge: 'Top Pro'
    },
    {
        id: 2,
        name: 'Ama Owusu',
        service: 'Cleaning',
        category: 'cleaning',
        rating: 4.9,
        reviews: 36,
        location: 'Accra, Ghana',
        price: 'From GH₵ 100',
        cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
        badge: 'Super Pro'
    },
    {
        id: 3,
        name: 'Kofi Asante',
        service: 'Electrical',
        category: 'electrical',
        rating: 4.7,
        reviews: 18,
        location: 'Accra, Ghana',
        price: 'From GH₵ 200',
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
        price: 'From GH₵ 300',
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
        price: 'From GH₵ 250',
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
        price: 'From GH₵ 80',
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
        price: 'From GH₵ 120',
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
        price: 'From GH₵ 180',
        cover: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
]

const filters = ['All Results', 'Top Rated', 'Verified Only', 'Price: Low to High', 'Near Me']

// ===================== COMPONENTS =====================
const ProviderWideCard = ({ provider }) => (
    <div className="bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all group">
        <div className="flex flex-col sm:flex-row h-full">
            {/* Image side */}
            <div className="relative w-full sm:w-[240px] h-[200px] sm:h-auto shrink-0 overflow-hidden">
                <img src={provider.cover} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden"></div>
                {provider.badge && (
                    <div className="absolute top-4 left-4 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        {provider.badge}
                    </div>
                )}
            </div>
            
            {/* Content side */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-black text-xl text-gray-950 dark:text-white leading-tight">{provider.name}</h3>
                            <p className="text-sm font-bold text-brand-500">{provider.service}</p>
                        </div>
                        <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md" />
                   </div>

                   <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                            <Icon name="star" size={14} className="text-amber-400" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{provider.rating}</span>
                            <span className="text-xs text-gray-400 font-medium">({provider.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Icon name="location" size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-400 font-medium">{provider.location}</span>
                        </div>
                   </div>

                   <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        Identity Verified
                   </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4">
                    <div className="text-sm font-black text-gray-900 dark:text-white">
                        {provider.price}
                    </div>
                    <button className="bg-brand-500 text-white font-black text-sm px-8 py-3 rounded-2xl hover:bg-brand-600 active:scale-[0.98] transition-all">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    </div>
)

function CategoryResults() {
    const { id } = useParams()
    const [activeFilter, setActiveFilter] = useState('All Results')

    const filtered = id === 'all'
        ? allProviders
        : allProviders.filter(p => p.category === id)

    const displayProviders = filtered.length > 0 ? filtered : allProviders

    const categoryName = id
        ? id.charAt(0).toUpperCase() + id.slice(1)
        : 'All'

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white transition-colors duration-300 antialiased">
            <Navbar />

            <div className="pt-[100px] pb-24">

                {/* Page header */}
                <header className="py-12 border-b border-gray-100 dark:border-gray-900">
                    <div className="max-w-[1280px] mx-auto px-5">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <Link to="/" className="hover:text-brand-500">Home</Link>
                                    <Icon name="chevronRight" size={12} />
                                    <span className="text-gray-950 dark:text-white">Categories</span>
                                </nav>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{categoryName} Services</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Found {displayProviders.length} trusted professionals in Accra.</p>
                            </div>
                            
                            <div className="text-right">
                                <div className="inline-flex items-center gap-3 bg-brand-50 dark:bg-brand-900/30 px-5 py-3 rounded-2xl">
                                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                                    <span className="text-sm font-black text-brand-600 dark:text-brand-400">Average match: &lt; 10 min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Filter bar */}
                <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-[72px] z-40 border-b border-gray-50 dark:border-gray-900">
                    <div className="max-w-[1280px] mx-auto px-5 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all ${activeFilter === filter
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results grid */}
                <div className="max-w-[1280px] mx-auto px-5 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {displayProviders.map((provider) => (
                            <ProviderWideCard key={provider.id} provider={provider} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-3 mt-20">
                        <button className="w-12 h-12 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex items-center justify-center shadow-sm">
                            <Icon name="chevronLeft" size={20} />
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${page === 1
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                        : 'border border-gray-100 dark:border-gray-800 text-gray-400 hover:border-brand-500 hover:text-brand-500'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="w-12 h-12 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all flex items-center justify-center shadow-sm">
                            <Icon name="chevronRight" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default CategoryResults