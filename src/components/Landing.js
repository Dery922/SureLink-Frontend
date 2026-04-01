import React, { useState, useEffect } from 'react';
import './Landing.css';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [animatedCards, setAnimatedCards] = useState([]);

  useEffect(() => {
    // Trigger animations on mount
    const cards = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setFormMsg('Please enter a valid email address.');
      return;
    }
    setFormMsg('');
    setShowModal(true);
    setEmail('');
  };

  const handleCtaClick = () => {
    document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const SuccessModal = () => {
    if (!showModal) return null;
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon">🎉</div>
          <h3>You're on the list!</h3>
          <p>We'll notify you when LocalLink launches in Sunyani. Stay tuned for trusted services, deliveries & group buying.</p>
          <button className="modal-close" onClick={() => setShowModal(false)}>Got it</button>
        </div>
      </div>
    );
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <div className="navbar animate-fade-down">
        <div className="logo">
          Sure<span>Link</span>
        </div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('phases'); }}>Roadmap</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('signup-section'); }}>Early Access</a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero animate-fade-up">
        <div className="hero-content">
          <div className="hero-badge pulse">✨ Built for Ghana • Coming to Sunyani ✨</div>
          <h1>Connect with <span className="highlight">Trusted</span> Local Services</h1>
          <p>SureLink is a hyper-local platform for verified artisans, on-demand delivery, and community bulk buying. Designed for real life in Sunyani and beyond.</p>
          <button className="cta-button glow" onClick={handleCtaClick}>
            🚀 Get Early Access →
          </button>
        </div>
        <div className="hero-visual float">
          <div className="mockup-icon">
            <svg width="160" height="140" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="20" width="140" height="130" rx="20" fill="#F4A261" fillOpacity="0.15" />
              <path d="M70 70 L130 70 M70 100 L110 100 M50 130 L150 130" stroke="#2C3E66" strokeWidth="6" strokeLinecap="round" />
              <circle cx="100" cy="95" r="12" fill="#2C3E66" fillOpacity="0.3" />
              <circle cx="100" cy="95" r="5" fill="#F4A261" />
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </svg>
            <span className="mockup-text">🔧 Plumber • 🛵 Rider • 🛒 Group Buy</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features">
        <h2 className="section-title animate-on-scroll">What SureLink offers</h2>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon bounce-icon">🔨</div>
            <h3>Service Marketplace</h3>
            <p>Find verified plumbers, electricians, and local pros with ratings & reviews. No more word-of-mouth guesswork.</p>
          </div>
          <div className="feature-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon bounce-icon">🚚</div>
            <h3>Errand & Delivery</h3>
            <p>Send packages, request pickups, track deliveries with reliable riders. Fast & affordable logistics (Phase 2).</p>
          </div>
          <div className="feature-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon bounce-icon">🛍️</div>
            <h3>Group Buying</h3>
            <p>Join neighbors to buy in bulk and unlock discounts. Lower prices on essentials like rice, oil & household goods.</p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="trust-section animate-on-scroll">
        <h2>🔐 Trust is our foundation</h2>
        <p>Ratings, identity verification, and transparent job history — we're building safety into every interaction.</p>
        <div className="trust-badges">
          <div className="trust-item hover-scale">✓ Verified Artisans</div>
          <div className="trust-item hover-scale">✓ Reviews & Ratings</div>
          <div className="trust-item hover-scale">✓ Mobile Money Ready</div>
          <div className="trust-item hover-scale">✓ Dispute Resolution</div>
        </div>
      </div>

      {/* Phased Implementation */}
      <div id="phases" className="phases">
        <h2 className="section-title animate-on-scroll">Launch roadmap</h2>
        <div className="phase-steps">
          <div className="phase animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="phase-number">01</div>
            <h4>Phase 1</h4>
            <p>Service Marketplace MVP — Connect users to trusted local pros in Sunyani.</p>
          </div>
          <div className="phase animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="phase-number">02</div>
            <h4>Phase 2</h4>
            <p>Delivery & Logistics Integration — On-demand rider network & tracking.</p>
          </div>
          <div className="phase animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="phase-number">03</div>
            <h4>Phase 3</h4>
            <p>Group Buying & Social Commerce — Collaborative purchasing to reduce costs.</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section animate-on-scroll">
        <div className="stat-card">
          <div className="stat-number" data-target="5000">70000</div>
          <div className="stat-label">Expected Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target="100">10000</div>
          <div className="stat-label">Verified Artisans</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target="50">30000</div>
          <div className="stat-label">Delivery Riders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target="24">2000000</div>
          <div className="stat-label">Hours Support</div>
        </div>
      </div>

      {/* Coming Soon Signup */}
      <div id="signup-section" className="coming-soon animate-on-scroll">
        <h2>Be the first to know</h2>
        <p>SureLink is launching soon in Sunyani. Join the waitlist for early access, exclusive discounts & updates.</p>
        <form onSubmit={handleSignup} className="signup-form">
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className="cta-button pulse">Notify Me</button>
        </form>
        {formMsg && <div className="form-message">{formMsg}</div>}
      </div>

      {/* Footer */}
      <div className="footer">
        <p>📍 First launch: Sunyani, Ghana  |  📱 Mobile-first & lightweight  |  💳 Mobile Money integrated</p>
        <p>© 2026 SureLink — Your hyper-local digital infrastructure for trusted services, deliveries & bulk buying.</p>
      </div>

      {/* Modal */}
      <SuccessModal />
    </div>
  );
};

export default Landing;