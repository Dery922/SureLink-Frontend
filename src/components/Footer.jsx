import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white pt-14 pb-8">
            <div className="max-w-[1280px] mx-auto px-5">

                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-gray-700">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-[#0057FF] font-bold text-xl mb-3">SureLink</h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                            Connecting Ghana, one service at a time. Find trusted local providers instantly.
                        </p>
                        <div className="flex gap-4 mt-5">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fa-brands fa-facebook text-lg"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fa-brands fa-twitter text-lg"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fa-brands fa-instagram text-lg"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <i className="fa-brands fa-linkedin text-lg"></i>
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">Company</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors">About us</Link></li>
                            <li><Link to="/careers" className="text-gray-400 text-sm hover:text-white transition-colors">Careers</Link></li>
                            
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">Services</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/browse" className="text-gray-400 text-sm hover:text-white transition-colors">Browse services</Link></li>
                            <li><Link to="/become-provider" className="text-gray-400 text-sm hover:text-white transition-colors">Become a provider</Link></li>
                            <li><Link to="/pricing" className="text-gray-400 text-sm hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">Support</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/help" className="text-gray-400 text-sm hover:text-white transition-colors">Help center</Link></li>
                            <li><Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">Contact us</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">© 2026 SureLink. All rights reserved.</p>
                    <p className="text-gray-500 text-xs">SureLink</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer