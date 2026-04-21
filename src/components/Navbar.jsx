import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className="w-full h-18 bg-white border-b border-gray-100 fixed top-0 left-0 z-50">
            <div className="max-w-[1280px] mx-auto px-5 h-[72px] flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-[#0057FF] font-bold text-xl tracking-tight">
                    SureLink
                </Link>

                {/* Search bar — hidden on mobile */}
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-[480px]">
                    <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3"></i>
                    <input
                        type="text"
                        placeholder="What service do you need?"
                        className="bg-transparent outline-none text-sm text-gray-500 w-full"
                    />
                    <i className="fa-solid fa-location-dot text-gray-400 text-sm ml-3"></i>
                </div>

                {/* Right side — hidden on mobile */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/become-provider" className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors">
                        Become a Provider
                    </Link>
                    <Link to="/signin" className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors">
                        Sign in
                    </Link>
                    <Link
                        to="/get-started"
                        className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Burger menu — mobile only */}
                <button
                    className="md:hidden text-gray-700 text-xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                        <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3"></i>
                        <input
                            type="text"
                            placeholder="What service do you need?"
                            className="bg-transparent outline-none text-sm text-gray-500 w-full"
                        />
                    </div>
                    <Link to="/become-provider" className="text-sm text-gray-700">Become a Provider</Link>
                    <Link to="/signin" className="text-sm text-gray-700">Sign in</Link>
                    <Link
                        to="/get-started"
                        className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar