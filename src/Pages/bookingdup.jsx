import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const providers = [
    {
        id: 1,
        name: 'Kwame Mensah',
        service: 'Plumbing',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        price: 150,
        displayPrice: 'GH₵ 150',
    },
    {
        id: 2,
        name: 'Ama Owusu',
        service: 'Cleaning',
        avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80',
        price: 100,
        displayPrice: 'GH₵ 100',
    },
    {
        id: 3,
        name: 'Kofi Asante',
        service: 'Electrical',
        avatar: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&q=80',
        price: 200,
        displayPrice: 'GH₵ 200',
    },
    {
        id: 4,
        name: 'Abena Darko',
        service: 'Catering',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
        price: 300,
        displayPrice: 'GH₵ 300',
    },
]

const servicesList = {
    1: [
        { id: 1, name: 'Pipe Repair', price: 150, duration: '1 - 2 hours' },
        { id: 2, name: 'Installation', price: 200, duration: '2 - 3 hours' },
        { id: 3, name: 'Drainage', price: 120, duration: '1 - 3 hours' },
    ],
    2: [
        { id: 1, name: 'Regular Cleaning', price: 100, duration: '2 - 3 hours' },
        { id: 2, name: 'Deep Cleaning', price: 200, duration: '4 - 6 hours' },
        { id: 3, name: 'Post-Construction', price: 350, duration: '6 - 8 hours' },
    ],
    3: [
        { id: 1, name: 'Rewiring', price: 200, duration: '3 - 5 hours' },
        { id: 2, name: 'Circuit Installation', price: 250, duration: '2 - 4 hours' },
        { id: 3, name: 'Troubleshooting', price: 150, duration: '1 - 2 hours' },
    ],
    4: [
        { id: 1, name: 'Small Event (20 people)', price: 300, duration: '3 hours' },
        { id: 2, name: 'Medium Event (50 people)', price: 600, duration: '5 hours' },
        { id: 3, name: 'Large Event (100+ people)', price: 1200, duration: '8 hours' },
    ],
}

const timeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']

