import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.id]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: 'fa-envelope',
            title: 'Email Us',
            value: 'support@surelink.com',
            description: 'Our team typically responds within 2 hours.'
        },
        {
            icon: 'fa-phone',
            title: 'Call Us',
            value: '+233 (0) 50 123 4567',
            description: 'Available Mon-Fri, 9am - 6pm.'
        },
        {
            icon: 'fa-location-dot',
            title: 'Visit Us',
            value: '12 Independence Ave, Accra',
            description: 'Near the National Theatre.'
        }
    ];

    const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition focus:border-[#0057FF] focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50";

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            
            <main className="pt-[72px]">
                {/* Hero Section */}
                <section className="bg-[#F5F8FF] py-16 md:py-20 border-b border-gray-100">
                    <div className="max-w-[1280px] mx-auto px-5 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Get in Touch</h1>
                        <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
                            Have a question or need assistance? We're here to help you get the most out of SureLink.
                        </p>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="max-w-[1100px] mx-auto px-5">
                        <div className="grid md:grid-cols-12 gap-12">
                            
                            {/* Contact Form */}
                            <div className="md:col-span-7">
                                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8F0FF] shadow-sm">
                                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Send us a message</h2>
                                    
                                    {submitted ? (
                                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex flex-col items-center text-center animate-fade-in">
                                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                                <i className="fa-solid fa-check text-2xl text-emerald-600"></i>
                                            </div>
                                            <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                                            <p className="text-sm opacity-90">Thank you for reaching out. Our team will get back to you shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-bold text-[#1A1A1A] mb-2">Full Name</label>
                                                    <input 
                                                        type="text" id="name" required placeholder="Kofi Mensah"
                                                        value={formState.name} onChange={handleChange}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-bold text-[#1A1A1A] mb-2">Email Address</label>
                                                    <input 
                                                        type="email" id="email" required placeholder="kofi@example.com"
                                                        value={formState.email} onChange={handleChange}
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-bold text-[#1A1A1A] mb-2">Subject</label>
                                                <input 
                                                    type="text" id="subject" required placeholder="How can we help?"
                                                    value={formState.subject} onChange={handleChange}
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="message" className="block text-sm font-bold text-[#1A1A1A] mb-2">Message</label>
                                                <textarea 
                                                    id="message" rows="5" required placeholder="Write your message here..."
                                                    value={formState.message} onChange={handleChange}
                                                    className={`${inputClass} resize-none`}
                                                ></textarea>
                                            </div>
                                            <button 
                                                type="submit"
                                                className="w-full bg-[#0057FF] text-white font-bold text-base py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                Send Message
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="md:col-span-5 flex flex-col gap-6">
                                {contactInfo.map((info, i) => (
                                    <div key={i} className="flex gap-5 p-6 rounded-3xl border border-gray-50 bg-gray-50/50 hover:bg-[#F5F8FF] hover:border-[#E8F0FF] transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:text-[#0057FF] transition-colors">
                                            <i className={`fa-solid ${info.icon} text-lg`}></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1A1A1A] mb-1">{info.title}</h4>
                                            <div className="text-[#0057FF] font-bold text-sm mb-1">{info.value}</div>
                                            <p className="text-gray-500 text-xs leading-relaxed">{info.description}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Help Center CTA */}
                                <div className="mt-4 p-8 rounded-3xl bg-[#1A1A1A] text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-lg mb-2 text-white">Need quick answers?</h4>
                                        <p className="text-gray-400 text-sm mb-6">Check out our Help Center for frequently asked questions and troubleshooting guides.</p>
                                        <a href="#" className="inline-flex items-center gap-2 text-[#0057FF] font-bold text-sm hover:translate-x-1 transition-transform">
                                            Visit Help Center <i className="fa-solid fa-arrow-right"></i>
                                        </a>
                                    </div>
                                    <i className="fa-solid fa-headset absolute -right-6 -bottom-6 text-6xl text-white opacity-5 rotate-12"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
