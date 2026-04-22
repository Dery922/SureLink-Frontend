import React, { useState } from 'react';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [validationStage, setValidationStage] = useState(0);

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value) => {
    if (!value.trim()) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailBlur = () => {
    const emailError = validateEmail(email);
    setFieldErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setFieldErrors(prev => ({ ...prev, password: passwordError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setFieldErrors({ email: emailError, password: passwordError });
    
    if (emailError || passwordError) return;

    setLoading(true);
    setValidationStage(1);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setValidationStage(2);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      onSuccess({
        id: 1,
        email,
        name: 'User',
        role: 'consumer'
      });
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
      setLoading(false);
      setValidationStage(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0057FF] via-[#0057FF] to-[#003BA3] flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Value Proposition */}
          <div className="text-white space-y-8 md:pr-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Welcome back to SureLink
              </h1>
              <p className="text-lg text-blue-100">
                Connect with skilled professionals and grow your business
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <i className="fas fa-check text-[#0057FF]"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Verified Professionals</h3>
                  <p className="text-blue-100">Connect with screened and rated service providers</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <i className="fas fa-shield-alt text-[#0057FF]"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">100% Secure</h3>
                  <p className="text-blue-100">Your data is encrypted and protected with industry standards</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <i className="fas fa-clock text-[#0057FF]"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Instant Access</h3>
                  <p className="text-blue-100">Get matched with professionals in minutes, not days</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-300">
              <p className="text-sm text-blue-100 mb-2">Trusted by</p>
              <div className="flex gap-6 items-center">
                <div className="text-center">
                  <div className="text-xl font-bold">50K+</div>
                  <div className="text-xs text-blue-100">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">4.9★</div>
                  <div className="text-xs text-blue-100">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">10K+</div>
                  <div className="text-xs text-blue-100">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2">Sign in to your account</h2>
              <p className="text-gray-600">Enter your details to regain access to SureLink</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5 flex-shrink-0"></i>
                <div>
                  <p className="font-semibold text-red-900">Authentication Failed</p>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Loading Progress */}
            {loading && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-spinner-third animate-spin text-[#0057FF]"></i>
                  <span className="text-sm font-medium text-[#0057FF]">
                    {validationStage === 1 && 'Verifying credentials...'}
                    {validationStage === 2 && 'Loading your profile...'}
                  </span>
                </div>
                <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-[#0057FF] to-[#3A9AFF] transition-all duration-700 ${
                      validationStage === 1 ? 'w-1/2' : validationStage === 2 ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onBlur={handleEmailBlur}
                    disabled={loading}
                    className={`w-full px-4 py-3 pl-4 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                      fieldErrors.email 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 bg-white focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100'
                    } disabled:bg-gray-50`}
                    required
                  />
                  {!fieldErrors.email && email && (
                    <i className="fas fa-check text-green-500 absolute right-4 top-1/2 -translate-y-1/2"></i>
                  )}
                  {fieldErrors.email && (
                    <i className="fas fa-times text-red-500 absolute right-4 top-1/2 -translate-y-1/2"></i>
                  )}
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <i className="fas fa-info-circle"></i>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#0057FF] hover:text-blue-600 font-semibold transition-colors hover:underline"
                    onClick={() => alert('Password reset flow - Coming soon')}
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onBlur={handlePasswordBlur}
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-sm pr-12 ${
                      fieldErrors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 bg-white focus:border-[#0057FF] focus:ring-2 focus:ring-blue-100'
                    } disabled:bg-gray-50`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <i className="fas fa-info-circle"></i>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-[#0057FF] cursor-pointer rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0057FF] to-[#003BA3] text-white font-semibold py-3 rounded-lg hover:shadow-lg active:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner-third animate-spin"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign in to SureLink
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Alternative Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => alert('Google login - Phase 2')}
                className="border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <i className="fab fa-google text-red-500"></i>
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => alert('Phone login - Phase 2')}
                className="border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <i className="fas fa-mobile-alt text-[#0057FF]"></i>
                <span className="text-sm">Phone</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-700">
                Don't have an account?{' '}
                <button className="text-[#0057FF] font-semibold hover:text-blue-600 transition-colors">
                  Create one
                </button>
              </p>
            </div>

            {/* Security Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <i className="fas fa-lock text-gray-400"></i>
                256-bit SSL
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <i className="fas fa-shield-alt text-gray-400"></i>
                GDPR Compliant
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <i className="fas fa-check-circle text-gray-400"></i>
                Verified Service
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