function BookingFlow() {
    const { providerId } = useParams()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)

    const provider = providers.find(p => p.id === parseInt(providerId)) || providers[0]
    const services = servicesList[parseInt(providerId)] || servicesList[1]

    // Form state
    const [selectedService, setSelectedService] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [landmark, setLandmark] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('mobile-money')

    // Calculate total price
    const totalPrice = selectedService ? selectedService.price : 0

    // Step 1: Select Service
    const renderStep1 = () => (
        <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Select a Service</h2>
            <p className="text-gray-500 mb-8">Choose the service you need from {provider.name}</p>

            <div className="flex flex-col gap-4 mb-8">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedService?.id === service.id
                                ? 'border-[#0057FF] bg-[#F5F8FF]'
                                : 'border-[#E8F0FF] hover:border-[#0057FF]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-[#1A1A1A]">{service.name}</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span>
                                        <i className="fa-solid fa-clock mr-2"></i>
                                        {service.duration}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-xl text-[#0057FF]">GH₵ {service.price}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={() => setStep(2)}
                    disabled={!selectedService}
                    className={`px-8 py-3 font-bold rounded-lg transition-colors ${selectedService
                            ? 'bg-[#0057FF] text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    )

    // Step 2: Pick Date & Time
    const renderStep2 = () => (
        <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Pick a Date & Time</h2>
            <p className="text-gray-500 mb-8">When do you need the service?</p>

            {/* Date picker */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-[#1A1A1A] mb-3">Select Date</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
                />
            </div>

            {/* Time slots */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-[#1A1A1A] mb-3">Select Time</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-xl border-2 font-bold transition-all ${selectedTime === time
                                    ? 'border-[#0057FF] bg-[#0057FF] text-white'
                                    : 'border-[#E8F0FF] text-gray-700 hover:border-[#0057FF]'
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setStep(1)}
                    className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
                >
                    Back
                </button>
                <button
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className={`px-8 py-3 font-bold rounded-lg transition-colors ${selectedDate && selectedTime
                            ? 'bg-[#0057FF] text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    )

    // Step 3: Enter Location
    const renderStep3 = () => (
        <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Enter Your Location</h2>
            <p className="text-gray-500 mb-8">Where should the service be provided?</p>

            {/* Address fields */}
            <div className="flex flex-col gap-5 mb-8">
                <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Street Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g., 123 Main Street"
                        className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[#1A1A1A] mb-2">City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g., Accra"
                            className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Landmark (Optional)</label>
                        <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="e.g., Near the market"
                            className="w-full px-4 py-3 border border-[#E8F0FF] rounded-xl focus:outline-none focus:border-[#0057FF]"
                        />
                    </div>
                </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-[#E8F0FF] rounded-2xl h-[200px] flex items-center justify-center mb-8">
                <div className="text-center">
                    <i className="fa-solid fa-map-location-dot text-3xl text-[#0057FF] mb-2"></i>
                    <p className="text-gray-500">Map preview will appear here</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
                >
                    Back
                </button>
                <button
                    onClick={() => setStep(4)}
                    disabled={!address || !city}
                    className={`px-8 py-3 font-bold rounded-lg transition-colors ${address && city
                            ? 'bg-[#0057FF] text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    )

    // Step 4: Confirm & Pay
    const renderStep4 = () => (
        <div className="max-w-[800px] mx-auto px-5 py-8 md:py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Confirm & Pay</h2>
            <p className="text-gray-500 mb-8">Review your booking details and select a payment method</p>

            {/* Booking Summary */}
            <div className="bg-white border border-[#E8F0FF] rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Booking Summary</h3>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E8F0FF]">
                    <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-bold text-[#1A1A1A]">{provider.name}</p>
                        <p className="text-sm text-gray-500">{selectedService?.name}</p>
                    </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-[#E8F0FF]">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            <i className="fa-solid fa-wrench mr-2"></i>
                            Service
                        </span>
                        <span className="font-bold text-[#1A1A1A]">{selectedService?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            <i className="fa-solid fa-calendar mr-2"></i>
                            Date
                        </span>
                        <span className="font-bold text-[#1A1A1A]">{selectedDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            <i className="fa-solid fa-clock mr-2"></i>
                            Time
                        </span>
                        <span className="font-bold text-[#1A1A1A]">{selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            <i className="fa-solid fa-location-dot mr-2"></i>
                            Location
                        </span>
                        <span className="font-bold text-[#1A1A1A]">{city}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A1A]">Total</span>
                    <span className="font-bold text-2xl text-[#0057FF]">GH₵ {totalPrice}</span>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Payment Method</h3>

                <div className="space-y-3">
                    {[
                        {
                            id: 'mobile-money',
                            name: 'Mobile Money',
                            description: 'MTN, Vodafone, AirtelTigo',
                            icon: 'fa-mobile',
                        },
                        {
                            id: 'debit-card',
                            name: 'Debit Card',
                            description: 'Visa, MasterCard',
                            icon: 'fa-credit-card',
                        },
                        {
                            id: 'cash',
                            name: 'Cash on Delivery',
                            description: 'Pay when service is complete',
                            icon: 'fa-money-bill',
                        },
                    ].map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === method.id
                                    ? 'border-[#0057FF] bg-[#F5F8FF]'
                                    : 'border-[#E8F0FF] hover:border-[#0057FF]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#E8F0FF] rounded-lg flex items-center justify-center">
                                    <i className={`fa-solid ${method.icon} text-[#0057FF]`}></i>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1A1A1A]">{method.name}</p>
                                    <p className="text-sm text-gray-500">{method.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300"
                >
                    Back
                </button>
                <button
                    onClick={() => navigate(`/booking-confirmation/${provider.id}`)}
                    className="px-8 py-3 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Confirm & Pay
                </button>
            </div>
        </div>
    )

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            <div className="pt-[72px] bg-[#F5F8FF]">

                {/* Progress bar */}
                <div className="max-w-[1280px] mx-auto px-5 py-8 md:py-12">
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${s <= step
                                            ? 'bg-[#0057FF] text-white'
                                            : 'bg-white border-2 border-[#E8F0FF] text-gray-400'
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 4 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all ${s < step ? 'bg-[#0057FF]' : 'bg-[#E8F0FF]'
                                            }`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-sm text-gray-500">
                            Step {step} of 4 • {step === 1 && 'Select Service'} {step === 2 && 'Pick Date & Time'} {step === 3 && 'Enter Location'} {step === 4 && 'Confirm & Pay'}
                        </p>
                    </div>
                </div>

                {/* Step content */}
                <div className="bg-white">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default BookingFlow