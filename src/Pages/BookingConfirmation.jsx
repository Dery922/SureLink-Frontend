import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const providers = [
    {
        id: 1,
        name: 'Kwame Mensah',
        service: 'Plumbing',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    {
        id: 2,
        name: 'Ama Owusu',
        service: 'Cleaning',
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80',
    },
    {
        id: 3,
        name: 'Kofi Asante',
        service: 'Electrical',
        avatar: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&q=80',
    },
    {
        id: 4,
        name: 'Abena Darko',
        service: 'Catering',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    },
]

function BookingConfirmation() {
    const { providerId } = useParams()
    const navigate = useNavigate()

    const provider = providers.find(p => p.id === parseInt(providerId)) || providers[0]

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="pt-[72px] bg-[#F5F8FF] min-h-screen flex flex-col items-center justify-center px-5">
                <div className="max-w-[600px] w-full text-center">

                    {/* Success icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-[#E8F0FF] rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-check text-[#0057FF] text-5xl"></i>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-base md:text-lg mb-8">Your service request has been sent to the provider</p>

                    {/* Booking details card */}
                    <div className="bg-white border border-[#E8F0FF] rounded-2xl p-6 md:p-8 mb-8 text-left">
                        <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">Booking Details</h2>

                        {/* Provider */}
                        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#E8F0FF]">
                            <img
                                src={provider.avatar}
                                alt={provider.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-bold text-[#1A1A1A]">{provider.name}</p>
                                <p className="text-sm text-gray-500">{provider.service}</p>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">
                                    <i className="fa-solid fa-receipt mr-2 text-[#0057FF]"></i>
                                    Booking ID
                                </span>
                                <span className="font-bold text-[#1A1A1A] text-sm">#BK{Math.floor(Math.random() * 100000)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">
                                    <i className="fa-solid fa-calendar mr-2 text-[#0057FF]"></i>
                                    Status
                                </span>
                                <span className="font-bold text-[#22C55E] text-sm flex items-center gap-1">
                                    <i className="fa-solid fa-check-circle text-sm"></i>
                                    Pending
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#E8F0FF]">
                                <span className="text-gray-500 text-sm font-bold">Estimated Total</span>
                                <span className="font-bold text-[#0057FF] text-lg">GH₵ 150</span>
                            </div>
                        </div>
                    </div>

                    {/* What happens next */}
                    <div className="bg-[#F5F8FF] rounded-2xl p-6 mb-8 text-left">
                        <h3 className="font-bold text-[#1A1A1A] mb-4">What Happens Next?</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">1</div>
                                <div>
                                    <p className="font-bold text-sm text-[#1A1A1A]">Provider reviews your request</p>
                                    <p className="text-xs text-gray-500 mt-1">Within the next 30 minutes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">2</div>
                                <div>
                                    <p className="font-bold text-sm text-[#1A1A1A]">You receive confirmation</p>
                                    <p className="text-xs text-gray-500 mt-1">Via SMS and in-app notification</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">3</div>
                                <div>
                                    <p className="font-bold text-sm text-[#1A1A1A]">Service is completed</p>
                                    <p className="text-xs text-gray-500 mt-1">Payment is collected on completion</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                        <Link
                            to={`/provider/${provider.id}`}
                            className="w-full md:w-auto px-8 py-3 border border-[#0057FF] text-[#0057FF] font-bold rounded-lg hover:bg-[#F5F8FF] transition-colors"
                        >
                            View Provider
                        </Link>
                        <Link
                            to="/"
                            className="w-full md:w-auto px-8 py-3 bg-[#0057FF] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>

                    {/* Support info */}
                    <div className="mt-12 pt-8 border-t border-[#E8F0FF]">
                        <p className="text-gray-500 text-sm mb-2">Need help?</p>
                        <a href="#" className="text-[#0057FF] text-sm font-bold hover:underline flex items-center justify-center gap-1">
                            <i className="fa-solid fa-message"></i>
                            Chat with support
                        </a>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    )
}

export default BookingConfirmation