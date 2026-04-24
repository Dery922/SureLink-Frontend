import { Link } from 'react-router-dom'

const Icon = ({ name, className = "", size = 18 }) => {
  const icons = {
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    ),
  };
  return icons[name] || null;
};

function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-[1280px] mx-auto px-5">

                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-gray-100 dark:border-gray-800">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="text-brand-500 font-extrabold text-2xl tracking-tighter mb-4 inline-block">
                            SureLink
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[320px]">
                            Connecting Ghana, one service at a time. Find trusted local providers instantly for your home, office, and personal needs.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm">
                                    <Icon name={social} size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links columns */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-5 uppercase tracking-wider">Company</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/about" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">About us</Link></li>
                            <li><Link to="/careers" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Our Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-5 uppercase tracking-wider">Services</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/category/plumbing" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Find Pros</Link></li>
                            <li><Link to="/become-provider" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Become a Provider</Link></li>
                            <li><Link to="/pricing" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Pricing</Link></li>
                            <li><Link to="/safety" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Trust & Safety</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-5 uppercase tracking-wider">Support</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/help" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Help Center</Link></li>
                            <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Contact us</Link></li>
                            <li><Link to="/privacy" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 text-sm hover:text-brand-500 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">© 2026 SureLink. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-gray-400 dark:text-gray-500 text-xs hover:text-brand-500 transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-gray-400 dark:text-gray-500 text-xs hover:text-brand-500 transition-colors">Terms</Link>
                        <Link to="/cookies" className="text-gray-400 dark:text-gray-500 text-xs hover:text-brand-500 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer