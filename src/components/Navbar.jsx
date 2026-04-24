import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Icon = ({ name, className = "", size = 18 }) => {
  const icons = {
    moon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    ),
    sun: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    ),
    "magnifying-glass": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
    "location-dot": (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    bars: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    ),
    xmark: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    ),
  };
  return icons[name] || null;
};

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [dark, setDark] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('surelink_dark')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const isDark = saved === 'true' || (!saved && prefersDark)
        setDark(isDark)
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleDark = () => {
        const next = !dark
        setDark(next)
        localStorage.setItem('surelink_dark', String(next))
        if (next) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
    }

    return (
        <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
            scrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-3 shadow-sm' 
            : 'bg-white dark:bg-gray-950 py-4'
        }`}>
            <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="text-brand-500 font-extrabold text-2xl tracking-tighter shrink-0 hover:opacity-90 transition-opacity">
                    SureLink
                </Link>

                {/* Search bar — hidden on mobile */}
                <div className="hidden md:flex items-center flex-1 max-w-[520px] bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 transition-all focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                    <Icon name="magnifying-glass" className="text-gray-400 mr-3" size={16} />
                    <input
                        type="text"
                        placeholder="What service do you need?"
                        className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full placeholder:text-gray-400"
                    />
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-3"></div>
                    <Icon name="location-dot" className="text-gray-400" size={16} />
                    <span className="text-xs font-semibold text-gray-400 ml-1.5 whitespace-nowrap">Accra</span>
                </div>

                {/* Right side — hidden on mobile */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link to="/become-provider" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                        Become a Provider
                    </Link>
                    <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                        Sign in
                    </Link>
                    <Link
                        to="/get-started"
                        className="bg-brand-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] transition-all"
                    >
                        Get Started
                    </Link>
                    <button 
                        onClick={toggleDark}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {dark ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
                    </button>
                </div>

                {/* Mobile side controls */}
                <div className="flex lg:hidden items-center gap-2">
                    <button 
                        onClick={toggleDark}
                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 sm:mr-1"
                    >
                        {dark ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}
                    </button>
                    <button
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <Icon name={menuOpen ? 'xmark' : 'bars'} size={18} />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-5 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                        <Icon name="magnifying-glass" className="text-gray-400 mr-3" size={18} />
                        <input
                            type="text"
                            placeholder="What service do you need?"
                            className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
                        />
                    </div>
                    <Link to="/become-provider" onClick={() => setMenuOpen(false)} className="text-base font-bold text-gray-700 dark:text-gray-300 py-2">Become a Provider</Link>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-base font-bold text-gray-700 dark:text-gray-300 py-2">Sign in</Link>
                    <Link
                        to="/get-started"
                        onClick={() => setMenuOpen(false)}
                        className="bg-brand-500 text-white text-base font-bold py-3.5 rounded-2xl text-center shadow-lg shadow-brand-500/20"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar