import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

// ===================== ICONS =====================
const Icon = ({ name, className = "", size = 18 }) => {
  const icons = {
    wrench: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    broom: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m11.5 8.7 5 5"/><path d="M7.7 21l.4-.4a5.5 5.5 0 0 1 7.8 0l.4.4"/><path d="m9 11 8 8"/><path d="m5 12-2-2a2 2 0 0 1 0-2.8l2.2-2.2a2 2 0 0 1 2.8 0L10 7"/><path d="m19 12 2 2a2 2 0 0 0 0 2.8l-2.2 2.2a2 2 0 0 0-2.8 0l-2-2"/></svg>,
    book: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
    bolt: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    hammer: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86c0-1 .81-1.84 1.81-1.84h.47c.54 0 1.05-.2 1.44-.63V4.3c0-.3-.15-.55-.38-.7L18.42 1.34a1 1 0 0 0-1.4 0l-8.68 8.68a1 1 0 0 0 0 1.4l1.34 1.34c.2.2.45.34.72.34h1.1c.78 0 1.5.34 2 1l1.58 1.58Z"/></svg>,
    utensils: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
    scissors: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><circle cx="6" cy="18" r="3"/><path d="M8.12 15.88 16 8"/><path d="M9.6 14.9 12 12"/><path d="M16 16 8.12 8.12"/></svg>,
    more: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
    star: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    location: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    search: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
    arrow: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  };
  return icons[name] || null;
};

// ===================== DATA =====================
const categories = [
    { icon: 'wrench', label: 'Plumbing', id: 'plumbing' },
    { icon: 'broom', label: 'Cleaning', id: 'cleaning' },
    { icon: 'book', label: 'Tutoring', id: 'tutoring' },
    { icon: 'bolt', label: 'Electrical', id: 'electrical' },
    { icon: 'hammer', label: 'Carpentry', id: 'carpentry' },
    { icon: 'utensils', label: 'Catering', id: 'catering' },
    { icon: 'scissors', label: 'Beauty', id: 'beauty' },
    { icon: 'more', label: 'More', id: 'all' },
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
        avatar: 'https://images.unsplash.com/photo-1775218888864-c206f5597085?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        badge: 'Top Pro'
    },
    {
        id: 2,
        name: 'Ama Owusu',
        service: 'Cleaning',
        rating: 4.9,
        reviews: 36,
        location: 'Accra, Ghana',
        cover: 'https://images.unsplash.com/photo-1851578731548-c64695cc6952?w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80',
        badge: 'Super Pro'
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
        icon: 'search',
        title: 'Search Services',
        description: 'Find the right service provider in your area with verified reviews.',
        color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
        icon: 'calendar',
        title: 'Instant Booking',
        description: 'Schedule a time that works for you and get confirmed instantly.',
        color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    },
    {
        icon: 'check',
        title: 'Done & Dusted',
        description: 'Quality workmanship guaranteed. Payment only after job is complete.',
        color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
]

// ===================== COMPONENTS =====================
const CategoryCard = ({ cat }) => (
    <Link to={`/category/${cat.id}`} className="group flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 h-[140px] hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all">
        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 rounded-2xl flex items-center justify-center mb-4 transition-colors">
            <Icon name={cat.icon} className="text-gray-600 dark:text-gray-400 group-hover:text-brand-500 transition-colors" size={24} />
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white transition-colors">{cat.label}</span>
    </Link>
)

