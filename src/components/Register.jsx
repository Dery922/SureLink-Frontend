import React, { useState } from 'react';

const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'consumer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      setTimeout(() => {
        onSuccess({
          id: Math.random(),
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.userType
        });
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Get started today</h1>
        <p className="text-sm text-gray-600">Join thousands of users on our trusted marketplace platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-sm text-red-700 animate-slide-down">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold">Registration error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

      {/* Account Type Selection Card */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
          What role describes you best?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'consumer' }))}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              formData.userType === 'consumer'
                ? 'border-[#0057FF] bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } disabled:opacity-60`}
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="text-sm font-semibold text-[#1A1A1A]">I'm a Customer</div>
            <div className="text-xs text-gray-500 mt-1">Looking for services</div>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'provider' }))}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              formData.userType === 'provider'
                ? 'border-[#0057FF] bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } disabled:opacity-60`}
          >
            <div className="text-3xl mb-2">🔧</div>
            <div className="text-sm font-semibold text-[#1A1A1A]">I'm a Provider</div>
            <div className="text-xs text-gray-500 mt-1">Offering services</div>
          </button>
        </div>
      </div>

      {/* Registration Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5 shadow-sm">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100 text-sm transition-all disabled:bg-gray-50"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100 text-sm transition-all disabled:bg-gray-50"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="+233 20 123 4567"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100 text-sm transition-all disabled:bg-gray-50"
            required
          />
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5 shadow-sm">
        <div className="pb-2 border-b border-gray-100 mb-2">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">🔐 Secure your account</h3>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100 text-sm pr-10 transition-all disabled:bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">💡 Use at least 8 characters with a mix of letters and numbers</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100 text-sm pr-10 transition-all disabled:bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 mt-1 accent-[#0057FF] cursor-pointer flex-shrink-0"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
            I agree to the{' '}
            <button type="button" className="text-[#0057FF] font-semibold hover:text-blue-700 transition-colors">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-[#0057FF] font-semibold hover:text-blue-700 transition-colors">
              Privacy Policy
            </button>
            {' '}including how my data will be used
          </label>
        </div>
      </div>

      {/* Primary Action */}
      <button
        type="submit"
        disabled={loading || !termsAccepted}
        className="w-full bg-[#0057FF] text-white font-semibold py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {loading && <span className="animate-spin">⏳</span>}
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="text-xs text-gray-600">
          <span className="block text-lg mb-1">🔒</span>
          Secure data
        </div>
        <div className="text-xs text-gray-600">
          <span className="block text-lg mb-1">✓</span>
          Verified users
        </div>
        <div className="text-xs text-gray-600">
          <span className="block text-lg mb-1">⚡</span>
          Quick approval
        </div>
      </div>

      {/* Sign In Link */}
      <div className="pt-4 text-center border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button className="text-[#0057FF] font-semibold hover:text-blue-700 transition-colors">
            Sign in
          </button>
        </p>
      </div>
      </form>
    </div>
  );
};

export default Register;
