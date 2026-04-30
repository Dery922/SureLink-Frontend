import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    const stats = [
        { label: 'Verified Providers', value: '10,000+' },
        { label: 'Happy Customers', value: '50,000+' },
        { label: 'Service Categories', value: '25+' },
        { label: 'Cities Covered', value: '12' }
    ];

    const values = [
        {
            title: 'Trust & Safety',
            description: 'We rigorously verify every provider to ensure you get the safest experience possible.',
            icon: 'fa-shield-halved'
        },
        {
            title: 'Community First',
            description: 'SureLink is built by Ghanaians, for Ghanaians, supporting local artisans and businesses.',
            icon: 'fa-users'
        },
        {
            title: 'Quality Guaranteed',
            description: 'Our rating system ensures only the best pros thrive on the platform.',
            icon: 'fa-star'
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            
            <main className="pt-[72px]">
                {/* Hero Section */}
                <section className="bg-[#F5F8FF] py-16 md:py-24">
                    <div className="max-w-[1280px] mx-auto px-5 text-center">
                        <h1 className="text-4xl md:text-[56px] font-bold text-[#1A1A1A] leading-tight mb-6">
                            Connecting Ghana, <br />
                            <span className="text-[#0057FF]">One Service at a Time</span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
                            SureLink is the #1 hyper-local platform for verified artisans, on-demand services, and community bulk buying.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-[#E8F0FF] shadow-sm min-w-[160px]">
                                    <div className="text-2xl font-bold text-[#0057FF] mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-16 md:py-24">
                    <div className="max-w-[1000px] mx-auto px-5">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6">Our Story</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Founded in Accra, SureLink was born out of a simple need: to find reliable, trustworthy artisans without the endless word-of-mouth guesswork.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We realized that while Ghana is full of talented professionals, there was no central place to find, verify, and book them with confidence. 
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Today, we're proud to support thousands of local businesses and help families across the country get their jobs done quickly and safely.
                                </p>
                            </div>
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80" 
                                    alt="Team working together" 
                                    className="rounded-3xl shadow-xl border-8 border-white"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-[#0057FF] text-white p-6 rounded-2xl hidden sm:block shadow-lg">
                                    <div className="text-3xl font-bold mb-1">5+</div>
                                    <div className="text-xs font-bold uppercase tracking-widest opacity-80">Years of Service</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="bg-gray-50 py-16 md:py-24 border-y border-gray-100">
                    <div className="max-w-[1280px] mx-auto px-5">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#E8F0FF] shadow-sm">
                                <div className="w-12 h-12 bg-[#E8F0FF] rounded-2xl flex items-center justify-center mb-6">
                                    <i className="fa-solid fa-bullseye text-[#0057FF] text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Mission</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    To empower local communities by building the digital infrastructure that makes finding, hiring, and paying for services seamless, safe, and transparent for everyone in Ghana.
                                </p>
                            </div>
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#E8F0FF] shadow-sm">
                                <div className="w-12 h-12 bg-[#E8F0FF] rounded-2xl flex items-center justify-center mb-6">
                                    <i className="fa-solid fa-eye text-[#0057FF] text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Vision</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    To become the most trusted and reliable digital marketplace in West Africa, connecting millions of skilled artisans with households and businesses through innovation and trust.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-16 md:py-24">
                    <div className="max-w-[1280px] mx-auto px-5">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] text-center mb-16">The Values that Drive Us</h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {values.map((value, i) => (
                                <div key={i} className="text-center group">
                                    <div className="w-16 h-16 bg-[#F5F8FF] rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-[#0057FF] group-hover:text-white transition-all duration-300">
                                        <i className={`fa-solid ${value.icon} text-2xl text-[#0057FF] group-hover:text-white`}></i>
                                    </div>
                                    <h4 className="text-lg font-bold text-[#1A1A1A] mb-3">{value.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