const ProviderCard = ({ provider }) => (
    <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 hover:-translate-y-1.5 transition-all">
        <div className="relative h-[180px]">
            <img src={provider.cover} alt={provider.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {provider.badge && (
                <div className="absolute top-4 left-4 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                    {provider.badge}
                </div>
            )}
        </div>
        <div className="p-5 pt-7 relative">
            <div className="absolute -top-7 left-5">
                <img src={provider.avatar} alt={provider.name} className="w-14 h-14 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-lg" />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-1">{provider.name}</h3>
            <p className="text-xs font-bold text-brand-500 mb-3">{provider.service}</p>
            <div className="flex items-center gap-1.5 mb-2">
                <Icon name="star" size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">{provider.rating}</span>
                <span className="text-xs text-gray-400 font-medium">({provider.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 mb-5">
                <Icon name="location" size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">{provider.location}</span>
            </div>
            <button className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm py-3 rounded-xl hover:bg-brand-500 hover:text-white active:scale-[0.98] transition-all">
                View Profile
            </button>
        </div>
    </div>
)

function Home() {
    const [sortOption, setSortOption] = useState('default')
    const sortedProviders = useMemo(() => {
        let list = [...providers]
        if (sortOption === 'rating') list.sort((a, b) => b.rating - a.rating)
        if (sortOption === 'reviews') list.sort((a, b) => b.reviews - a.reviews)
        return list
    }, [sortOption])

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white transition-colors duration-300 antialiased">
            <style>{`
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .float-anim { animation: float 5s ease-in-out infinite; }
                .fade-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-[120px] pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-brand-500/5 -skew-x-12 translate-x-1/4 -z-10 bg-gradient-to-l from-brand-500/10 to-transparent"></div>
                
                <div className="max-w-[1280px] mx-auto px-5 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="flex-1 max-w-[640px] z-10 fade-up">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-900/30 px-4 py-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 mb-6 drop-shadow-sm">
                            <Icon name="check" size={14} />
                            Trusted by 10,000+ homes in Accra
                        </div>
                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-gray-950 dark:text-white leading-[1.05] tracking-tight mb-6">
                            Verified help, <br/>
                            <span className="text-brand-500">whenever you</span> need it.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-[520px]">
                            Connect with verified plumbers, cleaners, tutors, and more. Instant booking. Satisfaction guaranteed.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <a href="#categories" className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-500 text-white font-black text-base px-10 py-5 rounded-2xl hover:bg-brand-600 hover:shadow-2xl hover:shadow-brand-500/30 active:scale-[0.98] transition-all group">
                                Browse Services
                                <Icon name="arrow" className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link to="/become-provider" className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-200 dark:border-gray-800 font-bold text-base px-10 py-5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-[0.98] transition-all">
                                Become a Provider
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="mt-12 flex items-center gap-4 pt-8 border-t border-gray-100 dark:border-gray-900">
                             <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <img key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-gray-950 object-cover" src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                ))}
                             </div>
                             <div className="text-sm">
                                <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={12} className="text-amber-400" />)}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-bold">4.9/5 from <span className="text-gray-900 dark:text-white">2,400+ reviews</span></p>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[580px] relative fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full -z-10"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1469&auto=format&fit=crop" 
                            alt="Service providers" 
                            className="w-full h-[520px] object-cover rounded-[40px] shadow-2xl skew-y-1 float-anim" 
                        />
                        {/* Floating elements */}
                        <div className="absolute -left-10 top-1/4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl border border-gray-50 dark:border-gray-800 float-anim" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                    <Icon name="check" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Provider Verified</p>
                                    <p className="text-sm font-black">Identity Confirmed</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-8 bottom-10 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl border border-gray-50 dark:border-gray-800 float-anim" style={{ animationDelay: '2s' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white">
                                    <Icon name="bolt" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Matching Time</p>
                                    <p className="text-sm font-black">&lt; 5 Minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Section */}
            <section id="categories" className="py-24">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div className="max-w-[520px]">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Browse by category</h2>
                            <p className="text-gray-500 dark:text-gray-400">Whatever you need, we have a pro for it. Explore our most popular categories.</p>
                        </div>
                        <Link to="/browse" className="text-brand-500 font-black text-sm hover:translate-x-1 transition-transform inline-flex items-center">
                            View All Categories <Icon name="arrow" className="ml-1" size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
                        {categories.map((cat, index) => (
                            <CategoryCard cat={cat} key={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Providers Section */}
            <section className="bg-gray-50/50 dark:bg-gray-900/10 py-24 border-y border-gray-100 dark:border-gray-900">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-3">Top providers near you</h2>
                            <p className="text-gray-500 dark:text-gray-400">The highest rated professionals in Accra, hand-picked for quality.</p>
                        </div>
                        {/* Sorting Controls */}
                        <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            {[
                                { id: 'default', label: 'Recommended' },
                                { id: 'rating', label: 'Top Rated' },
                                { id: 'reviews', label: 'Most Reviews' }
                            ].map(opt => (
                                <button 
                                    key={opt.id}
                                    onClick={() => setSortOption(opt.id)} 
                                    className={`px-5 py-2 rounded-[14px] text-xs font-black transition-all ${
                                        sortOption === opt.id 
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                                        : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sortedProviders.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button className="inline-flex items-center justify-center border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-base px-10 py-4 rounded-2xl hover:bg-white dark:hover:bg-gray-900 hover:border-brand-500 transition-all">
                            Show More Providers
                        </button>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-24">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="text-center max-w-[640px] mx-auto mb-20">
                        <h2 className="text-4xl font-black mb-4">How SureLink works</h2>
                        <p className="text-gray-500 dark:text-gray-400">We make it simple, safe, and fast to find help. Three steps to get anything done.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting lines for desktop */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-100 dark:border-gray-800 -z-10"></div>
                        
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-current/5 group-hover:-translate-y-2 transition-transform`}>
                                    <Icon name={step.icon} size={36} />
                                </div>
                                <h3 className="font-black text-xl text-gray-950 dark:text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-5">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-[1280px] mx-auto px-5 mb-24">
                <div className="bg-brand-500 rounded-[40px] p-10 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                    
                    <div className="relative z-10 max-w-[640px] mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Ready to get your <br/> first job done?</h2>
                        <p className="text-lg text-white/80 mb-10">Join over 10,000 users in Accra who trust SureLink for their daily needs.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/get-started" className="bg-white text-brand-500 font-extrabold px-10 py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all">
                                Get Started Now
                            </Link>
                            <Link to="/contact" className="bg-brand-600 text-white font-bold px-10 py-5 rounded-2xl border border-white/20 hover:bg-brand-700 transition-all">
                                Talk to Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Home;
