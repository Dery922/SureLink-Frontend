import { useState } from 'react'
import { Link } from 'react-router-dom'
import SubNavbar from './SubNavbar'
import { useDispatch } from 'react-redux'
import { logoutUser,loginSuccess } from '../APIs/mockAuthApi'
import { useSelector } from "react-redux";


import api from '../APIs/api'
 

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

 const dispatch = useDispatch();

  const mockUser = {
    name: "Gideon Franklin",
};
const isLoggedIn = false; // later this will come from Redux

    const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    dispatch(logoutUser());
  } catch (err) {
    console.error("Logout failed", err);
  }
};

    return (
        <nav className="w-full bg-white border-b border-gray-100 fixed top-0 left-0 z-50 ">
            <div className="max-w-[1280px] mx-auto px-5 h-[72px] flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-[#0057FF] font-bold text-xl tracking-tight shrink-0">
                            
                 <img
                    src="/Logo.png"
                    alt="SureLink logo"
                    className="h-20 w-auto ml-4 object-contain"
                    loading="eager"
                    />
                 </Link>

                {/* Search bar — hidden on mobile */}
                    <div
                    className={`hidden md:flex items-center border rounded-full px-4 py-2 w-[400px] lg:w-[480px] transition-all relative ${
                    isSearchFocused
                    ? 'bg-white border-[#0057FF] shadow-lg z-50'
                    : 'bg-gray-50 border-gray-200 z-50'
                    }`}
                    >
                    <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-3"></i>
                    <input
                        type="text"
                          onFocus={() => setIsSearchFocused(true)}
                         onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                        placeholder="What service do you need?"
                        className="bg-transparent outline-none text-sm text-gray-500 w-full"
                    />
                    <i className="fa-solid fa-location-dot text-gray-400 text-sm ml-3"></i>
                </div>

                {/* Right side — hidden on mobile */}
                {/* <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
                    <Link to="/become-provider" className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors whitespace-nowrap">
                        Become a Provider
                    </Link>
                    <Link to="/signin" className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors">
                        Sign in
                    </Link>
                    <Link 
                        to="/get-started"
                        className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        Get Started
                    </Link>
                </div> */}

                <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">

  <Link
    to="/become-provider"
    className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors whitespace-nowrap"
  >
    Become a Provider
  </Link>
  

  {isLoggedIn ? (
    <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#0057FF] text-white flex items-center justify-center font-semibold">
            {mockUser.name.charAt(0)}
        </div>

        {/* Name */}
        <span className="text-sm font-semibold text-gray-800">
            {mockUser.name}
        </span>
    </div>
) : (
    <>
        <Link
            to="/signin"
            className="text-sm text-gray-700 hover:text-[#0057FF] transition-colors"
        >
            Sign in
        </Link>

        <Link
            to="/get-started"
            className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
            Get Started
        </Link>
    </>
)}
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
                    {/* <Link to="/signin" className="text-sm text-gray-700">Sign in</Link>
                    <Link
                        to="/get-started"
                        className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
                    >
                        Get Started
                    </Link> */}

                     {!isAuthenticated ? (
                        <>
                            <Link to="/signin" className="text-sm text-gray-700">Sign in</Link>
                            <Link
                            to="/get-started"
                            className="bg-[#0057FF] text-white text-sm font-bold px-5 py-2.5 rounded-lg text-center"
                            >
                            Get Started
                            </Link>
                        </>
                        ) : (
                        <>
                            <span className="text-sm font-semibold text-gray-800">
                            Hi, {user?.fullName?.split(" ")[0] || "User"}
                            </span>
                            <button
                            onClick={handleLogout}
                            className="text-sm text-red-500 font-medium text-left"
                            >
                            Logout
                            </button>
                        </>
                        )}

                </div>
                
            )}
 
   <SubNavbar />
        {isSearchFocused && (
  <div
    className="fixed inset-0 bg-black/40 z-40"
    onClick={() => setIsSearchFocused(false)}
  />
)}
        </nav>
    )
}

export default Navbar